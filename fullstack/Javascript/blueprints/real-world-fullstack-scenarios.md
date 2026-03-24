# Real-World Full Stack Scenarios (Coding + Design Crossover)

## Scenario 1: Notification Platform at Scale

### Context
A SaaS product needs reliable multi-channel notifications (email, SMS, in-app) with retries and deduplication.

### Coding exercise
- implement idempotency key handling
- implement retry with jitter and DLQ fallback

### Design crossover
- queue partitioning strategy
- delivery guarantees and exactly-once illusions
- observability dashboard and SLOs

## Scenario 2: Order Workflow and Inventory Consistency

### Context
E-commerce checkout must avoid overselling during traffic spikes.

### Coding exercise
- implement optimistic reservation API
- implement compensation on payment failure

### Design crossover
- saga orchestration vs choreography
- consistency model and failure handling
- transaction boundaries and outbox pattern

## Scenario 3: Dashboard Aggregator (BFF)

### Context
Frontend dashboard fetches data from 6 services with mixed latency.

### Coding exercise
- implement BFF endpoint with bounded fan-out concurrency
- per-widget timeout and partial response strategy

### Design crossover
- caching plan (edge + server + client)
- stale data policy and UX fallback
- API versioning and schema evolution

## Scenario 4: Auth and Session Security Hardening

### Context
Current auth has weak token handling and inconsistent authorization checks.

### Coding exercise
- implement JWT verification middleware with key rotation support
- role/permission guard for critical routes

### Design crossover
- access token + refresh rotation lifecycle
- breach response and token revocation strategy
- audit logging and compliance concerns

## Scenario 5: Frontend Performance Regression Investigation

### Context
Product release caused p95 interaction delay and increased crash reports.

### Coding exercise
- identify stale closure and unnecessary rerenders
- implement memoization and event scheduling fix

### Design crossover
- web-vitals instrumentation strategy
- release guardrails and canary policy
- performance budget governance

## Scenario 6: Multi-Tenant SaaS Isolation

### Context
Platform serves many tenants with mixed compliance requirements.

### Coding exercise
- enforce tenant-bound data access in repository layer
- add tenant-aware cache keys and query guards

### Design crossover
- isolation model (shared db/schema vs separate db)
- noisy-neighbor protection
- tenant-level SLO and incident response model
