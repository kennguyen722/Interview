# Mock 01: Interviewer Rubric (Hidden)

Use this for evaluation only.

## Scoring

Total: 100 points

- Correctness: 40
- Code quality: 20
- Complexity and design reasoning: 20
- Testing and edge cases: 10
- Senior communication and tradeoffs: 10

## Correctness (40)

1. Dedup by `eventId` (10)
- Full: duplicate never double-counted.
- Partial: dedupe attempted but has leak or mismatch.

2. Validation (8)
- Full: robust checks with clear errors.
- Partial: some missing field/type checks.

3. Window metrics (10)
- Full: exact `[startMs, endMs)` semantics.
- Partial: off-by-one or wrong boundary behavior.

4. Ratios and zero guards (6)
- Full: `ctr`/`cvr` safe when denominator is zero.

5. Out-of-order handling (6)
- Full: order independent results.

## Code Quality (20)

1. Separation of concerns (8)
- Parsing/validation, storage, query are cleanly separated.

2. Naming and readability (6)
- Clear function names and concise logic.

3. Defensive practices (6)
- Avoids mutation bugs and unintended side effects.

## Complexity and Design Reasoning (20)

1. Data structures chosen intentionally (8)
- Example: `Set` for dedupe, campaign indexing for query.

2. Complexity explained correctly (6)
- Candidate can state time/space for ingest and query.

3. Scale discussion (6)
- Candidate explains what changes at 100M events.

## Testing and Edge Cases (10)

1. Includes meaningful test cases (6)
- Duplicate event, out-of-order, empty result, invalid payload.

2. Handles bad inputs cleanly (4)
- Clear, deterministic failure behavior.

## Senior Communication and Tradeoffs (10)

1. Clarifies assumptions early (3)
2. States tradeoffs and alternatives (3)
3. Adds production concerns (2)
- Metrics, logs, tracing, alerts.
4. Plans incremental improvements (2)

## Red Flags

- Uses array scan for every query without discussing limits.
- Miscomputes window boundaries.
- Ignores duplicate events.
- No validation or unclear error handling.
- Cannot explain complexity choices.

## Follow-up Questions

1. How would you support exactly-once business semantics across restarts?
2. How would you shard by campaign without hot partitions?
3. What observability would you add for duplicate ratio anomalies?
4. How would you backfill late conversions safely?
