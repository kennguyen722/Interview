# Lesson 19: Security & Type Safety

## Objective
Apply TypeScript's type system to enforce security best practices, prevent common vulnerabilities, and build secure applications through type-safe patterns.

## Topics Covered

### 1. Input Validation & Sanitization
- Runtime validation with zod
- Branded types for validated inputs
- Safe parsing patterns
- SQL injection prevention

### 2. XSS (Cross-Site Scripting) Prevention
- Template literal type safety
- Safe HTML rendering
- Content Security Policy
- DOM sanitization

### 3. Authentication & Authorization
- Type-safe JWT handling
- Role-based access control (RBAC)
- Permission systems with types
- Session management

### 4. Cryptography & Secrets
- Type-safe encryption wrappers
- Secret management patterns
- Hashing and salting
- Avoiding plaintext exposure

### 5. API Security
- Rate limiting with types
- CORS configuration
- Request validation
- Response sanitization

### 6. Dependency Security
- npm audit automation
- Type-safe dependency injection
- Avoiding prototype pollution
- Supply chain security

## Learning Outcomes
- Build type-safe validation pipelines
- Prevent SQL injection and XSS attacks
- Implement secure authentication systems
- Handle secrets safely with types
- Design secure APIs with TypeScript

## Key Concepts

### Branded Types for Validation
```typescript
type ValidatedEmail = string & { __brand: "ValidatedEmail" };
type SanitizedHTML = string & { __brand: "SanitizedHTML" };

function validateEmail(input: string): ValidatedEmail | null {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(input) ? (input as ValidatedEmail) : null;
}
```

### SQL Injection Prevention
```typescript
// ❌ Dangerous
function getUser(id: string) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);
}

// ✅ Safe with prepared statements
function getUser(id: string) {
  return db.query("SELECT * FROM users WHERE id = ?", [id]);
}
```

### XSS Prevention
```typescript
// ❌ Dangerous
function renderHTML(userInput: string) {
  element.innerHTML = userInput;
}

// ✅ Safe with sanitization
function renderHTML(userInput: string) {
  element.textContent = userInput; // Auto-escapes
}
```

## Security Patterns

See `examples/security-patterns.ts` for implementations of:
- Validated input types
- SQL-safe query builders
- XSS-safe template rendering
- JWT authentication
- RBAC permission system
- Secret management

## Practice Challenges

1. **Input Validator**: Build type-safe form validation
2. **SQL Query Builder**: Prevent SQL injection with types
3. **XSS-Safe Renderer**: Create safe HTML templating
4. **JWT Auth System**: Implement type-safe authentication
5. **RBAC System**: Role-based permissions with types
6. **Secret Manager**: Type-safe secret storage
7. **Rate Limiter**: Protect APIs from abuse
8. **CORS Middleware**: Type-safe CORS configuration

## Common Vulnerabilities

### OWASP Top 10 Coverage
1. **Injection**: Parameterized queries, input validation
2. **Broken Authentication**: Type-safe sessions, JWT validation
3. **Sensitive Data Exposure**: Branded types, secret management
4. **XML External Entities**: Safe parsing with validation
5. **Broken Access Control**: RBAC with type enforcement
6. **Security Misconfiguration**: Type-safe configs
7. **XSS**: Sanitization, CSP headers
8. **Insecure Deserialization**: Validation schemas
9. **Vulnerable Components**: Automated audits
10. **Insufficient Logging**: Structured secure logging

## Resources
- [OWASP TypeScript Cheat Sheet](https://cheatsheetseries.owasp.org/)
- [zod Validation Library](https://zod.dev/)
- [DOMPurify for XSS Prevention](https://github.com/cure53/DOMPurify)
- [Helmet.js for Express Security](https://helmetjs.github.io/)

## Next Steps
Complete the exercises to build secure, type-safe applications that protect against common vulnerabilities.
