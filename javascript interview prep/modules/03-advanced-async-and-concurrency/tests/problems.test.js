const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-03 problems coverage', async () => {
  assert.deepEqual(await P.promiseAllLite([Promise.resolve(1), Promise.resolve(2)]), [1, 2]);
  assert.equal(await P.promiseAnyLite([Promise.reject(new Error('x')), Promise.resolve('ok')]), 'ok');
  assert.deepEqual(await P.queueWithMaxConcurrency([async () => 1, async () => 2], 1), [1, 2]);
  const bucket = P.tokenBucketLimiterAdapter({ capacity: 1, refill: 1 });
  assert.equal(bucket.allow(), true);
  assert.equal(bucket.allow(), false);
  assert.equal(bucket.refillTick(), 1);
  const cb = P.circuitBreakerFsm(); cb.fail(); assert.equal(cb.state(), 'OPEN');
  const guarded = P.bulkheadGuard(1); assert.equal(await guarded(async () => 1), 1);
  let saved = null; const deb = P.debouncedAutosaveWithCancellation((v) => { saved = v; }, 1); deb.schedule('x');
  await new Promise((r) => setTimeout(r, 5)); assert.equal(saved, 'x');
  const cache = P.asyncCacheSwr(async (k) => k + '!'); assert.equal(await cache('a'), 'a!');
  const retry = P.jobRetryScheduler(async () => 'ok', 1); assert.equal(await retry(), 'ok');
  assert.equal(P.deadLetterQueueSimulation([{ status: 'failed' }, { status: 'ok' }]).length, 1);
  const store = new Map(); assert.equal(P.idempotentConsumerLogic(store, 'id', () => 42).duplicate, false);
  assert.equal(P.eventReplayOrderingChecks([{ seq: 1 }, { seq: 2 }]), true);
  assert.equal(P.longRunningWorkflowHeartbeat(1000, 2).healthy(1), true);
  await assert.rejects(() => P.connectionPoolTimeoutWrapper(() => new Promise((r) => setTimeout(r, 50)), 5), /POOL_TIMEOUT/);
  assert.equal(P.adaptiveTimeoutFromP95([10, 20, 30], 2), 60);
});
