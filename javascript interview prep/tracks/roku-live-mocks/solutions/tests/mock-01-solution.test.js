const test = require('node:test');
const assert = require('node:assert/strict');

const { createAttributionService } = require('../mock-01-solution');

test('mock-01 dedupes duplicate events and computes metrics', () => {
  const svc = createAttributionService();

  svc.ingest({ eventId: 'e1', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1000 });
  svc.ingest({ eventId: 'e2', eventType: 'click', campaignId: 'c1', userId: 'u1', timestampMs: 1010 });
  svc.ingest({ eventId: 'e3', eventType: 'conversion', campaignId: 'c1', userId: 'u1', timestampMs: 1020, value: 20 });

  const dup = svc.ingest({ eventId: 'e3', eventType: 'conversion', campaignId: 'c1', userId: 'u1', timestampMs: 1020, value: 20 });
  assert.equal(dup.accepted, false);

  const metrics = svc.getCampaignMetrics('c1', 1000, 2000);
  assert.deepEqual(metrics, {
    impressions: 1,
    clicks: 1,
    conversions: 1,
    conversionValue: 20,
    ctr: 1,
    cvr: 1,
  });
});

test('mock-01 supports abort signal during ingestion', () => {
  const svc = createAttributionService();
  const ac = new AbortController();
  ac.abort();

  assert.throws(
    () => svc.ingest({ eventId: 'x', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1 }, { signal: ac.signal }),
    /aborted/i
  );
});
