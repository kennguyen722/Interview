# Module 5 Solution - Data Layer and Messaging

This is a production-grade backend baseline for lessons 5.1 through 5.4.

## Lesson Coverage

- 5.1 SQL Mastery for Developers
  - PostgreSQL schema with indexes and native SQL reporting query.
  - Top-customer aggregation endpoint based on date range.
- 5.2 Redis and Caching Patterns
  - Cache-aside read model for order lookup (`@Cacheable`).
- 5.3 Intro to NoSQL (MongoDB)
  - Mongo collection stores audit/projection records for order events.
- 5.4 Event-Driven Architecture Basics
  - RabbitMQ exchange/queue/DLQ topology.
  - Producer publishes order-created events.
  - Consumer persists event projection to MongoDB.

## Stack

- Java 21, Spring Boot 3.3
- Spring Data JPA + PostgreSQL + Flyway
- Spring Data Redis
- Spring Data MongoDB
- Spring AMQP (RabbitMQ)
- Actuator and test support

## Run

1. Start infra:

```bash
docker compose up -d
```

2. Run app:

```bash
mvn spring-boot:run
```

3. Run tests:

```bash
mvn test
```

## API Examples

Create order:

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "referenceCode": "ORD-DEMO-5001",
    "totalAmount": 199.99
  }'
```

Get order (Redis cache-aside):

```bash
curl http://localhost:8080/api/v1/orders/1
```

Top customers report:

```bash
curl "http://localhost:8080/api/v1/orders/reports/top-customers?from=2026-01-01&to=2026-12-31&limit=5"
```

## Project Structure

- `src/main/java/com/interview/module5/customer` - relational customer model
- `src/main/java/com/interview/module5/order` - order domain, APIs, SQL reports, messaging
- `src/main/java/com/interview/module5/audit` - Mongo audit projection
- `src/main/java/com/interview/module5/config` - Redis and RabbitMQ infrastructure config
- `src/main/resources/db/migration` - Flyway SQL migrations
