export interface ReadKeyOps {
  exists(): Promise<boolean>;
}

export class ReadKeyConst implements ReadKeyOps {
  exists() {
    return Promise.resolve(true);
  }
}

export interface WriteKeyOps {
  delete(): Promise<void>;
}

export class WriteKeyNoop implements WriteKeyOps {
  delete() {
    return Promise.resolve();
  }
}

export interface ReadStringOps extends ReadKeyOps {
  get(): Promise<string>;
}

export class ReadStringConst extends ReadKeyConst implements ReadStringOps {
  constructor(private _value: string) {
    super();
  }

  get() {
    return Promise.resolve(this._value);
  }
}

export interface WriteStringOps extends WriteKeyOps {
  set(v: string): Promise<void>;
}

export class WriteStringNoop extends WriteKeyNoop implements WriteStringOps {
  set(v: string) {
    return Promise.resolve();
  }
}

export interface ReadListOps extends ReadKeyOps {
  length(): Promise<number>;
}

export class ReadListConst extends ReadKeyConst implements ReadListOps {
  constructor(private _values: Array<string>) {
    super();
  }

  length() {
    return Promise.resolve(this._values.length);
  }
}

export interface WriteListOps extends WriteKeyOps {
  append(vs: Array<string>): Promise<void>;
}

export class WriteListNoop extends WriteKeyNoop implements WriteListOps {
  append(vs: Array<string>) {
    return Promise.resolve();
  }
}
