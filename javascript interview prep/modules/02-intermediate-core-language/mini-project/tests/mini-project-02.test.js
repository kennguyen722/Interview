const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('runPlugins yields ordered plugin updates', () => {
  const plugins = [
    { name: 'p1', run: () => ({ a: 1 }) },
    { name: 'p2', run: (ctx) => ({ b: (ctx.a || 0) + 2 }) },
  ];
  const steps = [...S.runPlugins(plugins, {})];
  assert.equal(steps.length, 2);
  assert.deepEqual(steps[1].context, { a: 1, b: 3 });
});

test('createLockedConfig makes properties non-writable', () => {
  const cfg = S.createLockedConfig({ env: 'prod' });
  cfg.env = 'dev';
  assert.equal(cfg.env, 'prod');
});

test('createWeakObjectMemo caches by object identity', () => {
  let calls = 0;
  const memo = S.createWeakObjectMemo((obj) => {
    calls += 1;
    return obj.value * 10;
  });
  const x = { value: 3 };
  assert.equal(memo(x), 30);
  assert.equal(memo(x), 30);
  assert.equal(calls, 1);
});

test('projectUserSummary uses optional chaining and nullish fallback', () => {
  assert.deepEqual(S.projectUserSummary({ id: 'u1', profile: { email: 'a@b.com' } }), {
    id: 'u1',
    email: 'a@b.com',
    city: 'unknown',
  });
});

test('moduleSystemBrief mentions CommonJS and ESM', () => {
  const note = S.moduleSystemBrief();
  assert.match(note.commonjs, /CommonJS/i);
  assert.match(note.esm, /ESM/i);
});
