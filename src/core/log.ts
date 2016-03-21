import {WriteBackend} from './backend';

export class Op {
  constructor(private _run: (backend: WriteBackend) => Promise<void>) {}

  run(backend: WriteBackend): Promise<void> {
    return this._run(backend);
  }
}

export class Log {
  constructor(private _ops: Array<Op>) {}

  static empty() {
    return new Log([]);
  }

  append(op: Op): Log {
    return new Log(this._ops.concat(op));
  }

  async run(backend: WriteBackend): Promise<void> {
    for (let op of this._ops) {
      await op.run(backend);
    }
  }
}
