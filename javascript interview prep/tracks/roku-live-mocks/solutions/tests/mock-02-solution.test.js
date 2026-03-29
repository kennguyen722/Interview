const test = require('node:test');
const assert = require('node:assert/strict');

const { createPacingEngine } = require('../mock-02-solution');

test('mock-02 returns THROTTLE when spend is >10% ahead of expected', () => {
  const engine = createPacingEngine({
    campaigns: [
      {
        campaignId: 'c1',
        totalBudget: 100,
        startMs: 0,
        endMs: 100,
        dailyCap: 100,
      },
    ],
  });

  engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 10, amount: 20 });

  const d = engine.getPacingDecision('c1', 10);
  assert.equal(d.status, 'THROTTLE');
});

test('mock-02 dedupes spend events by eventId', () => {
  const engine = createPacingEngine({
    campaigns: [
      { campaignId: 'c1', totalBudget: 100, startMs: 0, endMs: 100 },
    ],
  });

  const a = engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 5, amount: 10 });
  const b = engine.ingestSpend({ eventId: 's1', campaignId: 'c1', timestampMs: 5, amount: 10 });

  assert.equal(a.accepted, true);
  assert.equal(b.accepted, false);
});
