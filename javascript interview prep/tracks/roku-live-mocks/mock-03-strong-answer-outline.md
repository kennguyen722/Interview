# Mock 03: Strong Answer Outline

## Core shape

1. Use async iteration over readable chunks.
2. Maintain a rolling text buffer and split by newline.
3. For each full line:
- parse JSON in try-catch
- validate fields
- add valid event to current batch
- flush batch with awaited writeBatch when full

4. After stream end:
- process any trailing buffered line
- flush any remaining batch

5. Return structured summary counters.

## Cancellation

- helper assertNotAborted(signal) called:
  - before loop
  - before parse/validate
  - before every writeBatch

## Invalid ratio policy

- maintain totalLines and invalidEvents
- start enforcing only after totalLines >= 100
- throw when invalidEvents / totalLines > maxInvalidRatio

## Complexity

- Time O(n) lines
- Space O(max line size + batchSize)

## Senior production notes

- Introduce bounded retry with jitter on sink writes.
- Route hard failures to DLQ with replay tokens.
- Emit metrics: parse error rate, batch latency p95, ingest throughput, abort count.

## Must-have tests

- valid file with exact multiple of batchSize
- valid file with remainder flush
- malformed JSON line skipped
- invalid ratio threshold breach
- abort mid-stream
