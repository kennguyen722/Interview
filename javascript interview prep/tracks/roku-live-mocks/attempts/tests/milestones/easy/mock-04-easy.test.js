const test = require('node:test');
const assert = require('node:assert/strict');

const { createReconciler } = require('../../../mock-04');

test('easy mock-04: ingests partner A and reports one conversion', () => {
  const rec = createReconciler();
  rec.ingestPartnerEvent('A', { id: 'a1', campaignId: 'c1', userId: 'u1', ts: 1000, value: 4.2 });
  const out = rec.getCampaignAttribution('c1', 0, 2000);
  assert.equal(out.conversions, 1);
});
