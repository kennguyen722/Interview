# Real-World JavaScript Problem Bank

Use these for timed interview practice. Every problem should be solved with:
- Correctness
- Complexity explanation
- Production concerns (validation, observability, failure handling)

## Section A: Events and Async (Frontend + Node)

1. Build an event bus with `on`, `once`, `off`, and wildcard support.
2. Implement debounce and throttle utilities; compare trade-offs under high-frequency input.
3. Create cancellable search requests with `AbortController` and race prevention.
4. Detect and fix memory leaks caused by orphaned listeners.
5. Build async task queue with max concurrency and backpressure.
6. Implement retry with exponential backoff and jitter.
7. Design an autosave pipeline resilient to intermittent network failures.
8. Build a resilient WebSocket reconnect strategy with circuit-breaking behavior.

## Section B: API and Service Coding

9. Build idempotent `POST /orders` endpoint using idempotency keys.
10. Implement request validation middleware with schema-driven errors.
11. Design pagination for large datasets with cursor-based navigation.
12. Build API rate limiter with sliding window logic.
13. Implement distributed cache aside strategy with stale-while-revalidate.
14. Build request deduplication layer to prevent duplicate expensive operations.
15. Add structured logging and correlation IDs across async boundaries.
16. Design endpoint-level timeout policy and fallback responses.

## Section C: Microservices and Distributed Workflows

17. Model order workflow across Order, Payment, Inventory, and Shipping services.
18. Implement outbox pattern simulation for reliable event publishing.
19. Create idempotent event consumer with duplicate message handling.
20. Design dead-letter queue handling with replay and poison message detection.
21. Build saga compensation flow for partial failures.
22. Define event versioning strategy without breaking old consumers.
23. Design eventual consistency reconciliation job.
24. Create service contract test approach to prevent integration breaks.

## Section D: Performance and Reliability

25. Reduce endpoint latency using batching and memoization.
26. Identify event-loop blocking code and offload safely.
27. Build circuit breaker with half-open state transitions.
28. Implement adaptive timeout strategy based on historical latency.
29. Create health-check strategy for dependencies and readiness probes.
30. Propose SLOs and error budget policy for a critical user-facing API.
31. Implement cache invalidation strategy for consistency-sensitive data.
32. Build benchmark harness and compare two algorithmic implementations.

## Section E: Architecture and Design Discussions

33. Design a notification platform handling email/SMS/push at scale.
34. Design real-time collaboration backend with event ordering guarantees.
35. Decide monolith vs microservices for a fast-growing startup and defend trade-offs.
36. Design feature flag platform with rollout safety and auditability.
37. Design multi-tenant SaaS service isolation strategy.
38. Design file processing pipeline for large uploads with retries and dedupe.
39. Design fraud detection event pipeline with low-latency requirements.
40. Design global API strategy for regional latency and failover.

## How To Practice Each Problem

1. Spend 5 minutes clarifying requirements.
2. Spend 20-30 minutes coding baseline solution.
3. Spend 10 minutes adding resilience and observability.
4. Spend 5 minutes explaining trade-offs and future scaling.

## Starter and Solution Packs

- Starter code (Problems 1-32): [starter/index.js](starter/index.js)
- Solution code (Problems 1-32): [solution/index.js](solution/index.js)
- Starter prompts (Problems 33-40): [starter/section-e-architecture.starter.md](starter/section-e-architecture.starter.md)
- Sample solutions (Problems 33-40): [solution/section-e-architecture.solution.md](solution/section-e-architecture.solution.md)

### Code File Mapping

- Problems 1-8: [starter/section-a-events-async.starter.js](starter/section-a-events-async.starter.js), [solution/section-a-events-async.solution.js](solution/section-a-events-async.solution.js)
- Problems 9-16: [starter/section-b-api-service.starter.js](starter/section-b-api-service.starter.js), [solution/section-b-api-service.solution.js](solution/section-b-api-service.solution.js)
- Problems 17-24: [starter/section-c-microservices.starter.js](starter/section-c-microservices.starter.js), [solution/section-c-microservices.solution.js](solution/section-c-microservices.solution.js)
- Problems 25-32: [starter/section-d-performance-reliability.starter.js](starter/section-d-performance-reliability.starter.js), [solution/section-d-performance-reliability.solution.js](solution/section-d-performance-reliability.solution.js)
- Problems 41-48: [starter/section-f-typescript-advanced.starter.js](starter/section-f-typescript-advanced.starter.js), [solution/section-f-typescript-advanced.solution.js](solution/section-f-typescript-advanced.solution.js)
- Problems 49-56: [starter/section-g-fullstack-patterns.starter.js](starter/section-g-fullstack-patterns.starter.js), [solution/section-g-fullstack-patterns.solution.js](solution/section-g-fullstack-patterns.solution.js)

## Section F: TypeScript & Advanced Design Patterns (Principal Level)

41. Build a type-safe event emitter with typed event map.
42. Implement `Result<T,E>` monad (`Ok`/`Err`) with `map`, `flatMap`, `mapError`, `unwrapOr`.
43. Build a generic LRU cache with TTL and max-size eviction.
44. Implement a type-safe dependency injection container (singleton + transient).
45. Build a discriminated union state machine with guard predicates.
46. Implement a schema validator with type-level error accumulation.
47. Build a generic observable/reactive stream with `map`, `filter`, `take` operators.
48. Implement a type-safe command bus with handler registration and dispatch.

## Section G: Full Stack Integration Patterns (Principal Level)

49. Build an SSR-aware data cache with hydration script generation (XSS-safe).
50. Implement an optimistic update manager with automatic rollback on server failure.
51. Build a GraphQL DataLoader (same-tick batching + per-request cache) for N+1 elimination.
52. Implement a form state manager with validation, dirty tracking, and reset.
53. Build an infinite scroll controller with double-load prevention.
54. Implement a CRDT G-Counter for distributed, conflict-free increment.
55. Build a feature flag service with gradual rollout via consistent hashing.
56. Implement an A/B test assigner with stable user bucketing.

## Automated Tests

- Test files: [tests/section-a.test.js](tests/section-a.test.js), [tests/section-b.test.js](tests/section-b.test.js), [tests/section-c.test.js](tests/section-c.test.js), [tests/section-d.test.js](tests/section-d.test.js)
- Section F tests: [tests/section-f.test.js](tests/section-f.test.js)
- Section G tests: [tests/section-g.test.js](tests/section-g.test.js)
- Run all tests: `npm run test:problem-bank`
- Run F+G tests: `npm run test:problem-bank-fg`
