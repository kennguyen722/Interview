# Capstone 03: Resilient API Service

Requirements coverage:
- Idempotent create endpoint: `createOrderIdempotent`
- Cursor pagination and filtering: `listOrders`
- Timeout, retry, circuit breaker, bulkhead: `createResilienceRuntime` + `simulatePayment`
- Structured logs and metrics hooks: `hooks.log`, `hooks.metric`

Run tests:
- `node --test capstones/03-resilient-api-service/tests/capstone-03.test.js`
