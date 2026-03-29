const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const T = require('../solution/topics-and-labs');

test('module-05 topics and labs coverage', async () => {
  assert.equal(T.apiContractValidationTopic({ id: 'number' }, { id: 1 }).valid, true);
  assert.equal(T.errorTaxonomyResponseMappingTopic({ code: 'AUTH' }), 401);
  const store = new Map();
  assert.equal(T.idempotencyTransactionalSafetyTopic(store, 'k', () => 2), 2);
  assert.equal(T.cursorPaginationFilteringTopic([1, 2, 3], 0, 2).items.length, 2);
  const limiter = T.rateLimitingMiddlewareArchitectureTopic(1);
  assert.equal(limiter(), true);
  assert.equal(limiter(), false);
  assert.equal(T.observabilityGracefulShutdownTopic(0).canShutdown, true);
  assert.equal(await T.nodeStreamsIngestionTopic(Readable.from(['a\n', 'b\n'])), 2);
  assert.equal(T.backpressureSafeWriteTopic(false), 'drain');
  assert.equal(T.idempotentOrderApiLab(new Map(), { id: 'o1' }).duplicate, false);
  assert.equal(T.stableCursorPaginationLab([1, 2, 3], 2, 0).nextCursor, 2);
  assert.equal(T.rateLimiterMiddlewarePackLab(1)(), true);
  assert.equal(T.gracefulShutdownDrainLab(1).canShutdown, false);
  assert.equal(T.multiTenantRepositoryGuardLab([{ tenantId: 't1' }], 't1').length, 1);
});
