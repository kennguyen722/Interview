const test = require('node:test');
const assert = require('node:assert/strict');

const { createPacingEngine } = require('../mock-02');

test('attempt mock-02 dedupes and returns decision shape', () => {
  const engine = createPacingEngine({
    campaigns: [{ campaignId: 'c1', totalBudget: 100, startMs: 0, endMs: 100, dailyCap: 100 }],
  });

  const a = engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 5, amount: 10 });
  const b = engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 5, amount: 10 });

  assert.equal(a.accepted, true);
  assert.equal(b.accepted, false);

  const d = engine.getPacingDecision('c1', 10);
  assert.equal(typeof d.status, 'string');
  assert.equal(typeof d.spentTotal, 'number');
});
