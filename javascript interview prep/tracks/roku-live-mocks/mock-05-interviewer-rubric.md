# Mock 05: Interviewer Rubric (Hidden)

Total: 100 points

- Report correctness and aggregation: 30
- Cache key and invalidation correctness: 35
- Performance reasoning: 20
- Testing and senior communication: 15

## Report correctness and aggregation (30)

- Correct range and granularity handling (12)
- Correct metric totals and ratio guards (10)
- Correct no-data behavior (8)

## Cache key and invalidation correctness (35)

- Query key captures campaign + range + granularity (12)
- Campaign-scoped invalidation clears only relevant keys (13)
- TTL behavior and expiry checks are correct (10)

## Performance reasoning (20)

- Explains read/write profile and cache design tradeoffs (8)
- Mentions memory growth controls and eviction strategy (6)
- Discusses stale data risk monitoring (6)

## Testing and senior communication (15)

- Includes tests for stale bug reproduction and fix (10)
- Communicates mitigation and rollout safety plan (5)

## Follow-up probes

1. How would you avoid stampedes for hot keys?
2. What is your fallback if cache layer fails?
3. How would you prove freshness SLO compliance?
