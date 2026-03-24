# Architecture Round — Sample Answer: Monolith to Microservices Migration

## 1. Recommendation

**Yes, migrate — but incrementally, not as a big bang rewrite.**

The signals (45-minute test suites, deployment coupling, merge conflicts for 15 engineers) indicate the monolith has crossed the scale threshold where its productivity cost exceeds its simplicity benefit. However, a clean-cut rewrite in 6 months with 3 engineers would fail. The correct approach is the **Strangler Fig** pattern: route by route, domain by domain, over 6-12 months, while keeping the monolith alive throughout.

---

## 2. Domain Decomposition (in migration order)

Extract in this sequence — lowest risk of data coupling first:

| Priority | Service | Reason to extract early |
|----------|---------|------------------------|
| 1 | **Notification Service** | Pure write-only, minimal DB reads, no shared transactions |
| 2 | **Search/Catalog Service** | Read-heavy, can be powered by Elasticsearch; no transactional writes |
| 3 | **User/Auth Service** | Clear boundary, existing JWT boundary is a natural seam |
| 4 | **Order Service** | High value domain; isolating orders enables independent scaling |
| 5 | **Payment Service** | Requires careful saga/idempotency design; delay until team is comfortable |
| — | **Inventory** | Most tightly coupled to orders — extract last |

---

## 3. Strangler Fig Strategy

The Strangler Fig pattern wraps the monolith behind an API gateway, then gradually intercepts specific routes and redirects them to new microservices.

**Step-by-step:**

1. **Add API Gateway** (Nginx or Kong) in front of the monolith. All traffic still flows through to the Rails app. No functional change.

2. **Pick the first extraction target** (Notification Service). Build the new Node.js service independently.

3. **Dual-write phase**: Have the Rails monolith publish events to a message broker (RabbitMQ or SNS). New service consumes events and sends notifications. Rails still sends notifications directly too. Run both in parallel for 2 weeks to validate correctness.

4. **Cut over**: Disable the Rails notification code. Only the new service sends notifications. Validate.

5. **Repeat** for the next service on the list.

At no point is the monolith switched off until all routes are migrated.

---

## 4. Data Decomposition Strategy

**Rule: A service owns its data. No cross-service joins.**

Sequence:
1. Start with **read replicas**: New search service reads from a PostgreSQL replica of the monolith DB. Write-through is still the monolith. No data migration needed yet.

2. **Shadow writes**: New service starts writing to its own isolated DB. Monolith continues writing to the shared DB. Reconcile periodically.

3. **Dual-write + validation**: Both the monolith and new service write to their respective databases. Background job validates consistency.

4. **Cut write path over**: Monolith stops writing to the table. New service owns all writes. Drop the columns from the monolith schema.

**Key constraint**: Never allow two services to share a writable table. Use async events for cross-service data propagation, not foreign keys.

---

## 5. Risks to Warn the CTO About

| Risk | Mitigation |
|------|-----------|
| **Distributed monolith**: Services extracted but still tightly coupled via synchronous HTTP calls | Enforce async event communication for non-critical paths; circuit breakers for sync calls |
| **Operational complexity explosion**: Went from 1 deployable to 8+; need deploy pipelines, service discovery, log aggregation, distributed tracing | Phase in DevOps tooling (Kubernetes, Jaeger, ELK) before extraction, not after |
| **Data consistency during migration**: Dual-write window can produce divergent state | Use event sourcing or CDC (Change Data Capture via Debezium) for precise sync |
| **Team skill gap**: Rails engineers unfamiliar with distributed systems patterns (saga, idempotency) | Schedule team enablement sessions alongside the migration; don't assume the team is ready |

---

## 6. Success Criteria

The migration is "done" when:
- [ ] Deploy time per service < 10 minutes, independent of other services
- [ ] Test suite per service < 5 minutes
- [ ] Zero shared database tables between any two services
- [ ] P99 latency is equal or lower than pre-migration baseline
- [ ] No single service failure can take down the entire platform
- [ ] Each team owns exactly one service end-to-end (Conway's Law alignment)
