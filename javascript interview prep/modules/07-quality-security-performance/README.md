# Module 07: Quality, Security, and Performance

## Objective
Reach production-level quality by combining test rigor, security controls, and performance engineering.

## Topics
- Test strategy: unit, integration, contract, e2e
- Deterministic async testing and flaky test reduction
- OWASP basics for JavaScript services and clients
- SQL injection, XSS, CSRF, secret management
- Profiling, caching, latency optimization, p95/p99
- Reliability patterns and defensive defaults

## Hands-on Labs
1. Build deterministic test harness for retry logic.
2. Create contract test gate for API consumers.
3. Harden API against common injection vectors.
4. Add latency dashboards and profiling scripts.
5. Build reliability wrapper defaults package.

Topics and Labs Code Pack:
- Starter: [starter/topics-and-labs.js](starter/topics-and-labs.js)
- Solution: [solution/topics-and-labs.js](solution/topics-and-labs.js)
- Tests: [tests/topics-and-labs.test.js](tests/topics-and-labs.test.js)

## Enterprise Mini-Project
- [Security and Performance Hardening Pack](mini-project/README.md)
- Starter: [mini-project/starter/index.js](mini-project/starter/index.js)
- Solution: [mini-project/solution/index.js](mini-project/solution/index.js)
- Tests: [mini-project/tests/mini-project-07.test.js](mini-project/tests/mini-project-07.test.js)

## Problem Set (15)
1. Retry test with injected fake sleep.
2. Contract drift detector.
3. SQL injection-safe query refactor.
4. XSS-safe renderer helper.
5. CSRF verifier middleware.
6. JWT key rotation check.
7. Secret provider with fallback cache.
8. Structured error sanitizer.
9. p95/p99 calculator.
10. Hot-key cache stampede guard.
11. Circuit breaker and timeout composition.
12. Bulkhead pressure test harness.
13. Flaky test classifier from CI history.
14. Incident timeline reconstruction utility.
15. Performance regression detector.

Problem Set Code Pack:
- Starter: [starter/problems.js](starter/problems.js)
- Solution: [solution/problems.js](solution/problems.js)
- Tests: [tests/problems.test.js](tests/problems.test.js)

## Exit Criteria
- Can design safe-by-default systems with measurable quality outcomes.
- Can identify and remediate reliability and security risks quickly.
