const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../solution/topics-and-labs');

test('module-08 topics and labs coverage', () => {
  assert.equal(T.largeScaleSystemDesignTopic({ services: 5, regions: 2 }).services, 5);
  assert.equal(T.capacityCostPerformanceTradeoffTopic(100, 0.1).estimatedCost, 10);
  assert.equal(T.sloErrorBudgetGovernanceTopic(99.9, 99.0).met, false);
  assert.equal(T.multiRegionDisasterRecoveryTopic(['us-east', 'us-west']).secondary, 'us-west');
  assert.equal(T.incidentLeadershipPostmortemTopic({ commander: 'alice', actions: [1, 2] }).actionItems, 2);
  assert.equal(T.mentoringStrategyInfluenceTopic({ mentees: 3, roadmap: true }).roadmap, true);
  assert.equal(T.notificationPlatformDesignLab(['email']).length, 1);
  assert.equal(T.incidentCommandSimulationLab(['triage'])[0].step, 1);
  assert.equal(T.adrRoadmapSetLab(['decide'])[0].status, 'accepted');
  assert.equal(T.reliabilityScorecardLab([{ name: 'svc', sloMet: true }])[0].score, 1);
  assert.equal(T.principalReadinessRubricLab([{ met: true }, { met: false }]).pass, 1);
});
