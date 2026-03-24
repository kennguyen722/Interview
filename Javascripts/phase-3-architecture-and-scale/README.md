# Phase 3: Architecture and Scale (Mid -> Senior)

Goal: Learn scalable application design, microservices, performance optimization, and reliability engineering for interview scenarios.

## Module 9: Software Architecture and System Boundaries

Focus:
- Layered, hexagonal, and clean architecture
- Domain boundaries and dependency direction
- Modular monolith vs microservices decision framework
- Shared libraries vs service autonomy

Real-world case:
- E-commerce checkout domain decomposition

Interview-style prompts:
- "When should you keep a modular monolith instead of splitting services?"
- "How do you avoid distributed monolith anti-patterns?"

## Module 10: Scalable Application Design

Focus:
- Stateless services, horizontal scaling, load balancing
- Caching strategy (local, distributed, CDN)
- Database indexing and query optimization basics
- Async job queues and backpressure

Real-world case:
- Notification service scaling from 100 req/s to 5k req/s

Interview-style prompts:
- Design a scalable feed API with low latency and consistency trade-offs

## Module 11: Microservices and Event-Driven Systems

Focus:
- Service communication: sync vs async
- Event choreography vs orchestration
- Message brokers, retries, dead-letter queues
- Idempotent consumers and exactly-once myths

Real-world case:
- Order -> Payment -> Inventory -> Shipping workflow with compensation

Interview-style prompts:
- "How do you keep data consistent across services without distributed transactions?"

## Module 12: Performance Optimization and Reliability Engineering

Focus:
- Profiling CPU/memory/event-loop lag
- Throughput vs latency trade-offs
- Resilience patterns: timeout, retry, circuit breaker, bulkhead
- Observability: logs, metrics, traces, SLOs, error budgets

Real-world case:
- Reduce API p95 latency by 40 percent under peak load

Interview-style prompts:
- Design reliability strategy for an external payment dependency with intermittent failures

## Exit Criteria

- You can propose architecture with clear trade-offs and failure modes.
- You can design microservices and event flows with reliability controls.
- You can explain performance improvements using data and profiling results.

## Module Folders

- [module-09-architecture-boundaries](module-09-architecture-boundaries)
- [module-10-scalable-design](module-10-scalable-design)
- [module-11-microservices-events](module-11-microservices-events)
- [module-12-performance-reliability](module-12-performance-reliability)
