# Mock 05 Detailed Explanation

## Problem summary

The service must return fast campaign reports while avoiding stale cache responses after metric updates. The key challenge is precise campaign-scoped invalidation.

## Core design

1. Point storage
- Store metric points by campaignId and bucketStartMs.
- Upserts overwrite existing bucket values for deterministic behavior.

2. Query path
- Build report from points in [startMs, endMs) after granularity normalization.
- Aggregate impressions, clicks, conversions, and spend.
- Compute ctr and cvr with zero guards.

3. Cache path
- Cache report by full query key campaignId|startMs|endMs|granularity.
- Cache entry includes expiry timestamp.

4. Invalidation fix
- Maintain reverse index campaignId -> set of cache keys.
- On upsertMetricPoint for campaign C, invalidate only keys associated with C.
- This avoids stale C responses while preserving cache for other campaigns.

## Why this works

- Reverse index removes guesswork from invalidation.
- Key completeness prevents accidental key collisions.
- Campaign-scoped flush gives freshness without globally destroying hit rate.

## Complexity

- upsertMetricPoint: O(1) plus campaign key invalidation set traversal.
- getReport cache hit: O(1).
- getReport cache miss: O(k) over campaign points.

## Edge cases covered

- Empty campaign or no data in window.
- TTL expiration and recomputation.
- Distinct granularity keys for hour vs day.
- Zero-denominator ratio behavior.

## Senior-level production notes

- Add request coalescing to avoid cache stampede on hot keys.
- Consider stale-while-revalidate for low-latency reads with bounded staleness.
- Track hit ratio, stale incidents, and query latency percentiles.
