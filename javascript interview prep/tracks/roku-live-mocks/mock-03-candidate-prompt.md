# Mock 03: Streaming Telemetry Ingestion with Backpressure and Cancellation (60 minutes)

## Scenario

You own an ingestion component that consumes newline-delimited JSON telemetry from a stream.

Each line is an event. You need to parse, validate, batch, and write events to an async sink while respecting backpressure.

The interviewer is looking for practical Node.js stream design quality.

## Requirements

Implement a function:

- ingestTelemetry(readable, writeBatch, options)

Parameters:

- readable: Node Readable stream of UTF-8 JSONL
- writeBatch: async function that accepts an array of events
- options:
  - batchSize default 100
  - signal optional AbortSignal
  - maxInvalidRatio default 0.05

Behavior:

1. Parse each line as JSON.
2. Validate required fields:
- eventId string
- campaignId string
- eventType in impression click conversion
- timestampMs finite number

3. Invalid lines:
- skip invalid events
- track invalid count
- if invalid ratio exceeds maxInvalidRatio after at least 100 lines, abort with error

4. Batching:
- collect valid events into batches of batchSize
- await writeBatch for each batch before continuing

5. Cancellation:
- if signal is aborted, stop quickly and throw AbortError

6. Return summary:
- totalLines
- validEvents
- invalidEvents
- batchesWritten

## Bonus

- Add retry with jitter for transient writeBatch failures.
- Add simple throughput metric events per second.

## What Interviewers Look For

- Correct stream and async control flow.
- Backpressure-safe behavior with awaited batch writes.
- Clean cancellation and error boundaries.
- Useful summary metrics.
