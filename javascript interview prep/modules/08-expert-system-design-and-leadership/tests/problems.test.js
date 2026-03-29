const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-08 problems coverage', () => {
  assert.equal(P.capacityEstimatorDauGrowth({ dau: 100, growthRate: 0.01, days: 1 }), 101);
  assert.equal(P.sloPolicyGenerator(1, [0.5, 2])[1].alert, 'page');
  assert.equal(P.multiRegionRoutingPolicyEvaluator(['us', 'eu'], { us: 50, eu: 30 })[0], 'eu');
  assert.match(P.failoverConsistencyTradeoffAnalyzer('strong'), /latency/);
  assert.equal(P.technicalDebtPrioritizationMatrix([{ impact: 1, risk: 1 }, { impact: 2, risk: 2 }])[0].impact, 2);
  assert.equal(P.postmortemActionQualityScorer([{ owner: 'a', dueDate: 'd', measurable: true }]).score, 1);
  assert.equal(P.reviewFindingPrioritizerByRisk([{ risk: 1 }, { risk: 3 }])[0].risk, 3);
  assert.equal(P.governanceModelSharedLibraries(10).requiredApprovals, 2);
  assert.equal(P.buildVsBuyScoringEngine([{ costScore: 1, speedScore: 1, controlScore: 1 }]).total, 3);
  assert.equal(P.serviceMaturityAssessmentModel({ sloMet: true, hasTracing: true }).reliability, 'mature');
  assert.equal(P.leadershipPlanReliabilityInitiative(['x']).length, 1);
  assert.equal(P.secureRolloutPolicyRiskTier('high').canary, 5);
  assert.equal(P.migrationRoadmapRollbackGates(['phase1'])[0].gate, 'rollback-gate-1');
  assert.equal(P.kpiPlannerPlatformAdoption({ activated: 50, total: 100, retained30d: 25 }).activationRate, 0.5);
  assert.match(P.principalInterviewAnswerFrameworkBuilder('scalability'), /Tradeoffs/);
});
