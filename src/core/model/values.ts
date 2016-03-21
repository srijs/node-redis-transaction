import {Fact} from './fact';
import * as ops from '../ops';

export class Val<X extends ops.ReadKeyOps> implements ops.ReadKeyOps, ops.WriteKeyOps {
  protected _exists: Fact<boolean>;
  constructor(protected _backend: X) {
    this._exists = new Fact(() => this._backend.exists());
  }

  async exists() {
    return this._exists.get();
  }

  async delete() {
    this._exists.set(false);
  }
}

export type KeyVal = Val<ops.ReadKeyOps>

export class StringGetVal extends Val<ops.ReadStringOps> implements ops.ReadStringOps, ops.WriteStringOps {
  private _val: Fact<string>;
  constructor(_backend: ops.ReadStringOps) {
    super(_backend);
    this._val = new Fact(() => this._backend.get());
  }

  async get() {
    const exists = await this.exists();
    if (exists) {
      return this._val.get();
    }
  }

  async set(value: string) {
    await this._val.set(value);
    await this._exists.set(true);
  }
}

export class ListLengthVal extends Val<ops.ReadListOps> implements ops.ReadListOps, ops.WriteListOps {
  private _length: Fact<number>;
  constructor(_backend: ops.ReadListOps) {
    super(_backend);
    this._length = new Fact(() => this._backend.length());
  }

  async length() {
    const exists = await this.exists();
    if (exists) {
      return this._length.get();
    } else {
      return 0;
    }
  }

  async append(vs: Array<string>) {
    const length = await this._length.get();
    this._length.set(length + vs.length);
    await this._exists.set(true);
  }
}
