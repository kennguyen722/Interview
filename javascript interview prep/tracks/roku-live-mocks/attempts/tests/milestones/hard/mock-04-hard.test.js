const test = require('node:test');
const assert = require('node:assert/strict');

const { createReconciler } = require('../../../mock-04');

test('hard mock-04: tracks schema errors as conflicts', () => {
  const rec = createReconciler();
  rec.ingestPartnerEvent('A', { id: 'bad' });
  const out = rec.getCampaignAttribution('c1', 0, 10);
  assert.equal(out.conflicts.schemaErrors, 1);
});
