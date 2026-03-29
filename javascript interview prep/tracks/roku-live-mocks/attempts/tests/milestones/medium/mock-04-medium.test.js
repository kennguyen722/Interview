const test = require('node:test');
const assert = require('node:assert/strict');

const { createReconciler } = require('../../../mock-04');

test('medium mock-04: suppresses duplicates across partner A/B', () => {
  const rec = createReconciler();
  rec.ingestPartnerEvent('A', { id: 'a1', campaignId: 'c1', userId: 'u1', ts: 10000, value: 3.5 });
  rec.ingestPartnerEvent('B', { event_id: 'b1', campaign: 'c1', external_user: 'u1', timestamp_ms: 10005, revenue: 3.5 });
  const out = rec.getCampaignAttribution('c1', 0, 20000);
  assert.equal(out.conversions, 1);
  assert.equal(out.duplicateSuppressed, 1);
});
