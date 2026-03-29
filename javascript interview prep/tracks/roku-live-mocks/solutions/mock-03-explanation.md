# Mock 03 Detailed Explanation

## Problem summary

The task is a streaming JSONL ingestion pipeline that must parse safely, validate records, write in batches, and remain responsive to cancellation.

## Core design

1. Streaming parser with rolling buffer
- Read chunks using async iteration.
- Append chunks to a string buffer.
- Extract full lines whenever a newline appears.
- Preserve final partial line for end-of-stream handling.

2. Validation and policy
- Parse each line with try-catch.
- Validate required schema fields.
- Mark invalid lines and continue.
- Enforce invalid ratio after at least 100 lines.

3. Backpressure-safe batching
- Accumulate valid events in memory until batchSize.
- Await writeBatch for each flush.
- Flush remainder on stream end.

4. Cancellation
- Check AbortSignal before expensive work and before each write.
- Throw AbortError quickly when aborted.

## Why this works

- Awaited batch writes prevent unbounded producer overrun.
- Rolling buffer guarantees line integrity across chunk boundaries.
- Ratio gate prevents silently accepting severely bad data quality.

## Complexity

- Time: O(n) over lines.
- Space: O(max line size + batchSize).

## Edge cases covered

- Empty lines and malformed JSON.
- Last line without trailing newline.
- Abort signal raised mid-stream.
- Invalid ratio threshold exceeded only after sample size is meaningful.

## Senior-level production notes

- Add retry with jitter for transient sink failures.
- Add DLQ for permanently invalid or failed writes.
- Emit telemetry for throughput, parse failures, and write latency percentiles.
