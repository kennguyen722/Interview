const test = require('node:test');
const assert = require('node:assert/strict');

const { createPacingEngine } = require('../../../mock-02');

test('medium mock-02: returns THROTTLE when ahead of pacing', () => {
  const engine = createPacingEngine({ campaigns: [{ campaignId: 'c1', totalBudget: 100, startMs: 0, endMs: 100 }] });
  engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 10, amount: 20 });
  const decision = engine.getPacingDecision('c1', 10);
  assert.equal(decision.status, 'THROTTLE');
});
