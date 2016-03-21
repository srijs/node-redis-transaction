/// <reference path="./pool-redis-promise.d.ts"/>

import PoolRedisPromise = require('pool-redis-promise')

export class Pool {
  private pool: any;

  constructor(private config: Object) {
    this.pool = new PoolRedisPromise(config);
  }

  withClient<T>(callback: (client: Client) => Promise<T>): Promise<T> {
    return this.pool.getClientAsync(callback);
  }
}

export interface Client {
  existsAsync(key: string): Promise<boolean>;
  getAsync(key: string): Promise<string>;
  llenAsync(key: string): Promise<number>;
  lrangeAsync(key: string, start: number, end: number): Promise<Array<string>>;
  multi(...args: any[]): Multi;
  watchAsync(keys: Array<string>): Promise<void>;
  unwatchAsync(): Promise<void>;
}

export interface Multi {
  set<T>(key: string, value: T): void;
  get(key: string): void;
  del(key: string): void;
  pexpire(key: string, ttl: number): void;
  pttl(key: string): void;
  lrange(key: string, start: number, end: number): void;
  rpush(key: string, values: string[]): void;

  exec(cb: (err: Error, res: Array<any>) => void): void;
}
