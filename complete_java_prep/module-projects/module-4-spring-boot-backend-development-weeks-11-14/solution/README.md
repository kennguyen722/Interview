# Module 4 Solution - Production Backend Baseline

This project is a full, production-oriented Spring Boot baseline for lessons 4.1 through 4.5.

## Lesson Coverage

- 4.1 Spring Core Concepts
  - Dependency injection via constructor wiring in service/controller beans.
  - Environment-specific config profiles in `application.yml` and `application-dev.yml`.
- 4.2 Building REST APIs with Spring Boot
  - Versioned endpoints under `/api/v1/books`.
  - Request validation + global error responses.
  - Pagination support for list/search APIs.
- 4.3 Persistence with Spring Data JPA
  - JPA entities with relationships (`Book` -> `Author`).
  - Repository and service-layer transaction boundaries.
- 4.4 Database Migration and Seed Data
  - Flyway migrations in `src/main/resources/db/migration`.
  - Versioned schema and deterministic seed data.
- 4.5 Advanced Querying and Performance
  - Search query with optional filters and pagination.
  - `@EntityGraph` to reduce N+1 when loading author data.

## Stack

- Java 21
- Spring Boot 3.3
- Spring Web, Validation, Data JPA, Actuator
- PostgreSQL + Flyway
- H2 profile for fast local development
- JUnit 5 + Spring test support

## Run Locally

1. Start database:

```bash
docker compose up -d
```

2. Start app:

```bash
mvn spring-boot:run
```

3. Run tests:

```bash
mvn test
```

4. Run with in-memory profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## API Examples

Create book:

```bash
curl -X POST http://localhost:8080/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Designing Data-Intensive Applications",
    "isbn": "9781449373320",
    "publishedYear": 2017,
    "price": 68.99,
    "authorId": 1
  }'
```

Search books:

```bash
curl "http://localhost:8080/api/v1/books?title=clean&minPrice=40&maxPrice=60&page=0&size=10"
```

## Project Structure

- `src/main/java/com/interview/module4/book` - domain, repository, service, controller
- `src/main/java/com/interview/module4/common` - shared API and exception handling
- `src/main/resources/db/migration` - Flyway SQL migrations
- `src/test/java/com/interview/module4/book` - focused web and data tests

## Suggested Lesson-by-Lesson Flow

1. Lesson 4.1: run app and inspect bean wiring and profiles.
2. Lesson 4.2: extend controller with DTO validation rules.
3. Lesson 4.3: add new entity relation and service methods.
4. Lesson 4.4: add migration V3 and verify roll-forward strategy.
5. Lesson 4.5: benchmark search query and tune indexes.
