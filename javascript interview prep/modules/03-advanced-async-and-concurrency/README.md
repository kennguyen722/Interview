# Module 03: Advanced Async and Concurrency

## Objective
Master asynchronous programming patterns used in resilient production systems.

## Topics
- Event loop, microtasks, macrotasks
- Promise combinators and failure semantics
- Async/await error boundaries
- Cancellation with AbortController
- Concurrency pools and worker queues
- Retry, backoff, and jitter strategies
- Node streams basics
- Backpressure concept
- Abort signals and cancellation

See: [../../tracks/advanced-topics-checklist.md](../../tracks/advanced-topics-checklist.md)

## Hands-on Labs
1. Build bounded concurrency task runner.
2. Implement fetch with timeout and cancellation.
3. Build request coalescer for duplicate in-flight calls.
4. Implement retry wrapper with retryable predicate.
5. Create in-memory queue with backpressure.

Topics and Labs Code Pack:
- Starter: [starter/topics-and-labs.js](starter/topics-and-labs.js)
- Solution: [solution/topics-and-labs.js](solution/topics-and-labs.js)
- Tests: [tests/topics-and-labs.test.js](tests/topics-and-labs.test.js)

## Enterprise Mini-Project
- [Resilient Ingestion Pipeline](mini-project/README.md)
- Starter: [mini-project/starter/index.js](mini-project/starter/index.js)
- Solution: [mini-project/solution/index.js](mini-project/solution/index.js)
- Tests: [mini-project/tests/mini-project-03.test.js](mini-project/tests/mini-project-03.test.js)

## Problem Set (15)
1. promiseAll implementation.
2. promiseAny implementation.
3. Queue with max concurrency.
4. Token bucket limiter async adapter.
5. Circuit breaker finite-state machine.
6. Bulkhead guard for dependency calls.
7. Debounced autosave with cancellation.
8. Async cache with stale-while-revalidate.
9. Job retry scheduler.
10. Dead letter queue simulation.
11. Idempotent consumer logic.
12. Event replay ordering checks.
13. Long-running workflow heartbeat.
14. Connection pool timeout wrapper.
15. Adaptive timeout using p95 history.

Problem Set Code Pack:
- Starter: [starter/problems.js](starter/problems.js)
- Solution: [solution/problems.js](solution/problems.js)
- Tests: [tests/problems.test.js](tests/problems.test.js)

## Exit Criteria
- Can compose reliable async patterns with clear tradeoff explanations.
- Can debug race conditions and high-latency paths effectively.
