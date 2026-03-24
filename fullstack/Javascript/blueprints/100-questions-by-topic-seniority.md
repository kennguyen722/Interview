# 100 JavaScript Interview Questions by Topic and Seniority

Legend:
- [S] Senior-level expected
- [P] Principal-level expected

## A. JavaScript Fundamentals and Runtime (1-12)
1. [S] Explain lexical scope using nested functions and a closure bug.
2. [S] Re-implement Function.prototype.bind with partial arguments.
3. [S] Implement deep clone with Date/Map/Set/circular references.
4. [S] Debug this-binding regression in extracted class methods.
5. [S] Compare object spread vs structuredClone tradeoffs.
6. [S] Explain prototype chain lookup costs and implications.
7. [S] Implement safe merge preventing prototype pollution.
8. [P] Design plugin architecture with controlled extension points.
9. [P] Explain memory leak causes in closure-heavy modules.
10. [P] Build immutable configuration loader with overrides.
11. [P] Review utility library for hidden state side effects.
12. [P] Define shared JS utility coding standards.

## B. Async/Event Loop/Concurrency (13-24)
13. [S] Predict output ordering for Promise/setTimeout/queueMicrotask.
14. [S] Implement Promise.all with fast rejection.
15. [S] Build bounded concurrency task runner.
16. [S] Implement cancelable fetch with timeout.
17. [S] Add retry with exponential backoff and jitter.
18. [S] Implement request coalescing for duplicate in-flight keys.
19. [P] Design compensation strategy for partial async failures.
20. [P] Compare queue-driven vs event-driven orchestration.
21. [P] Diagnose event-loop lag under CPU load.
22. [P] Define async error-handling standards org-wide.
23. [P] Design worker-thread offload policy.
24. [P] Create reliability policy for third-party API calls.

## C. DSA in JavaScript (25-40)
25. [S] Two-sum with optimal complexity.
26. [S] Longest substring without repeating characters.
27. [S] Merge overlapping intervals.
28. [S] Top-k frequent elements.
29. [S] LRU cache in O(1).
30. [S] Validate BST and recursion-space analysis.
31. [S] Number of islands BFS/DFS.
32. [S] Course schedule topological sort.
33. [S] Sliding window maximum.
34. [S] Minimum window substring.
35. [P] Streaming quantile approximation design.
36. [P] Low-latency dedup for high-throughput events.
37. [P] Exact vs approximate algorithm tradeoffs.
38. [P] Scalable ranking pipeline strategy.
39. [P] Algorithm selection under tail-latency SLO.
40. [P] Quantify infra-cost implications of algorithm choice.

## D. Frontend Engineering (41-52)
41. [S] Event delegation for dynamic lists.
42. [S] Debounce/throttle with cancel/flush.
43. [S] Fix layout thrashing in scroll UI.
44. [S] Build virtualized list windowing.
45. [S] Diagnose stale closure bug in React hooks.
46. [S] Design robust state model for complex forms.
47. [P] Data-fetching/cache invalidation architecture.
48. [P] SSR + hydration strategy for SEO/perf.
49. [P] Frontend observability standards.
50. [P] Migrate legacy state architecture safely.
51. [P] Server components vs client rendering tradeoffs.
52. [P] Design-system governance model.

## E. Backend API/Node.js (53-66)
53. [S] REST endpoint with filtering and pagination.
54. [S] Idempotency-key middleware for create operations.
55. [S] Request validation with structured errors.
56. [S] Detect and remove N+1 query pattern.
57. [S] Implement token-bucket rate limiter.
58. [S] API error taxonomy and safe client responses.
59. [S] Cursor pagination with ordering guarantees.
60. [P] BFF design for multi-client platform.
61. [P] Graceful degradation during dependency outage.
62. [P] API evolution/versioning strategy.
63. [P] Service ownership and operational model.
64. [P] Node performance budget governance.
65. [P] API gateway policy architecture.
66. [P] Architecture review of backend boundaries.

## F. Full Stack Integration Scenarios (67-78)
67. [S] Optimistic UI with rollback.
68. [S] Server-side dashboard aggregation endpoint.
69. [S] Eventual consistency reconciliation UX.
70. [S] Feature flag deterministic bucketing.
71. [S] Audit trail for critical actions.
72. [S] WebSocket reconnection strategy.
73. [P] Monolith-to-service migration phases.
74. [P] Event-driven order workflow with compensation.
75. [P] Build-vs-buy orchestration decision.
76. [P] Multi-tenant isolation architecture.
77. [P] ADR process and governance.
78. [P] Cross-team reliability hardening roadmap.

## G. Testing and Debugging (79-88)
79. [S] Deterministic tests for retry logic.
80. [S] Frontend-backend contract tests.
81. [S] Memory leak debugging in Node.
82. [S] Diagnose intermittent race condition.
83. [S] Time-dependent logic testing strategy.
84. [S] Refactor for testability via DI.
85. [P] Org-level testing pyramid and quality gates.
86. [P] Incident debugging playbook design.
87. [P] Flaky-test reduction program.
88. [P] Post-incident technical prevention plan.

## H. Performance and Reliability (89-94)
89. [S] Circuit breaker state machine implementation.
90. [S] Bulkhead isolation around unstable dependency.
91. [S] Cache strategy tuning for read-heavy endpoint.
92. [P] Define SLO/error budget policy.
93. [P] Service reliability scorecard and prioritization.
94. [P] Multi-region fallback with consistency tradeoffs.

## I. Security and Defensive Engineering (95-100)
95. [S] Identify and fix SQL/command injection.
96. [S] JWT verification and key rotation strategy.
97. [S] CSRF/XSS defense for web apps.
98. [P] End-to-end auth strategy across services.
99. [P] Threat model and harden file upload pipeline.
100. [P] Security review checklist for critical changes.
