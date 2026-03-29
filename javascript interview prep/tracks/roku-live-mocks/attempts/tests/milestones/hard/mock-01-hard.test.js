const test = require('node:test');
const assert = require('node:assert/strict');

const { createAttributionService } = require('../../../mock-01');

test('hard mock-01: honors abort signal', () => {
  const svc = createAttributionService();
  const ac = new AbortController();
  ac.abort();
  assert.throws(
    () => svc.ingest({ eventId: 'e1', eventType: 'impression', campaignId: 'c1', userId: 'u1', timestampMs: 1 }, { signal: ac.signal }),
    /abort/i
  );
});
