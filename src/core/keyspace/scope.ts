import {Kind, Key} from './key';

export class ScopeError extends Error {
  constructor(public key: Key, descr: string) {
    super();
    this.name = 'ScopeError';
    this.message = `${key}: ${descr}`;
  }
}

export class Scope {
  constructor(private _map: {[key: string]: Kind}) {}

  static fromKeys(keys: Array<Key>): Scope {
    const scope = new Scope({});
    keys.forEach(key => {
      scope._map[key.toString()] = key.kind;
    });
    return scope;
  }

  get keys(): Array<Key> {
    return Object.keys(this._map).map(key => {
      return new Key(key, this._map[key]);
    });
  }

  contains(key: Key): boolean {
    const kind = this._map[key.toString()];
    if (typeof kind === 'undefined') {
      return false;
    }
    if (kind === null) {
      return false;
    }
    if (kind !== key.kind) {
      return false;
    }
    return true;
  }

  guard(key: Key, pred: (kind: Kind) => boolean): void {
    if (!this.contains(key)) {
      throw new ScopeError(key, 'key not found');
    }
    if (!pred(key.kind)) {
      throw new ScopeError(key, 'key has wrong kind');
    }
  }
}
