# Module 9 Solution - Advanced Architecture and Distributed Systems

Production-grade baseline for lessons 9.1 through 9.5.

## Lesson Coverage

- 9.1 Microservices Design
  - Bounded service responsibilities and explicit orchestration layer.
- 9.2 Spring Cloud Patterns
  - Retry and failure-aware remote client simulation.
- 9.3 Distributed Data and Consistency
  - Saga orchestration with compensating actions and outbox events.
- 9.4 API Gateway and BFF
  - Aggregated customer overview endpoint for frontend-facing access.
- 9.5 System Design in Practice
  - Operational architecture report endpoint with tradeoffs.

## Stack

- Java 21 + Spring Boot 3.3
- Spring Web + Validation + Actuator + Retry
- In-memory repositories for deterministic local learning flow
- JUnit 5 tests for orchestration and aggregation behaviors

## Run

```bash
mvn spring-boot:run
```

## Key Endpoints

- `POST /api/v1/orders` create order via saga orchestration
- `GET /api/v1/orders/{orderId}` order lookup
- `GET /api/v1/gateway/customers/{customerId}/overview` gateway/BFF aggregation
- `GET /api/v1/admin/system-design` architecture summary and design choices

## Example Requests

Create order:

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":101,"sku":"book-123","quantity":2,"totalAmount":29.99}'
```

Get gateway overview:

```bash
curl http://localhost:8080/api/v1/gateway/customers/101/overview
```

System design summary:

```bash
curl http://localhost:8080/api/v1/admin/system-design
```
