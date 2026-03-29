const test = require('node:test');
const assert = require('node:assert/strict');

const { createPacingEngine } = require('../../../mock-02');

test('hard mock-02: daily cap can pause campaign', () => {
  const start = Date.UTC(2026, 0, 1, 0, 0, 0);
  const engine = createPacingEngine({
    campaigns: [{ campaignId: 'c1', totalBudget: 1000, startMs: start, endMs: start + 86400000, dailyCap: 50 }],
  });

  engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: start + 1000, amount: 60 });
  const out = engine.getPacingDecision('c1', start + 2000);
  assert.equal(out.status, 'PAUSED');
});
