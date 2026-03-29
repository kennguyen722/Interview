const test = require('node:test');
const assert = require('node:assert/strict');

const { createReportingService } = require('../../../mock-05');

test('easy mock-05: upsert and basic report aggregation', () => {
  const svc = createReportingService({ cacheTtlMs: 60000 });
  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 0, impressions: 10, clicks: 1, conversions: 0, spend: 3 });
  const out = svc.getReport('c1', 0, 3600000, 'hour');
  assert.equal(out.impressions, 10);
  assert.equal(out.clicks, 1);
});
