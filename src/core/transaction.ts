import {Context} from './context';
import {Executor} from './executor';
import {Scope} from './keyspace';

export class Transaction<T> {
  constructor(private _run: (ctx: Context) => Promise<T>) {}

  static of<T>(t: T): Transaction<T> {
    return new Transaction(_ => Promise.resolve(t));
  }

  static void(): Transaction<void> {
    return new Transaction(_ => Promise.resolve(null));
  }

  map<U>(f: (t: T) => U): Transaction<U> {
    return new Transaction(ctx => this._run(ctx).then(f));
  }

  map2<U, V>(
    tu: Transaction<U>,
    f: (t: T, u: U) => V
  ): Transaction<V> {
    return this.flatMap(t => tu.map(u => f(t, u)));
  }

  map3<U, V, W>(
    tu: Transaction<U>,
    tv: Transaction<V>,
    f: (t: T, u: U, v: V) => W
  ): Transaction<W> {
    return this.flatMap(t => tu.map2(tv, (u, v) => f(t, u, v)));
  }

  map4<U, V, W, X>(
    tu: Transaction<U>,
    tv: Transaction<V>,
    tw: Transaction<W>,
    f: (t: T, u: U, v: V, w: W) => X
  ): Transaction<X> {
    return this.flatMap(t => tu.map3(tv, tw, (u, v, w) => f(t, u, v, w)));
  }

  flatMap<U>(f: (t: T) => Transaction<U>): Transaction<U> {
    return new Transaction(ctx => this._run(ctx).then(t => f(t)._run(ctx)));
  }

  async exec(scope: Scope, e: Executor): Promise<T> {
    return e.exec(scope, async (backend) => {
      const ctx = new Context(scope, backend);
      const res = await this._run(ctx);
      const log = ctx.checkpoint();
      return [log, res];
    });
  }
}
