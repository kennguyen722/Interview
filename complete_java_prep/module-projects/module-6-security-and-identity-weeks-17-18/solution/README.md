# Module 6 Solution - Security and Identity

Production-grade baseline for lessons 6.1 through 6.4.

## Lesson Coverage

- 6.1 Spring Security Fundamentals
  - Stateless security chain and role-based authorization.
- 6.2 JWT and OAuth2/OIDC
  - JWT access token issuance and validation.
  - Refresh token rotation flow.
- 6.3 API Security Best Practices
  - Password hashing, endpoint authorization, structured error responses.
- 6.4 Secure Coding and Compliance Basics
  - Token lifecycle constraints, explicit role boundaries, and secure defaults.

## Stack

- Java 21 + Spring Boot 3.3
- Spring Security + Spring Data JPA + Flyway
- JWT with jjwt
- PostgreSQL (runtime) + H2 dev profile

## Run

1. Start database:

```bash
docker compose up -d
```

2. Run app:

```bash
mvn spring-boot:run
```

3. Seeded users:
- username: admin, password: Admin@123
- username: user, password: User@123

## API Flow

Login:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"User@123"}'
```

Refresh:

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-token>"}'
```

Protected endpoint:

```bash
curl http://localhost:8080/api/v1/auth/me -H "Authorization: Bearer <access-token>"
```

Admin-only endpoint:

```bash
curl http://localhost:8080/api/v1/admin/health -H "Authorization: Bearer <access-token>"
```
