# Capstone 3: Performance & Reliability Toolkit

## Problem Statement

Build a production-grade reliability library that wraps any async function with a composable set of resilience patterns.

## Requirements

- `withTimeout(fn, ms)`: reject if fn takes longer than ms
- `withRetry(fn, { maxAttempts, baseDelayMs, jitter })`: retry with exponential backoff + optional jitter
- `createCircuitBreaker({ failureThreshold, successThreshold, timeoutMs })`: open after N failures, half-open after timeout, close after M successes
- `createBulkhead({ maxConcurrent, maxQueue })`: cap concurrent executions; overflow queue; reject if queue full
- `createMetricsEmitter()`: track success/error counts, latency histogram (p50/p95/p99)
- `createReliableClient(options)`: compose all patterns in the right order

## Technical Constraints

- No external dependencies
- Must be runnable with `node solution/index.js`
- All patterns must be independently testable

## Interview Focus Areas

1. **Circuit breaker states** — explain CLOSED → OPEN → HALF_OPEN transitions
2. **Jitter in retry** — what is the thundering herd problem and how does jitter solve it?
3. **Bulkhead pattern** — why is this important in microservice architectures?
4. **Composition order** — should you apply circuit breaker inside or outside retry? Why?
5. **P99 vs average latency** — why does percentile latency matter more for SLOs?
6. **Adaptive timeout** — how would you implement a timeout that adjusts based on observed p95?

## Composition Order (Important!)

```
Client call
  → bulkhead (concurrent connection control)
    → retry (attempt N times on failure)
      → timeout (each attempt has a deadline)
        → circuit breaker (stop if too many failures)
          → real function
```

## Deliverables

See `solution/index.js` for the complete implementation.
