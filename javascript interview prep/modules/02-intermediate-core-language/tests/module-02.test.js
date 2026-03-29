const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('generators and iterators rangeGenerator yields expected values', () => {
  assert.deepEqual([...S.rangeGenerator(2, 5)], [2, 3, 4, 5]);
});

test('property descriptors define read-only value', () => {
  const obj = {};
  S.defineReadOnly(obj, 'env', 'prod');
  obj.env = 'dev';
  assert.equal(obj.env, 'prod');
});

test('optional chaining and nullish coalescing safeGetCity', () => {
  assert.equal(S.safeGetCity({ profile: { address: { city: 'Hanoi' } } }), 'Hanoi');
  assert.equal(S.safeGetCity({}), 'unknown');
});

test('weak map memoization avoids recomputation for same object key', () => {
  let calls = 0;
  const memo = S.weakMemoize((obj) => {
    calls += 1;
    return obj.value * 2;
  });
  const key = { value: 7 };
  assert.equal(memo(key), 14);
  assert.equal(memo(key), 14);
  assert.equal(calls, 1);
});

test('weak set visit tracker marks and checks objects', () => {
  const tracker = S.createVisitTracker();
  const a = { id: 1 };
  const b = { id: 2 };
  tracker.markVisited(a);
  assert.equal(tracker.hasVisited(a), true);
  assert.equal(tracker.hasVisited(b), false);
});

test('symbols can hold private metadata', () => {
  const obj = {};
  S.attachPrivateMeta(obj, { team: 'platform' });
  assert.equal(obj[S.PRIVATE_META].team, 'platform');
});

test('module systems note includes CommonJS and ESM info', () => {
  const note = S.cjsVsEsmNote();
  assert.match(note.cjs, /CommonJS/i);
  assert.match(note.esm, /ESM/i);
});
