import {Kind, Key} from '../keyspace';
import {ReadBackend} from '../backend';
import {Log} from '../log';
import * as ops from '../ops';
import {StringGetVal, ListLengthVal} from './values';
import {StringWriteBackend, ListWriteBackend} from './write';

class StringOps implements ops.ReadStringOps {
  constructor(protected _key: Key, protected _backend: ops.ReadStringOps, protected _log: Log) {}

  async exists() {
    const val = new StringGetVal(this._backend);
    await this._log.run(new StringWriteBackend(this._key, val));
    return val.exists();
  }

  async get() {
    const val = new StringGetVal(this._backend);
    await this._log.run(new StringWriteBackend(this._key, val));
    return val.get();
  }
}

class ListOps implements ops.ReadListOps {
  constructor(protected _key: Key, protected _backend: ops.ReadListOps, protected _log: Log) {}

  async exists() {
    const val = new ListLengthVal(this._backend);
    await this._log.run(new ListWriteBackend(this._key, val));
    return val.exists();
  }

  async length() {
    const val = new ListLengthVal(this._backend);
    await this._log.run(new ListWriteBackend(this._key, val));
    return val.length();
  }
}

export class Model {
  constructor(private _backend: ReadBackend, private _log: Log) {}

  withKey(key: Key): ops.ReadKeyOps {
    switch (key.kind) {
      case Kind.String: return this.withStringAt(key);
      case Kind.List: return this.withListAt(key);
      default: throw new Error('unknown kind');
    }
  }

  withStringAt(key: Key): ops.ReadStringOps {
    return new StringOps(key, this._backend.withStringAt(key), this._log);
  }

  withListAt(key: Key): ops.ReadListOps {
    return new ListOps(key, this._backend.withListAt(key), this._log);
  }
}
