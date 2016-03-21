import {Scope} from './keyspace';
import {Log} from './log';
import {ReadBackend} from './backend';

export type Run<T> = (backend: ReadBackend) => Promise<[Log, T]>;

export interface Executor {
  exec<T>(scope: Scope, f: Run<T>): Promise<T>;
}
