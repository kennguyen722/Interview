const test = require('node:test');
const assert = require('node:assert/strict');

const { createReconciler } = require('../mock-04');

test('attempt mock-04 suppresses duplicate across partners', () => {
  const rec = createReconciler();

  rec.ingestPartnerEvent('A', {
    id: 'a1', campaignId: 'c1', userId: 'u1', ts: 10000, value: 10,
  });
  rec.ingestPartnerEvent('B', {
    event_id: 'b1', campaign: 'c1', external_user: 'u1', timestamp_ms: 10005, revenue: 10,
  });

  const out = rec.getCampaignAttribution('c1', 0, 20000);
  assert.equal(out.conversions, 1);
});
