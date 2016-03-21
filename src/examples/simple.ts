import * as tx from '../index';

const k = new tx.Key('foo', tx.Kind.String);
const s = tx.Scope.fromKeys([k]);

const t = new tx.Transaction(async (ctx) => {
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

const k2 = new tx.Key('bar', tx.Kind.List);
const s2 = tx.Scope.fromKeys([k2]);

const t2 = new tx.Transaction(async (ctx) => {
  const exists1 = await ctx.withKey(k2).exists();
  const get1 = await ctx.withListAt(k2).length();
  await ctx.withListAt(k2).append(['bar']);
  const exists2 = await ctx.withKey(k2).exists();
  const get2 = await ctx.withListAt(k2).length();
  await ctx.withListAt(k2).append(['baz']);
  const exists3 = await ctx.withKey(k2).exists();
  const get3 = await ctx.withListAt(k2).length();
  console.log(exists1, exists2, exists3);
  console.log(get1, get2, get3);
});

const p = new tx.redis.Pool({});
const c = new tx.redis.Redis(p);

t.exec(s, c);
t2.exec(s2, c);
