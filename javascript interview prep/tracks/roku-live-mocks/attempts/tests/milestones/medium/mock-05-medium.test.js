const test = require('node:test');
const assert = require('node:assert/strict');

const { createReportingService } = require('../../../mock-05');

test('medium mock-05: invalidates campaign cache after upsert', () => {
  const svc = createReportingService({ cacheTtlMs: 60000 });
  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 0, impressions: 100, clicks: 10, conversions: 2, spend: 50 });
  const first = svc.getReport('c1', 0, 3600000, 'hour');
  assert.equal(first.impressions, 100);

  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 0, impressions: 150, clicks: 15, conversions: 3, spend: 70 });
  const second = svc.getReport('c1', 0, 3600000, 'hour');
  assert.equal(second.impressions, 150);
});
