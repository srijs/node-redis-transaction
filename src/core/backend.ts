import {Key} from './keyspace';
import * as ops from './ops';

export interface WriteBackend {
  withKey(k: Key): ops.WriteKeyOps;
  withStringAt(k: Key): ops.WriteStringOps;
  withListAt(k: Key): ops.WriteListOps;
}

export interface ReadBackend {
  withKey(k: Key): ops.ReadKeyOps;
  withStringAt(k: Key): ops.ReadStringOps;
  withListAt(k: Key): ops.ReadListOps;
}
