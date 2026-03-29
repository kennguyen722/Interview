const test = require('node:test');
const assert = require('node:assert/strict');

const { createAttributionService } = require('../../../mock-01');

test('easy mock-01: dedupe duplicate eventId', () => {
  const svc = createAttributionService();
  svc.ingest({ eventId: 'e1', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1000 });
  const second = svc.ingest({ eventId: 'e1', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1000 });
  assert.equal(second.accepted, false);
});
