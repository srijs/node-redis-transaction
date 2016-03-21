import {Key} from '../keyspace';
import {WriteBackend} from '../backend';
import * as ops from '../ops';

export class StringWriteBackend implements WriteBackend {
  constructor(private _key: Key, private _backend: ops.WriteStringOps) {}

  withKey(key: Key): ops.WriteKeyOps {
    if (this._key.equals(key)) {
      return this._backend;
    } else {
      return new ops.WriteKeyNoop();
    }
  }

  withListAt(key: Key) {
    return new ops.WriteListNoop();
  }

  withStringAt(key: Key) {
    if (this._key.equals(key)) {
      return this._backend;
    } else {
      return new ops.WriteStringNoop();
    }
  }
}

export class ListWriteBackend implements WriteBackend {
  constructor(private _key: Key, private _backend: ops.WriteListOps) {}

  withKey(key: Key): ops.WriteKeyOps {
    if (this._key.equals(key)) {
      return this._backend;
    } else {
      return new ops.WriteKeyNoop();
    }
  }

  withStringAt(key: Key) {
    return new ops.WriteStringNoop();
  }

  withListAt(key: Key) {
    if (this._key.equals(key)) {
      return this._backend;
    } else {
      return new ops.WriteListNoop();
    }
  }
}
