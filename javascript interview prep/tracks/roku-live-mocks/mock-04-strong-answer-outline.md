# Mock 04: Strong Answer Outline

## Strong approach

1. Build partner adapters:
- adapterA(event) => canonical
- adapterB(event) => canonical

2. Validation before normalization:
- required field checks
- finite number checks
- non-empty ids

3. Reconciliation key:
- campaignId + userId + Math.floor(timestampMs / 10000) + roundedValue

4. Storage shape:
- byCampaign map containing canonical records
- dedupe index map key -> canonical id
- counters for suppressed duplicates and conflicts

5. Query path:
- filter by [startMs, endMs)
- aggregate conversions, value, unique user count
- include counters

## Complexity

- ingest: O(1) expected with hash indexes
- query: O(k) per campaign window scan

## Senior notes

- Add replayable event log and deterministic reducer for backfills.
- Introduce quality gates per partner and automatic quarantine for bad feeds.
- Publish data freshness and reconciliation lag metrics.

## Must-have tests

- cross-partner duplicate suppressed
- schema error increments conflict counter
- value mismatch tracked
- window boundary correctness
