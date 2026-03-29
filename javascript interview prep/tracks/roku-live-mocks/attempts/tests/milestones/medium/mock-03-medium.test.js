const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');

const { ingestTelemetry } = require('../../../mock-03');

test('medium mock-03: batches valid events and skips malformed lines', async () => {
  const input = [
    JSON.stringify({ eventId: 'e1', campaignId: 'c1', eventType: 'impression', timestampMs: 1 }),
    'not-json',
    JSON.stringify({ eventId: 'e2', campaignId: 'c1', eventType: 'click', timestampMs: 2 }),
  ].join('\n') + '\n';

  let writes = 0;
  const summary = await ingestTelemetry(Readable.from([input]), async () => { writes += 1; }, { batchSize: 1 });
  assert.equal(summary.validEvents, 2);
  assert.equal(summary.invalidEvents, 1);
  assert.equal(writes, 2);
});
