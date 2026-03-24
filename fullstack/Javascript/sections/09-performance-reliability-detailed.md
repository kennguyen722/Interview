# Section 9: Performance and Reliability Engineering (Full Detail)

## Problem 1: Compose Timeout + Retry + Circuit Breaker Correctly
### Problem statement
Design wrapper order for dependency calls with resilience policies.
### Difficulty
Hard
### Interview expectations
- Correct composition order and rationale.
### Clarifying questions a strong candidate should ask
- Latency budget and retry budget?
### Brute-force approach
Retry forever without timeout.
### Optimized approach
timeout per attempt -> retry policy -> circuit breaker around dependency.
### Time and space complexity
O(attempts).
### Clean JavaScript solution
```javascript
async function resilientCall(call, wrappers) {
  return wrappers.reduceRight((acc, wrap) => () => wrap(acc), call)();
}
```
Explanation: composing wrappers right-to-left preserves a deterministic execution order for timeout, retry, and breaker policies.
### Alternative solutions when useful
Bulkhead wrapper around entire dependency client.
### Edge cases
Nested retries causing multiplicative attempts.
### Test cases
Open circuit prevents further retries.
### Follow-up questions
How to budget retries per request SLA?
### Real-world production relevance
Prevents cascading failures.

---

## Problem 2: Implement Bulkhead Isolation
### Problem statement
Limit concurrent calls to unstable dependency to protect main request path.
### Difficulty
Medium-Hard
### Interview expectations
- Semaphore gating and fast-fail policy.
### Clarifying questions a strong candidate should ask
- Queue or reject when saturated?
### Brute-force approach
Unlimited concurrency.
### Optimized approach
Semaphore with limit and optional queue timeout.
### Time and space complexity
O(1) acquire/release.
### Clean JavaScript solution
```javascript
function createBulkhead(limit = 20) {
  let inUse = 0;
  return async function run(fn) {
    if (inUse >= limit) throw new Error('BULKHEAD_REJECTED');
    inUse += 1;
    try { return await fn(); } finally { inUse -= 1; }
  };
}
```
Explanation: the bulkhead enforces hard concurrency caps so unstable dependencies cannot consume all worker capacity.
### Alternative solutions when useful
Priority queues for critical traffic.
### Edge cases
Leak permit on exception.
### Test cases
Requests above limit fail fast.
### Follow-up questions
How to tune limit from metrics?
### Real-world production relevance
Prevents noisy-neighbor collapse.

---

## Problem 3: Cache Strategy for Read-heavy Endpoint
### Problem statement
Design cache-aside with TTL and stampede protection.
### Difficulty
Hard
### Interview expectations
- Hit/miss behavior and invalidation strategy.
### Clarifying questions a strong candidate should ask
- Freshness SLA?
- Write frequency?
### Brute-force approach
No cache.
### Optimized approach
Cache-aside + request coalescing + jittered TTL.
### Time and space complexity
O(1) lookup.
### Clean JavaScript solution
```javascript
function jitteredTtl(baseMs) {
  return baseMs + Math.floor(Math.random() * (baseMs * 0.1));
}
```
Explanation: jittered TTL spreads expirations over time and reduces synchronized cache stampedes.
### Alternative solutions when useful
Write-through or event-driven invalidation.
### Edge cases
Hot key expiry causing stampede.
### Test cases
Concurrent misses trigger one backend fetch.
### Follow-up questions
How to avoid stale critical data?
### Real-world production relevance
Major latency and cost reduction driver.

---

## Problem 4: Define SLO and Error Budget Policy
### Problem statement
Set SLO for checkout API and define deployment policy based on burn rate.
### Difficulty
Principal-level
### Interview expectations
- Quantitative objectives and actionable policy.
### Clarifying questions a strong candidate should ask
- Business criticality and peak load profile?
### Brute-force approach
Use average latency only.
### Optimized approach
Use p99 latency + success rate with burn-rate alerts.
### Time and space complexity
Not applicable (policy-level exercise).
### Clean JavaScript solution
```javascript
const slo = {
  availability: 99.9,
  p99LatencyMs: 500,
  windowDays: 30,
};
```
Explanation: this defines measurable SLO dimensions that can be tied directly to error budget burn-rate alerts.
### Alternative solutions when useful
Separate SLOs by endpoint criticality tier.
### Edge cases
Error budget consumed by dependency outage.
### Test cases
Simulate burn-rate calculations in dashboard.
### Follow-up questions
When do you freeze feature releases?
### Real-world production relevance
Connects reliability to delivery governance.

---

## Problem 5: Tail Latency Reduction Plan
### Problem statement
p50 is healthy but p99 degraded; propose remediation.
### Difficulty
Hard
### Interview expectations
- Tail-focused diagnosis.
### Clarifying questions a strong candidate should ask
- Is latency from app, DB, or downstream services?
### Brute-force approach
Scale all instances blindly.
### Optimized approach
Find long-tail source, isolate, cache, tune queries, cap retries.
### Time and space complexity
Not applicable (design diagnosis exercise).
### Clean JavaScript solution
```javascript
function summarizePercentiles(samples) {
  const sorted = samples.slice().sort((a, b) => a - b);
  const pick = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  return {
    p50: pick(0.5),
    p95: pick(0.95),
    p99: pick(0.99),
  };
}

function findTailOutliers(traceSpans, thresholdMs) {
  return traceSpans
    .filter((span) => span.durationMs >= thresholdMs)
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, 20);
}
```

Explanation: tail-first profiling should start by quantifying p95/p99 and extracting the worst spans rather than tuning average latency paths.
### Alternative solutions when useful
Hedged requests for idempotent read paths.
### Edge cases
Hedging increases backend load.
### Test cases
p99 improvement validated in canary.
### Follow-up questions
How to avoid regression after fix?
### Real-world production relevance
Tail latency dominates user experience in large systems.

---

## Problem 6: Multi-region Fallback Strategy
### Problem statement
Design fallback when primary region degrades.
### Difficulty
Principal-level
### Interview expectations
- Consistency vs availability tradeoff clarity.
### Clarifying questions a strong candidate should ask
- Active-active or active-passive?
- RPO/RTO targets?
### Brute-force approach
Manual failover only.
### Optimized approach
Health-gated routing with data consistency policy.
### Time and space complexity
Not applicable (architecture policy exercise).
### Clean JavaScript solution
```javascript
function chooseRegion({ health, preferredRegion, mode }) {
  const primaryHealthy = health[preferredRegion] === 'healthy';
  if (primaryHealthy) return preferredRegion;

  const fallback = Object.keys(health).find((r) => health[r] === 'healthy');
  if (!fallback) throw new Error('NO_HEALTHY_REGION');

  if (mode === 'write-strict') {
    throw new Error('PRIMARY_UNAVAILABLE_FOR_WRITES');
  }

  return fallback;
}
```

Explanation: reads can fail over to a healthy region quickly, while strict writes can enforce consistency guarantees by blocking when the primary is degraded.
### Alternative solutions when useful
Dual-write with conflict resolution strategy.
### Edge cases
Split-brain risk.
### Test cases
Game-day failover drill with rollback.
### Follow-up questions
How to validate data integrity post-failover?
### Real-world production relevance
Business continuity for mission-critical services.

---

## Section 9 Exit Criteria
- You can reason about reliability patterns, SLO policy, and tail latency tradeoffs at principal depth.
