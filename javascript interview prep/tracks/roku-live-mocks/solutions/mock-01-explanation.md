# Mock 01 Detailed Explanation

## Problem summary

The service must ingest impression, click, and conversion events while handling duplicates and out-of-order arrival. Then it must return campaign metrics for a half-open window [startMs, endMs).

## Core design

1. Validation layer
- Reject malformed payloads early with explicit errors.
- Validate allowed eventType values.
- Validate timestampMs and conversion value semantics.

2. Idempotency layer
- Use a Set keyed by eventId for O(1) duplicate checks.
- Optional TTL mode keeps a Map of first-seen time to evict dedupe keys.

3. Storage layer
- Index by campaignId to avoid scanning unrelated campaign traffic.
- Store normalized events with conversion value defaulting to 0 for non-conversion types.

4. Query layer
- Scan only events for the target campaign.
- Apply [startMs, endMs) filtering.
- Aggregate counts and derive ctr, cvr with zero guards.

## Why this works

- Duplicate suppression is deterministic because eventId is the unique key.
- Out-of-order timestamps are naturally handled since ingestion order is not used for correctness.
- Ratio fields are always safe because division-by-zero is guarded.

## Complexity

- Ingest: O(1) expected for dedupe and append.
- Query: O(k), where k is number of events for that campaign.
- Space: O(n) stored events plus dedupe index.

## Senior-level production notes

- For very large windows, add time bucket indexing for faster queries.
- For restart-safe idempotency, persist dedupe keys in a durable store.
- Add metrics: duplicate ratio, invalid payload rate, per-campaign query latency.

## Common edge cases covered

- Duplicate eventId with identical payload.
- Duplicate eventId with mismatched payload (still suppressed by idempotency key contract).
- Empty campaign window returns zeros.
- Conversion with omitted value treated as 0.
- AbortSignal cancellation before ingestion.
