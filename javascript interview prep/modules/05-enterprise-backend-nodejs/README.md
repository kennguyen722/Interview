# Module 05: Enterprise Backend Node.js

## Objective
Implement robust APIs and persistence workflows expected in Senior backend interviews.

## Topics
- API contracts and validation
- Error taxonomy and response mapping
- Idempotency keys and transactional safety
- Cursor pagination and filtering
- Rate limiting and middleware architecture
- Observability hooks and graceful shutdown
- Node streams basics for ingestion pipelines
- Backpressure concept for safe high-throughput writes

## Hands-on Labs
1. Build idempotent order creation API.
2. Cursor pagination endpoint with stable ordering.
3. Rate limiter middleware pack.
4. Graceful shutdown and in-flight drain.
5. Multi-tenant repository guard implementation.

Topics and Labs Code Pack:
- Starter: [starter/topics-and-labs.js](starter/topics-and-labs.js)
- Solution: [solution/topics-and-labs.js](solution/topics-and-labs.js)
- Tests: [tests/topics-and-labs.test.js](tests/topics-and-labs.test.js)

## Enterprise Mini-Project
- [Order API Reliability Pack](mini-project/README.md)
- Starter: [mini-project/starter/index.js](mini-project/starter/index.js)
- Solution: [mini-project/solution/index.js](mini-project/solution/index.js)
- Tests: [mini-project/tests/mini-project-05.test.js](mini-project/tests/mini-project-05.test.js)

## Problem Set (15)
1. Request validator with structured errors.
2. Idempotency middleware with payload fingerprint.
3. Cursor encode/decode utility.
4. Query guard and budget limiter.
5. Transactional write with audit trail.
6. Outbox insertion inside transaction.
7. JWT auth middleware with kid support.
8. RBAC middleware and policy checks.
9. API version negotiation.
10. Search endpoint with dynamic filtering.
11. Soft delete and restore flow.
12. N+1 elimination query refactor.
13. Connection timeout fallback path.
14. Tenant-isolated cache keys.
15. Bulk mutation with partial success contract.

Problem Set Code Pack:
- Starter: [starter/problems.js](starter/problems.js)
- Solution: [solution/problems.js](solution/problems.js)
- Tests: [tests/problems.test.js](tests/problems.test.js)

## Exit Criteria
- Can implement production-grade API behavior, not only CRUD basics.
- Can reason about consistency, safety, and observability.
