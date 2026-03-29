const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-02 problems coverage', () => {
  const bound = P.customBind(function add(a, b) { return this.x + a + b; }, { x: 1 }, 2);
  assert.equal(bound(3), 6);
  const src = { a: 1 }; src.self = src;
  assert.equal(P.deepCloneCircular(src).self.a, 1);
  assert.equal(P.safeDeepMerge({ a: { b: 1 } }, { a: { c: 2 }, __proto__: { bad: 1 } }).a.c, 2);
  assert.equal(P.immutableCartUpdate([{ id: 1, qty: 1 }], { id: 1, qty: 2 })[0].qty, 3);
  assert.equal(P.moduleDependencyGraph([{ name: 'a', deps: ['b'] }]).a[0], 'b');
  assert.equal(P.dynamicRuleExecutor([(x) => x + 1, (x) => x * 2], 2), 6);
  assert.match(P.classVsFactoryRefactor('class'), /prototype/i);
  assert.equal(P.composeValidators([(v) => (!v ? 'required' : null)])(''), 'required');
  const rp = P.reversiblePipeline([{ forward: (x) => x + 1, reverse: (x) => x - 1 }], 1);
  assert.equal(rp.backward, 1);
  assert.equal(P.objectDiff({ a: 1 }, { a: 2 }).a.to, 2);
  assert.equal(P.mapPayloadToDomainEntity({ user_id: 'u1', email: 'A@B.COM', is_active: 1 }).email, 'a@b.com');
  assert.equal(P.partialApply((a, b) => a + b, 2)(3), 5);
  const memo = P.memoizeWithResolver((x) => x * 2);
  assert.equal(memo(3), 6);
  assert.equal(P.parseFeatureFlags('a,b').a, true);
  assert.equal(P.buildCommandHandlerRegistry([['ping', () => 'pong']]).run('ping'), 'pong');
});
