# Mock 05: Strong Answer Outline

## Strong approach

1. Store raw points indexed by campaign and bucketStartMs.
2. Build report function that aggregates points in requested window.
3. Use cache map with entry:
- value
- expiresAt
- campaignId

4. Cache key:
- campaignId|startMs|endMs|granularity

5. Invalidation strategy:
- maintain reverse index campaignId -> set of cache keys
- on upsert for campaign C, invalidate only keys in that set

## Complexity

- upsert: O(1) expected plus invalidation set clear
- report miss: O(k) over campaign buckets
- report hit: O(1)

## Senior notes

- Add jittered TTL and request coalescing to reduce stampedes.
- Measure hit rate, staleness incidents, p95 query latency.
- Use guarded rollout with freshness assertions in canary.

## Must-have tests

- stale report reproduced before invalidation fix
- campaign A invalidation does not clear campaign B cache
- ttl expiry recomputes report
- ctr and cvr zero-denominator behavior
