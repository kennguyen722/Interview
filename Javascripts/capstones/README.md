# Capstone Projects (Production-Grade, Real-World)

Complete at least 2 projects. Each capstone should include tests, observability, reliability controls, and architecture notes.

## Capstone 1: Event-Driven Notification Platform

Problem:
- Build a system that sends notifications through email, SMS, and push channels.

Requirements:
- Idempotent requests and dedupe keys
- Retry with backoff and dead-letter handling
- Priority queues (high vs normal)
- Rate limiting per tenant
- Delivery status tracking and audit logs

Interview focus areas:
- Event handling correctness
- Throughput and backpressure
- Failure isolation and reliability

**Files:**
- [capstone-1-notification-platform/lesson.md](capstone-1-notification-platform/lesson.md)
- [capstone-1-notification-platform/starter/index.js](capstone-1-notification-platform/starter/index.js)
- [capstone-1-notification-platform/solution/index.js](capstone-1-notification-platform/solution/index.js)

## Capstone 2: Scalable Order Workflow (Microservices)

Problem:
- Build a distributed order process across services: Order, Payment, Inventory, Shipping.

Requirements:
- Event-driven choreography or orchestrated saga
- Compensating transactions for failures
- Idempotent consumers
- Outbox pattern for event publishing reliability
- Contract tests between services

Interview focus areas:
- Scalable service boundaries
- Eventual consistency strategy
- Observability and incident debugging

**Files:**
- [capstone-2-order-workflow/lesson.md](capstone-2-order-workflow/lesson.md)
- [capstone-2-order-workflow/starter/index.js](capstone-2-order-workflow/starter/index.js)
- [capstone-2-order-workflow/solution/index.js](capstone-2-order-workflow/solution/index.js)

## Capstone 3: Performance and Reliability Toolkit

Problem:
- Build reusable production toolkit for service integrations.

Requirements:
- Timeout wrapper
- Retry policy with jitter
- Circuit breaker
- Bulkhead limiter
- Metrics emitter (success/error/latency)

Interview focus areas:
- Reliability under unstable dependencies
- Trade-offs between latency and success rate
- Operational readiness and SLO impact

**Files:**
- [capstone-3-reliability-toolkit/lesson.md](capstone-3-reliability-toolkit/lesson.md)
- [capstone-3-reliability-toolkit/starter/index.js](capstone-3-reliability-toolkit/starter/index.js)
- [capstone-3-reliability-toolkit/solution/index.js](capstone-3-reliability-toolkit/solution/index.js)

## Mandatory Deliverables Per Capstone

- Architecture diagram (service/component level)
- API/event contracts
- Test strategy (unit/integration/contract)
- Reliability strategy (timeouts/retries/circuit breakers)
- Performance baseline and optimization report
- Runbook for incident response
