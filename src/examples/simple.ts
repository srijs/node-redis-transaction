import {Key, Kind, Scope, Transaction} from '../core';
import {Redis, Pool} from '../redis';

const k = new Key('foo', Kind.String);
const s = Scope.fromKeys([k]);

const t = new Transaction(async (ctx) => {
  const exists1 = await ctx.withKey(k).exists();
  const get1 = await ctx.withStringAt(k).get();
  await ctx.withStringAt(k).set('bar');
  const exists2 = await ctx.withKey(k).exists();
  const get2 = await ctx.withStringAt(k).get();
  await ctx.withStringAt(k).set('baz');
  const exists3 = await ctx.withKey(k).exists();
  const get3 = await ctx.withStringAt(k).get();
  console.log(exists1, exists2, exists3);
  console.log(get1, get2, get3);
});

const p = new Pool({});
const c = new Redis(p);

t.exec(s, c);
