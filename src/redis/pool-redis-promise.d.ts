declare module 'pool-redis-promise' {
  export = class PoolRedisPromise {
    constructor(config: Object);
    getClientAsync(callback: (client: any) => void): void;
  }
}
