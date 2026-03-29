# Mini-Project: Order API Reliability Pack

## Scenario
Build core reliability primitives for an enterprise order API: idempotent creation, stable cursor pagination, and per-tenant rate limiting.

## Tasks
1. Build an in-memory idempotency store.
2. Implement order creation service with payload fingerprint checks.
3. Implement cursor encode/decode helpers.
4. Implement keyset page slicing utility.
5. Implement token bucket rate limiter by tenant.

## Files
- starter/index.js
- solution/index.js
- tests/mini-project-05.test.js
