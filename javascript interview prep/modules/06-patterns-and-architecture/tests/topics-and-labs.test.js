const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../solution/topics-and-labs');

test('module-06 topics and labs coverage', async () => {
  assert.match(T.solidCleanArchitectureTopic(['api', 'domain']), /api/);
  assert.equal(T.patternCatalogTopic('strategy'), true);
  assert.equal(T.repositoryServiceLayersTopic([1], (r) => r.length), 1);
  assert.deepEqual(T.bffApiGatewayPatternsTopic([() => ({ a: 1 }), () => ({ b: 2 })]), { a: 1, b: 2 });
  assert.equal(T.eventDrivenSagaOutboxTopic([{ id: 1 }])[0].outbox, true);
  assert.equal(T.monolithToModularMigrationTopic([{ extracted: true }, { extracted: false }]), 1);
  assert.equal((await T.bffDashboardAggregatorLab([() => ({ k: 'v' })])).k, 'v');
  assert.equal(T.sagaOrchestrationSimulatorLab([(x) => x + 1], 1), 2);
  assert.equal(T.outboxProcessorReplayHandlerLab([{ status: 'pending' }])[0].status, 'processed');
  assert.equal(T.pluggablePolicyEngineLab([(c) => c.ok], { ok: true }), true);
  assert.equal(T.adrTemplateArchitectureScorecardsLab([{ ok: true }]).pass, 1);
});
