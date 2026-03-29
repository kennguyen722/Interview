# Mock 01: Strong Answer Outline

This is not a full implementation. It is a guidance map for a high-signal senior answer.

## 1) Clarify Assumptions (first 3-5 minutes)

- Event IDs are globally unique across event types.
- Duplicate means same `eventId` should be ignored regardless of payload.
- Time window is half-open: `[startMs, endMs)`.
- In-memory only for this round; persistence is out of scope.

## 2) Data Structures

- `seenEventIds: Set<string>` for idempotency.
- `campaignEvents: Map<string, Event[]>` for per-campaign indexing.
- Optional bonus TTL:
  - `seenAt: Map<string, number>` to evict dedupe keys by age.

Why:

- O(1) expected dedupe checks.
- Query touches one campaign slice, not all events.

## 3) Function Contracts

- `createAttributionService({ dedupeTtlMs } = {})` returns `{ ingest, getCampaignMetrics }`.
- `ingest(event, { signal } = {})`:
  - throws on abort
  - validates payload
  - checks dedupe
  - inserts into campaign index
- `getCampaignMetrics(campaignId, startMs, endMs)`:
  - validates window
  - scans campaign events and aggregates

## 4) Validation Checklist

- `eventId`, `campaignId`, `userId` are non-empty strings.
- `eventType` is one of allowed literals.
- `timestampMs` is finite number.
- `value` for conversions is finite number, default 0 if omitted.

## 5) Metric Computation

- Count by eventType.
- `conversionValue` sums conversion values.
- `ctr = impressions === 0 ? 0 : clicks / impressions`.
- `cvr = clicks === 0 ? 0 : conversions / clicks`.

## 6) Complexity Discussion

Baseline:

- Ingest: O(1) expected.
- Query: O(k) where k is campaign event count.
- Space: O(n) events + dedupe index.

Scale-up ideas:

- Pre-aggregate into time buckets for faster range queries.
- Keep sorted vectors by timestamp for binary-search windowing.
- External durable dedupe store for restart safety.

## 7) Senior Production Notes

- Observability:
  - duplicate ratio by source partner
  - ingest latency p95/p99
  - query latency and memory pressure
- Reliability:
  - backpressure/queue limits
  - bounded retries upstream
- Correctness:
  - deterministic replay and reconciliation jobs

## 8) Minimal Test Cases

1. Happy path single campaign.
2. Duplicate conversion ignored.
3. Out-of-order timestamps still correct.
4. Window boundary correctness (`start` inclusive, `end` exclusive).
5. Invalid payload throws useful error.
6. Zero-denominator ratio behavior.
