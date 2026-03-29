# Roku Live Mocks Review Checklist

Use this sheet right after each mock. Target: complete in under 5 minutes.

Scoring scale per item:

- 0 = not covered
- 1 = partial
- 2 = strong

Total each mock out of 20, then multiply by 5 for a 100-point normalized score.

## Mock 01: Idempotent Event Attribution

1. Correctness:
- Duplicate `eventId` is not counted twice.
- Window semantics are correct for [startMs, endMs).

2. API and validation:
- Invalid payloads fail fast with clear errors.
- Output includes required metrics and safe ratio guards.

3. Engineering quality:
- Data structures match workload (set/map over array scan where appropriate).
- Complexity and tradeoffs are explained clearly.

4. Senior signal:
- Mentions observability (duplicate ratio, invalid rate, query latency).
- Mentions production hardening path (durable dedupe, replay strategy).

## Mock 02: Campaign Pacing and Budget Guardrails

1. Correctness:
- Spend dedupe works via eventId.
- Budget decision ordering is deterministic.

2. Guardrails:
- Lifetime budget enforcement works.
- Daily cap enforcement (UTC day) works.

3. Pacing:
- Expected spend and pacing delta are computed correctly.
- THROTTLE condition is correctly applied (> 10% ahead).

4. Senior signal:
- Discusses delayed telemetry and overspend risk mitigation.
- Discusses alerting for drift and cap breaches.

## Mock 03: Streaming Ingestion and Backpressure

1. Stream handling:
- Chunk buffering and newline splitting are correct.
- Final partial line is handled correctly.

2. Validation policy:
- Invalid records are counted and skipped.
- Invalid ratio threshold policy is enforced correctly.

3. Backpressure and cancellation:
- Batch writes are awaited.
- Abort signal is checked and handled cleanly.

4. Senior signal:
- Mentions retry/DLQ strategy.
- Mentions throughput and latency telemetry.

## Mock 04: Multi-Partner Reconciliation

1. Normalization:
- Partner A and B payloads are correctly mapped.
- Canonical validation is robust.

2. Dedupe and conflicts:
- Business-key dedupe behaves as intended.
- Conflict counters are incremented correctly.

3. Reporting:
- Windowed attribution metrics are correct.
- duplicateSuppressed and uniqueUsers are accurate.

4. Senior signal:
- Discusses replay/reprocessing strategy.
- Discusses partner quality controls and quarantine path.

## Mock 05: Reporting Cache Invalidation

1. Aggregation:
- Window/granularity filtering is correct.
- Report totals and ctr/cvr are correct.

2. Cache correctness:
- Cache key includes campaign + range + granularity.
- TTL handling is correct.

3. Invalidation:
- Upsert invalidates only affected campaign keys.
- Other campaigns are not unintentionally flushed.

4. Senior signal:
- Discusses stampede prevention and fallback behavior.
- Defines freshness and latency monitoring metrics.

## Final Decision Bands

- 90 to 100: interview-ready for this topic.
- 75 to 89: solid, but tighten one or two weak areas.
- 60 to 74: needs focused drill before interview.
- Below 60: repeat mock with stricter timing and peer review.

## 5-Minute Debrief Template

- Best two things I did:
- Most costly miss:
- One fix I can apply in next mock:
- One sentence tradeoff summary I should have said:
