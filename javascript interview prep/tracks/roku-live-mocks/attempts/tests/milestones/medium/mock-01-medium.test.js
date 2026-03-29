const test = require('node:test');
const assert = require('node:assert/strict');

const { createAttributionService } = require('../../../mock-01');

test('medium mock-01: computes ctr/cvr in requested window', () => {
  const svc = createAttributionService();
  svc.ingest({ eventId: 'e1', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1000 });
  svc.ingest({ eventId: 'e2', eventType: 'click', campaignId: 'c1', userId: 'u1', timestampMs: 1010 });
  svc.ingest({ eventId: 'e3', eventType: 'conversion', campaignId: 'c1', userId: 'u1', timestampMs: 1020, value: 20 });

  const out = svc.getCampaignMetrics('c1', 1000, 2000);
  assert.equal(out.impressions, 1);
  assert.equal(out.clicks, 1);
  assert.equal(out.conversions, 1);
  assert.equal(out.ctr, 1);
  assert.equal(out.cvr, 1);
});
