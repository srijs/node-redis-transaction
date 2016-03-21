'use strict';

import {ReadBackend, WriteBackend} from '../core/backend';
import * as ops from '../core/ops';
import {Key, Scope} from '../core/keyspace';
import {Run, Executor} from '../core/executor';

import {Pool} from './wrapper';
import * as redis from './wrapper';

export { Pool }

class KeyOps implements ops.WriteKeyOps {
  constructor(protected _key: Key, protected _multi: redis.Multi) {}

  delete(): Promise<void> {
    return Promise.resolve(this._multi.del(this._key.toString()));
  }
}

class StringOps extends KeyOps implements ops.WriteStringOps {
  set(v: string): Promise<void> {
    return Promise.resolve(this._multi.set(this._key.toString(), v));
  }
}

class ListOps extends KeyOps implements ops.WriteListOps {
  append(vs: Array<string>): Promise<void> {
    return Promise.resolve(this._multi.rpush(this._key.toString(), vs));
  }
}

class Multi implements WriteBackend {
  constructor(private _multi: redis.Multi) {}

  withKey(key: Key): ops.WriteKeyOps {
    return new KeyOps(key, this._multi);
  }

  withStringAt(key: Key): ops.WriteStringOps {
    return new StringOps(key, this._multi);
  }

  withListAt(key: Key): ops.WriteListOps {
    return new ListOps(key, this._multi);
  }

  exec(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._multi.exec((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

class ReadKeyOps implements ops.ReadKeyOps {
  constructor(protected _key: Key, protected _client: redis.Client) {}

  async exists() {
    const res = await this._client.existsAsync(this._key.toString());
    return !!res;
  }
}

class ReadListOps extends ReadKeyOps implements ops.ReadListOps {
  length() {
    return this._client.llenAsync(this._key.toString());
  }
}

class ReadStringOps extends ReadKeyOps implements ops.ReadStringOps {
  get() {
    return this._client.getAsync(this._key.toString());
  }
}

class WatchingClient implements ReadBackend {
  constructor(private _client: redis.Client) {}

  withKey(key: Key): ops.ReadKeyOps {
    return new ReadKeyOps(key, this._client);
  }

  withStringAt(key: Key): ops.ReadStringOps {
    return new ReadStringOps(key, this._client);
  }

  withListAt(key: Key): ops.ReadListOps {
    return new ReadListOps(key, this._client);
  }
}

class Client {
  constructor(private _client: redis.Client) {}

  async watching<T>(scope: Scope, f: (watchingClient: WatchingClient) => Promise<T>): Promise<T> {
    await this._client.watchAsync(scope.keys.map(key => key.toString()));
    try {
      return f(new WatchingClient(this._client));
    } finally {
      await this._client.unwatchAsync();
    }
  }

  multi(): Multi {
    return new Multi(this._client.multi());
  }

  static fromPool<T>(pool: Pool, f: (client: Client) => Promise<T>): Promise<T> {
    return pool.withClient(redisClient => {
      return f(new Client(redisClient));
    });
  }
}

export class Redis implements Executor {
  constructor(private _pool: Pool) {}

  exec<T>(scope: Scope, f: Run<T>): Promise<T> {
    return Client.fromPool(this._pool, (client: Client) => {
      return client.watching(scope, async (watchingClient: WatchingClient) => {
        const res = await f(watchingClient);
        const log = res[0];
        const writeBackend = client.multi();
        await log.run(writeBackend);
        await writeBackend.exec();
        return res[1];
      });
    });
  }
}
