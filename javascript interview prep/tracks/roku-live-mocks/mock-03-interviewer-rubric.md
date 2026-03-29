# Mock 03: Interviewer Rubric (Hidden)

Total: 100 points

- Streaming correctness and backpressure: 35
- Validation and error policy: 20
- Cancellation handling: 15
- Code quality and tests: 20
- Senior production reasoning: 10

## Streaming correctness and backpressure (35)

- Parses JSONL correctly including final partial line (10)
- Writes batches with awaited async sink calls (15)
- Flushes remaining batch at stream end (10)

## Validation and error policy (20)

- Field validation quality (8)
- Invalid event tracking and ratio enforcement (8)
- Deterministic failure message/context (4)

## Cancellation handling (15)

- Checks signal early and during processing (8)
- Throws clear abort error without partial corruption (7)

## Code quality and tests (20)

- Readable decomposition and naming (8)
- Test coverage for happy path, invalid lines, abort (12)

## Senior production reasoning (10)

- Mentions observability metrics and alerting (4)
- Mentions retries and DLQ strategy (3)
- Mentions memory pressure controls (3)

## Follow-up probes

1. How do you prevent one slow sink from stalling ingestion globally?
2. How would you design replay and dedupe in downstream storage?
3. Which metrics would indicate approaching backpressure collapse?
