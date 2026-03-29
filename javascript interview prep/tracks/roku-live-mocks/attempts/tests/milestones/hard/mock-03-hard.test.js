const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');

const { ingestTelemetry } = require('../../../mock-03');

test('hard mock-03: aborts when signal is already canceled', async () => {
  const payload = JSON.stringify({ eventId: 'e1', campaignId: 'c1', eventType: 'impression', timestampMs: 1 }) + '\n';
  const ac = new AbortController();
  ac.abort();

  await assert.rejects(
    () => ingestTelemetry(Readable.from([payload]), async () => {}, { signal: ac.signal }),
    /abort/i
  );
});
