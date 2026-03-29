# Mock 02: Interviewer Rubric (Hidden)

Total: 100 points

- Budget correctness and idempotency: 40
- Pacing algorithm quality: 20
- Edge cases and testing: 15
- Complexity and scalability reasoning: 15
- Senior communication: 10

## Budget correctness and idempotency (40)

- Deduped spend ingestion by eventId (12)
- Lifetime cap enforcement (10)
- Daily cap enforcement by UTC day (10)
- Stable numeric handling and clear errors (8)

## Pacing algorithm quality (20)

- Correct elapsed ratio and clamp behavior (8)
- Correct expectedSpend and pacingDelta (8)
- Correct status transition rules (4)

## Edge cases and testing (15)

- Boundary timestamps start and end (5)
- Duplicate events and delayed events (5)
- Empty/no spend and zero-duration campaign handling (5)

## Complexity and scalability reasoning (15)

- Efficient per-campaign indexing (6)
- Discussion of eventual consistency and delayed telemetry (5)
- Discussion of hardening against overspend races (4)

## Senior communication (10)

- Assumptions clarified early (3)
- Tradeoffs presented clearly (3)
- Observability and rollback plan mentioned (4)

## Follow-up probes

1. How would you prevent overspend if events arrive late by several minutes?
2. How do you coordinate pausing across multiple delivery workers?
3. What SLOs would you define for pacing correctness?
