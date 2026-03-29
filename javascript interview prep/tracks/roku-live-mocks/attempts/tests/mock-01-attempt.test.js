const test = require('node:test');
const assert = require('node:assert/strict');

const { createAttributionService } = require('../mock-01');

test('attempt mock-01 computes metrics and dedupes', () => {
  const svc = createAttributionService();

  svc.ingest({ eventId: 'e1', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1000 });
  svc.ingest({ eventId: 'e2', eventType: 'click', campaignId: 'c1', userId: 'u1', timestampMs: 1010 });
  svc.ingest({ eventId: 'e3', eventType: 'conversion', campaignId: 'c1', userId: 'u1', timestampMs: 1020, value: 20 });

  const dup = svc.ingest({ eventId: 'e3', eventType: 'conversion', campaignId: 'c1', userId: 'u1', timestampMs: 1020, value: 20 });
  assert.equal(dup.accepted, false);

  const metrics = svc.getCampaignMetrics('c1', 1000, 2000);
  assert.equal(metrics.impressions, 1);
  assert.equal(metrics.clicks, 1);
  assert.equal(metrics.conversions, 1);
  assert.equal(metrics.conversionValue, 20);
});
