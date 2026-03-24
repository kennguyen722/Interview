# Module 17: Auth, Identity & Security Patterns

## Why This Matters for Principal Interviews

Auth is a cross-cutting concern that principal engineers own end to end. Interviewers commonly use auth scenarios to test:
- Security threat modeling
- Token lifecycle management
- Cross-service identity propagation
- Authorization design (RBAC vs ABAC)

## Topics

### 1. JWT (JSON Web Tokens)
Three-part structure: `header.payload.signature` (base64url encoded).
- **header**: algorithm + token type
- **payload**: claims (sub, exp, iat, roles)
- **signature**: HMAC-SHA256 of header.payload using a secret

Implementation uses Node's built-in `crypto` module for HMAC-SHA256 — **no `jsonwebtoken` library needed**.

### 2. Refresh Token Rotation
Access tokens expire quickly (15–60min) for security. Refresh tokens are long-lived but rotate on each use (prevents token replay after theft).
- On `/refresh`: verify refresh token, issue new access + new refresh token, invalidate old refresh token

### 3. Role-Based Access Control (RBAC)
Map users to roles, roles to permissions.
```js
roles: { admin: ['orders:read', 'orders:write', 'users:read', 'users:write'] }
```
`can(user, 'orders:write')` returns a boolean. Clean, auditable, easy to manage.

### 4. Attribute-Based Access Control (ABAC)
More flexible than RBAC — policies evaluate attributes of subject, resource, and context.
```js
// "managers can approve orders only if order.amount < 10000"
policy: ({ user, resource, action, context }) => ...
```

### 5. Session Store with Sliding TTL
Server-side sessions stored in Redis/memory. Session TTL resets on each access (sliding window). Essential for maintaining auth state without short-lived JWTs.

### 6. Token Revocation Blacklist
When a user logs out or an admin revokes a token, add the JTI (JWT ID) to a blacklist with TTL = original token expiry.

## Security Threat Model for Auth Systems

| Threat | Mitigation |
|--------|-----------|
| Token theft | Short expiry + secure cookie + HTTPS only |
| Refresh token replay | Rotate on each use, invalidate old token |
| Brute force | Rate limit per IP + per account |
| XSS stealing tokens | HttpOnly cookies (not localStorage) |
| CSRF with cookies | SameSite=Strict or CSRF token |
| Privilege escalation | Validate permissions server-side, never trust client claims |

## Interview Drill Questions

- "Explain the difference between authentication and authorization."
- "What is the tradeoff between JWT stateless verification and session-based auth?"
- "How does token rotation prevent refresh token theft?"
- "Design an RBAC system for a multi-tenant SaaS application."
- "What is OAuth2 PKCE and why is it needed for SPAs?"
- "How would you implement account lockout without introducing a timing attack?"

## Assignment

Implement each pattern in `starter/index.js`. Run with:
```powershell
node phase-5-principal-fullstack/module-17-auth-identity/solution/index.js
```
