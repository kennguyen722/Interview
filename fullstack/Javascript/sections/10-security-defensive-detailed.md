# Section 10: Security and Defensive Engineering (Full Detail)

## Problem 1: Find and Fix SQL Injection
### Problem statement
Refactor unsafe SQL string interpolation in login endpoint.
### Difficulty
Medium-Hard
### Interview expectations
- Identify exploit path quickly.
- Use parameterized queries.
### Clarifying questions a strong candidate should ask
- ORM/query builder available?
- Need audit logging for attempts?
### Brute-force approach
Manual input sanitization via regex.
### Optimized approach
Parameterized query always; never interpolate user input.
### Time and space complexity
O(1) query construction.
### Clean JavaScript solution
```javascript
async function findUserByEmail(db, email) {
  return db.oneOrNone('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
}
```
Explanation: positional parameters force the database driver to treat input as data, preventing SQL control-flow injection.
### Alternative solutions when useful
Prepared statements and least-privilege DB role.
### Edge cases
Unicode payloads and comment-based injection attempts.
### Test cases
Injection payload does not alter query semantics.
### Follow-up questions
How to detect attempted injection in telemetry?
### Real-world production relevance
Prevents account compromise and data exfiltration.

---

## Problem 2: JWT Verification with Key Rotation
### Problem statement
Implement JWT verify flow supporting active and previous keys during rotation.
### Difficulty
Hard
### Interview expectations
- Signature verification and claim checks.
- Safe key lookup by kid.
### Clarifying questions a strong candidate should ask
- HMAC or RSA?
- Clock skew tolerance?
### Brute-force approach
Single hardcoded key forever.
### Optimized approach
Key ring with kid and rotation window.
### Time and space complexity
O(1) key lookup.
### Clean JavaScript solution
```javascript
function verifyJwtHeader(header, keyStore) {
  const key = keyStore.get(header.kid);
  if (!key) throw new Error('UNKNOWN_KID');
  return key;
}
```
Explanation: selecting verification keys by `kid` supports safe key rotation windows without hardcoding a single active secret.
### Alternative solutions when useful
JWKS endpoint with caching.
### Edge cases
Expired token, invalid aud/iss, unknown kid.
### Test cases
Token signed with previous key still valid during grace period.
### Follow-up questions
How to revoke compromised key immediately?
### Real-world production relevance
Core identity hardening for distributed services.

---

## Problem 3: CSRF Protection for Session-based App
### Problem statement
Protect mutating routes from CSRF.
### Difficulty
Medium
### Interview expectations
- SameSite + anti-CSRF token strategy.
### Clarifying questions a strong candidate should ask
- Cookie vs token auth model?
- Cross-site embed requirements?
### Brute-force approach
Check only Referer header.
### Optimized approach
Synchronizer token pattern and SameSite cookies.
### Time and space complexity
O(1).
### Clean JavaScript solution
```javascript
function verifyCsrf(req, res, next) {
  const csrfCookie = req.cookies.csrf;
  const csrfHeader = req.headers['x-csrf-token'];
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    res.status(403).json({ error: 'CSRF_INVALID' });
    return;
  }
  next();
}
```
Explanation: matching a cookie token and header token ensures forged cross-site requests cannot satisfy both values.
### Alternative solutions when useful
Double-submit cookie or Origin checks as secondary guard.
### Edge cases
Token missing on multipart forms.
### Test cases
Cross-site forged request rejected.
### Follow-up questions
How to support SPA + mobile clients consistently?
### Real-world production relevance
Required for session-cookie web apps.

---

## Problem 4: XSS-safe Rendering in Frontend
### Problem statement
Render user-generated content without introducing XSS.
### Difficulty
Medium
### Interview expectations
- Avoid dangerous sinks and sanitize where needed.
### Clarifying questions a strong candidate should ask
- Rich text allowed?
- CSP policy available?
### Brute-force approach
Set innerHTML directly.
### Optimized approach
Use textContent/default escaping and sanitizer for rich HTML.
### Time and space complexity
O(n) by content size.
### Clean JavaScript solution
```javascript
function renderSafeText(el, text) {
  el.textContent = text;
}
```
Explanation: `textContent` renders user input as literal text instead of executable markup, blocking script injection.
### Alternative solutions when useful
DOMPurify for rich content.
### Edge cases
Encoded payload and script URL vectors.
### Test cases
Injected script tags render as text, not executable code.
### Follow-up questions
How does CSP reduce blast radius?
### Real-world production relevance
Prevents account/session hijack via stored XSS.

---

## Problem 5: Secrets Management and Rotation Plan
### Problem statement
Design secure secret handling for Node services.
### Difficulty
Principal-level
### Interview expectations
- No hardcoded secrets, rotation without downtime.
### Clarifying questions a strong candidate should ask
- Secret manager in use?
- Rotation cadence and break-glass process?
### Brute-force approach
Long-lived env secret never rotated.
### Optimized approach
Central secret manager + rolling reload.
### Time and space complexity
Not applicable (security operations exercise).
### Clean JavaScript solution
```javascript
async function createSecretProvider({ manager, refreshMs = 300000 }) {
  let cache = await manager.fetchAll();
  let lastGood = cache;

  setInterval(async () => {
    try {
      cache = await manager.fetchAll();
      lastGood = cache;
    } catch {
      cache = lastGood;
    }
  }, refreshMs).unref?.();

  return {
    get(name) {
      const value = cache[name];
      if (!value) throw new Error(`SECRET_NOT_FOUND:${name}`);
      return value;
    },
  };
}
```

Explanation: this pattern supports non-disruptive rotation while preserving a last-known-good fallback during secret manager outages.
### Alternative solutions when useful
Sidecar secret injection.
### Edge cases
Secret fetch outage.
### Test cases
Rotate key without auth downtime.
### Follow-up questions
How to audit secret access?
### Real-world production relevance
Reduces breach impact and compliance risk.

---

## Problem 6: Security Code Review Checklist
### Problem statement
Create checklist for PR reviews on critical APIs.
### Difficulty
Principal-level
### Interview expectations
- Systematic and reusable rubric.
### Clarifying questions a strong candidate should ask
- Which threat model applies?
### Brute-force approach
Ad hoc reviewer intuition.
### Optimized approach
Checklist covering authn/authz, input validation, injection, logging, secrets.
### Time and space complexity
Not applicable (review policy exercise).
### Clean JavaScript solution
```javascript
const criticalChecklist = [
  'authn-authz-validated',
  'input-validation-boundary',
  'injection-safe-queries',
  'secrets-not-hardcoded',
  'pii-redaction-logs',
];

function evaluateSecurityReview(checkState) {
  const missing = criticalChecklist.filter((item) => !checkState[item]);
  return {
    pass: missing.length === 0,
    missing,
  };
}
```

Explanation: codifying mandatory controls as machine-checkable criteria makes security review repeatable and measurable.
### Alternative solutions when useful
Automated static checks + manual threat review.
### Edge cases
False confidence from checklist-only process.
### Test cases
Pilot checklist on recent incident-prone code.
### Follow-up questions
How to measure checklist effectiveness over time?
### Real-world production relevance
Raises engineering security baseline at org scale.

---

## Section 10 Exit Criteria
- You can identify and fix common web/API vulnerabilities with production-safe controls.
