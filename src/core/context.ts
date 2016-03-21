import {Kind, Key, Scope} from './keyspace';
import {Op, Log} from './log';
import {Model} from './model';
import {ReadBackend, WriteBackend} from './backend';
import * as ops from './ops';

class InternalContext {
  public log: Log;

  constructor(private _backend: ReadBackend) {
    this.log = Log.empty();
  }

  write(f: (backend: WriteBackend) => Promise<void>): Promise<void> {
    this.log = this.log.append(new Op(f));
    return Promise.resolve();
  }

  read<A>(f: (backend: ReadBackend) => Promise<A>): Promise<A> {
    const model = new Model(this._backend, this.log);
    return f(model);
  }
}

class KeyOps implements ops.ReadKeyOps, ops.WriteKeyOps {
  constructor(protected _key: Key, protected _internalCtx: InternalContext) {}

  exists() {
    return this._internalCtx.read(_ => _.withKey(this._key).exists());
  }

  delete() {
    return this._internalCtx.write(_ => _.withKey(this._key).delete());
  }
}

class StringOps extends KeyOps implements ops.ReadStringOps, ops.WriteStringOps {
  get() {
    return this._internalCtx.read(_ => _.withStringAt(this._key).get());
  }

  set(v: string) {
    return this._internalCtx.write(_ => _.withStringAt(this._key).set(v));
  }
}

class ListOps extends KeyOps implements ops.ReadListOps, ops.WriteListOps {
  length() {
    return this._internalCtx.read(_ => _.withListAt(this._key).length());
  }

  append(vs: Array<string>) {
    return this._internalCtx.write(_ => _.withListAt(this._key).append(vs));
  }
}

export class Context implements ReadBackend, WriteBackend {
  private _internalCtx: InternalContext;

  constructor(private _scope: Scope, backend: ReadBackend) {
    this._internalCtx = new InternalContext(backend);
  }

  checkpoint(): Log {
    return this._internalCtx.log;
  }

  rollback(log: Log): void {
    this._internalCtx.log = log;
  }

  withKey(key: Key): ops.ReadKeyOps & ops.WriteKeyOps {
    this._scope.guard(key, kind => true);
    return new KeyOps(key, this._internalCtx);
  }

  withStringAt(key: Key): ops.ReadStringOps & ops.WriteStringOps {
    this._scope.guard(key, kind => kind === Kind.String);
    return new StringOps(key, this._internalCtx);
  }

  withListAt(key: Key): ops.ReadListOps & ops.WriteListOps {
    this._scope.guard(key, kind => kind === Kind.List);
    return new ListOps(key, this._internalCtx);
  }
}
