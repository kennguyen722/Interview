const test = require('node:test');
const assert = require('node:assert/strict');

const { createPacingEngine } = require('../../../mock-02');

test('easy mock-02: dedupe by spend eventId', () => {
  const engine = createPacingEngine({ campaigns: [{ campaignId: 'c1', totalBudget: 100, startMs: 0, endMs: 100 }] });
  const first = engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 1, amount: 5 });
  const second = engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 1, amount: 5 });
  assert.equal(first.accepted, true);
  assert.equal(second.accepted, false);
});
