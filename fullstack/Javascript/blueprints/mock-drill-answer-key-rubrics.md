# Mock Drill Answer-Key Rubrics (Strong Answer vs Weak Answer)

Use this rubric after each section mock drill. Score each dimension 1-5.

## Global scoring dimensions
- Correctness
- Tradeoff depth
- Communication clarity
- Reliability/security awareness
- Practical production judgment

## Section 1: JavaScript Foundations
Strong answer:
- Explains execution model precisely (scope, closure, prototype, coercion).
- Solves with clean code and identifies edge cases proactively.
- Connects language mechanics to production bugs (memory leaks, hidden mutation).
Weak answer:
- Relies on memorized rules without explaining why.
- Misses edge cases and runtime implications.
- Cannot relate solution to real engineering incidents.

## Section 2: Async, Event Loop, Concurrency
Strong answer:
- Predicts queue ordering correctly and explains microtask/macrotask behavior.
- Implements bounded concurrency and cancellation safely.
- Discusses retries with idempotency and failure amplification risk.
Weak answer:
- Guesses output ordering.
- Uses unbounded Promise.all for all scenarios.
- Adds retries blindly without timeout/backoff strategy.

## Section 3: DSA in JavaScript
Strong answer:
- Chooses right pattern quickly and justifies complexity.
- Produces readable, bug-resistant implementation.
- Explains memory and practical performance tradeoffs.
Weak answer:
- Tries random approaches without pattern recognition.
- Gets complexity wrong or ignores it.
- Code passes happy path only.

## Section 4: Frontend Engineering
Strong answer:
- Fixes rendering/state issues with browser-aware reasoning.
- Handles stale closures, event delegation, and perf bottlenecks correctly.
- Balances UX responsiveness with correctness.
Weak answer:
- Focuses on framework syntax only.
- Misses render lifecycle/performance implications.
- Provides brittle fixes that regress under load.

## Section 5: Node.js and Backend API Engineering
Strong answer:
- Designs API behavior with idempotency, validation, and safe error contracts.
- Identifies N+1 and latency hotspots quickly.
- Explains observability and operational safeguards.
Weak answer:
- Treats endpoints as CRUD only.
- Ignores API contracts and replay behavior.
- Leaks internals in error handling.

## Section 6: Full Stack Integration Patterns
Strong answer:
- Coordinates frontend/backend consistency with partial-failure handling.
- Uses feature flags and trace propagation thoughtfully.
- Designs BFF with explicit latency and fallback policy.
Weak answer:
- Assumes all dependencies succeed.
- Ignores contract drift and consistency lag.
- No rollback/fallback strategy.

## Section 7: Data Layer and Persistence
Strong answer:
- Uses transaction boundaries correctly.
- Prevents tenant leaks and N+1 patterns.
- Proposes migration/index strategies with operational safety.
Weak answer:
- Splits atomic operations across independent writes.
- Relies on manual discipline for tenant filtering.
- Suggests risky migration approaches.

## Section 8: Testing and Debugging
Strong answer:
- Writes deterministic tests and isolates side effects.
- Uses hypothesis-driven debugging with observability signals.
- Produces durable fixes and prevention actions.
Weak answer:
- Uses flaky time-dependent tests.
- Debugs via random logging and guesswork.
- Fixes symptoms without root-cause closure.

## Section 9: Performance and Reliability
Strong answer:
- Composes timeout/retry/circuit/bulkhead correctly.
- Reasons in terms of p95/p99 and SLO/error budgets.
- Designs for fail-fast and graceful degradation.
Weak answer:
- Adds retries without limits.
- Optimizes averages while ignoring tail latency.
- No production fallback policy.

## Section 10: Security and Defensive Engineering
Strong answer:
- Identifies exploit path and mitigation for OWASP-class issues.
- Implements authn/authz with key/token lifecycle discipline.
- Applies secure defaults and secret management practices.
Weak answer:
- Treats security as optional patching.
- Relies on brittle input sanitization only.
- Lacks threat modeling and rotation strategy.

## Section 11: System Design Crossover
Strong answer:
- Clarifies requirements, estimates capacity, and explains tradeoffs.
- Designs failure handling and migration plan.
- Balances product speed with system integrity.
Weak answer:
- Jumps into architecture without assumptions.
- Ignores failure modes and operational concerns.
- Cannot defend tradeoff choices.

## Section 12: Principal Leadership and Judgment
Strong answer:
- Produces ADR-quality decisions with alternatives and consequences.
- Leads code review/incident strategy with prioritization.
- Demonstrates influence without authority and multiplier impact.
Weak answer:
- Gives opinion-only answers without structure.
- Focuses on local optimization, not org impact.
- No evidence of coaching/standards leadership.

## Quick grading scale
- 5: Principal-ready; anticipates risk and drives alignment.
- 4: Senior-strong; mostly complete with minor gaps.
- 3: Acceptable; workable but shallow in tradeoffs.
- 2: Partial; major correctness or judgment gaps.
- 1: Insufficient; misses core problem requirements.
