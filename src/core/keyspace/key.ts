export enum Kind {
  String,
  List
}

export class Key {
  constructor(private _key: string, private _kind: Kind) {}

  toString(): string {
    return this._key.toString();
  }

  get kind(): Kind {
    return this._kind;
  }

  equals(other: Key) {
    return this._key === other._key && this._kind === other._kind;
  }
}
