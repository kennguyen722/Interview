const test = require('node:test');
const assert = require('node:assert/strict');

const { createReconciler } = require('../mock-04-solution');

test('mock-04 suppresses cross-partner duplicate conversion', () => {
  const rec = createReconciler();

  rec.ingestPartnerEvent('A', {
    id: 'a1', campaignId: 'c1', userId: 'u1', ts: 10000, value: 12.34,
  });
  rec.ingestPartnerEvent('B', {
    event_id: 'b1', campaign: 'c1', external_user: 'u1', timestamp_ms: 10005, revenue: 12.34,
  });

  const out = rec.getCampaignAttribution('c1', 0, 20000);
  assert.equal(out.conversions, 1);
  assert.equal(out.duplicateSuppressed, 1);
  assert.equal(out.uniqueUsers, 1);
});

test('mock-04 tracks schema errors for bad payload', () => {
  const rec = createReconciler();
  rec.ingestPartnerEvent('A', { id: 'a1' });
  const out = rec.getCampaignAttribution('c1', 0, 100);
  assert.equal(out.conflicts.schemaErrors, 1);
});
