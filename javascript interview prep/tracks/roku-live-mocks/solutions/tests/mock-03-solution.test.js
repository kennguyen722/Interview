const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');

const { ingestTelemetry } = require('../mock-03-solution');

test('mock-03 parses JSONL and writes batches', async () => {
  const input = [
    JSON.stringify({ eventId: 'e1', campaignId: 'c1', eventType: 'impression', timestampMs: 1 }),
    JSON.stringify({ eventId: 'e2', campaignId: 'c1', eventType: 'click', timestampMs: 2 }),
    JSON.stringify({ eventId: 'e3', campaignId: 'c1', eventType: 'conversion', timestampMs: 3 }),
  ].join('\n') + '\n';

  const readable = Readable.from([input]);
  const writes = [];
  const summary = await ingestTelemetry(readable, async (batch) => {
    writes.push(batch);
  }, { batchSize: 2 });

  assert.equal(summary.validEvents, 3);
  assert.equal(summary.invalidEvents, 0);
  assert.equal(summary.batchesWritten, 2);
  assert.equal(writes.length, 2);
});

test('mock-03 throws AbortError when aborted', async () => {
  const input = JSON.stringify({ eventId: 'e1', campaignId: 'c1', eventType: 'impression', timestampMs: 1 }) + '\n';
  const readable = Readable.from([input]);
  const ac = new AbortController();
  ac.abort();

  await assert.rejects(
    () => ingestTelemetry(readable, async () => {}, { signal: ac.signal }),
    /aborted/i
  );
});
