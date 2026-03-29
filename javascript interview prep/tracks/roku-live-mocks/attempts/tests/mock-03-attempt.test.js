const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');

const { ingestTelemetry } = require('../mock-03');

test('attempt mock-03 parses JSONL and returns summary', async () => {
  const input = [
    JSON.stringify({ eventId: 'e1', campaignId: 'c1', eventType: 'impression', timestampMs: 1 }),
    JSON.stringify({ eventId: 'e2', campaignId: 'c1', eventType: 'click', timestampMs: 2 }),
  ].join('\n') + '\n';

  const readable = Readable.from([input]);
  const summary = await ingestTelemetry(readable, async () => {}, { batchSize: 1 });

  assert.equal(typeof summary.totalLines, 'number');
  assert.equal(typeof summary.validEvents, 'number');
  assert.equal(typeof summary.invalidEvents, 'number');
  assert.equal(typeof summary.batchesWritten, 'number');
});
