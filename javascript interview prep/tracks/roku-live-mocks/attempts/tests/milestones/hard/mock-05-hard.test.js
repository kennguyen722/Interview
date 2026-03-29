const test = require('node:test');
const assert = require('node:assert/strict');

const { createReportingService } = require('../../../mock-05');

test('hard mock-05: campaign-scoped invalidation does not clear other campaign', () => {
  const svc = createReportingService({ cacheTtlMs: 60000 });

  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 0, impressions: 10, clicks: 1, conversions: 0, spend: 3 });
  svc.upsertMetricPoint({ campaignId: 'c2', bucketStartMs: 0, impressions: 20, clicks: 2, conversions: 1, spend: 5 });

  const c2Before = svc.getReport('c2', 0, 3600000, 'hour');
  assert.equal(c2Before.impressions, 20);

  svc.upsertMetricPoint({ campaignId: 'c1', bucketStartMs: 3600000, impressions: 5, clicks: 1, conversions: 0, spend: 2 });

  const c2After = svc.getReport('c2', 0, 3600000, 'hour');
  assert.equal(c2After.impressions, 20);
});
