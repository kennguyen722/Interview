const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');

const { ingestTelemetry } = require('../../../mock-03');

test('easy mock-03: returns summary counters for valid JSONL', async () => {
  const payload = JSON.stringify({ eventId: 'e1', campaignId: 'c1', eventType: 'impression', timestampMs: 1 }) + '\n';
  const summary = await ingestTelemetry(Readable.from([payload]), async () => {}, { batchSize: 1 });
  assert.equal(summary.validEvents, 1);
  assert.equal(summary.invalidEvents, 0);
});
