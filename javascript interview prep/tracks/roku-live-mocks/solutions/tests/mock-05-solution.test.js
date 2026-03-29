const test = require('node:test');
const assert = require('node:assert/strict');

const { createReportingService } = require('../mock-05-solution');

test('mock-05 invalidates campaign cache on upsert', () => {
  const svc = createReportingService({ cacheTtlMs: 60_000 });

  svc.upsertMetricPoint({
    campaignId: 'c1',
    bucketStartMs: 0,
    impressions: 100,
    clicks: 10,
    conversions: 2,
    spend: 50,
  });

  const r1 = svc.getReport('c1', 0, 3_600_000, 'hour');
  assert.equal(r1.impressions, 100);

  svc.upsertMetricPoint({
    campaignId: 'c1',
    bucketStartMs: 0,
    impressions: 200,
    clicks: 20,
    conversions: 4,
    spend: 90,
  });

  const r2 = svc.getReport('c1', 0, 3_600_000, 'hour');
  assert.equal(r2.impressions, 200);
  assert.equal(r2.clicks, 20);
});

test('mock-05 keeps campaign scoped invalidation', () => {
  const svc = createReportingService({ cacheTtlMs: 60_000 });

  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 0, impressions: 10, clicks: 1, conversions: 0, spend: 5 });
  svc.upsertMetricPoint({ campaignId: 'c2', bucketStartMs: 0, impressions: 20, clicks: 2, conversions: 1, spend: 8 });

  const beforeC2 = svc.getReport('c2', 0, 3_600_000, 'hour');
  assert.equal(beforeC2.impressions, 20);

  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 3_600_000, impressions: 5, clicks: 1, conversions: 0, spend: 2 });

  const afterC2 = svc.getReport('c2', 0, 3_600_000, 'hour');
  assert.equal(afterC2.impressions, 20);
});
