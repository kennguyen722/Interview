const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const T = require('../solution/topics-and-labs');

test('module-03 topics and labs coverage', async () => {
  assert.equal(T.eventLoopTopic(['sync', 'micro', 'macro']), 'sync->micro->macro');
  assert.deepEqual(await T.promiseCombinatorsTopic([Promise.resolve(1), Promise.reject(new Error('x'))]), ['fulfilled', 'rejected']);
  assert.equal((await T.asyncAwaitErrorBoundaryTopic(async () => { throw new Error('x'); })).ok, false);
  assert.equal(T.cancellationAbortControllerTopic({ aborted: false }), 'active');
  assert.deepEqual(await T.concurrencyPoolTopic([async () => 1, async () => 2], 1), [1, 2]);
  assert.equal(await T.retryBackoffJitterTopic(async () => 'ok', 1), 'ok');
  assert.equal(await T.nodeStreamsBasicsTopic(Readable.from(['ab', 'c'])), 3);
  assert.equal(T.backpressureConceptTopic(false), 'wait-drain');
  assert.equal(T.abortSignalsTopic({ aborted: true }), 'cancelled');
  assert.deepEqual(await T.boundedConcurrencyTaskRunnerLab([async () => 1]), [1]);
  await assert.rejects(() => T.timeoutCancellationFetchLab(() => new Promise((r) => setTimeout(r, 50)), 5), /TIMEOUT/);
  const coalescer = T.inflightRequestCoalescerLab();
  assert.equal(await coalescer('k', () => 7), 7);
  assert.equal(await T.retryWrapperLab(async () => 'x', 1), 'x');
  const q = T.inMemoryQueueBackpressureLab(1);
  assert.equal(q.push(1), true);
  assert.equal(q.push(2), false);
});
