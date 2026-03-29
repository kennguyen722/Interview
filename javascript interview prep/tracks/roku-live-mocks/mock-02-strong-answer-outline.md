# Mock 02: Strong Answer Outline

## Strong approach

1. Keep state in two indexes:
- campaign configs by campaignId
- campaign spend ledger plus dedupe set by campaignId

2. Track spend in two dimensions:
- total lifetime spend
- per UTC day spend map keyed by YYYY-MM-DD

3. Apply deterministic decision order:
- NOT_STARTED, ENDED, PAUSED by budget, PAUSED by daily cap, THROTTLE, ACTIVE

4. Guardrails and math:
- clamp elapsed ratio to 0..1
- defend against invalid ranges and negative amounts

## Complexity

- ingest: O(1) expected
- decision query: O(1) if aggregates are maintained incrementally
- memory: O(events + day buckets)

## Senior notes

- Late event compensation can trigger immediate status correction.
- Use distributed lock or compare-and-swap around shared budget counters.
- Add alerts for overspend risk and pacing drift.

## Must-have tests

- duplicate spend ignored
- daily cap boundary exactly equals cap
- now at start and end boundaries
- ahead-of-pace vs on-pace status
