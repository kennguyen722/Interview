const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-06 problems coverage', async () => {
  assert.equal(P.paymentProviderFactory('stripe').charge(10), 'stripe:10');
  assert.equal(P.strategyDiscountCalculator(100, (x) => x * 0.8), 80);
  const seen = []; assert.equal(P.observerPipelineAuditEvents([(e) => seen.push(e)], 'x'), 1);
  const bus = P.commandBusWithMiddlewareChain((c) => c + '!', [(cmd, next) => next() + '?']);
  assert.equal(bus('go'), 'go!?');
  assert.equal(P.repositoryWithTenantGuard([{ tenantId: 't1' }, { tenantId: 't2' }], 't1').length, 1);
  const bff = await P.bffPartialFailureFallback([async () => 1, async () => { throw new Error('x'); }]);
  assert.deepEqual(bff, [1, null]);
  const sm = P.workflowStateMachine({ idle: { START: 'run' } }, 'idle'); assert.equal(sm.send('START'), 'run');
  const s = new Set(); assert.equal(P.outboxConsumerIdempotency(s, 'm1', () => {}), true);
  assert.equal(P.eventSchemaVersioningChecker('v1', ['v1']), true);
  assert.match(P.adrGeneratorUtility({ title: 'A', decision: 'B' }), /ADR/);
  assert.equal(P.buildVsBuyDecisionMatrixTool([{ score: 1 }, { score: 2 }]).score, 2);
  assert.equal(P.featureRolloutStrategyEvaluator({ errorRate: 0.01 }), 'continue');
  assert.equal(P.serviceBoundaryDecompositionExercise([{ domain: 'd', name: 'x' }]).d[0], 'x');
  assert.equal(P.migrationRouterStranglerPattern({ '/new': 'new' })('/old'), 'legacy');
  assert.equal(P.architectureReviewChecklistScorer([{ ok: true }, { ok: false }]).pass, 1);
});
