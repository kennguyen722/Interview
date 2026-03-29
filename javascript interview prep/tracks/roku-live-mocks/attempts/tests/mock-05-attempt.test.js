const test = require('node:test');
const assert = require('node:assert/strict');

const { createReportingService } = require('../mock-05');

test('attempt mock-05 invalidates campaign-scoped cache after upsert', () => {
  const svc = createReportingService({ cacheTtlMs: 60_000 });

  svc.upsertMetricPoint({
    campaignId: 'c1',
    bucketStartMs: 0,
    impressions: 100,
    clicks: 10,
    conversions: 2,
    spend: 50,
  });

  const before = svc.getReport('c1', 0, 3_600_000, 'hour');
  assert.equal(before.impressions, 100);

  svc.upsertMetricPoint({
    campaignId: 'c1',
    bucketStartMs: 0,
    impressions: 200,
    clicks: 20,
    conversions: 4,
    spend: 90,
  });

  const after = svc.getReport('c1', 0, 3_600_000, 'hour');
  assert.equal(after.impressions, 200);
});
