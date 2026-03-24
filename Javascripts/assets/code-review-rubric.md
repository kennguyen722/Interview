# Code Review Rubric — Principal / Staff Level

Use this rubric when evaluating code in Track D Round 1. Score each category 0–2.

---

## Scoring Categories (10 points total)

### 1. Security (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Misses critical vulnerabilities (SQL injection, unescaped user input, missing auth) |
| 1 | Identifies obvious issues but misses subtle ones (race condition, path traversal) |
| 2 | Finds all issues AND explains their impact + exploit scenario + specific fix |

**What to look for:**
- [ ] SQL/command injection via string concatenation
- [ ] Missing authentication or authorization checks
- [ ] Sensitive data (passwords, PII, tokens) in logs or error responses
- [ ] Path traversal (`../../etc/passwd` via `req.params.filename`)
- [ ] Unvalidated or unsanitized input reaching downstream systems
- [ ] Insecure direct object reference (user can access other users' data)
- [ ] Missing rate limiting on auth endpoints
- [ ] Hardcoded secrets or credentials

---

### 2. Correctness & Edge Cases (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Only notices obvious bugs; misses race conditions or async issues |
| 1 | Finds most functional bugs but misses concurrency or error handling gaps |
| 2 | Identifies edge cases, async pitfalls, off-by-one errors, and error propagation issues |

**What to look for:**
- [ ] Unhandled Promises (`.catch()` missing or swallowed)
- [ ] Race conditions in concurrent code (non-atomic read-modify-write)
- [ ] Missing null/undefined checks before property access
- [ ] Off-by-one errors in pagination, slicing, loop bounds
- [ ] Error messages leaking internal implementation details to clients
- [ ] Incorrect status codes (e.g., 200 instead of 201 on create)

---

### 3. Performance & Scalability (0–2)

| Score | Criteria |
|-------|----------|
| 0 | No performance observations |
- | 1 | Identifies obvious inefficiencies (N+1 queries, synchronous blocking) |
| 2 | Explains *why* each issue is a problem at scale + quantifies the impact |

**What to look for:**
- [ ] N+1 queries inside a loop (use batching/joins instead)
- [ ] Synchronous/blocking operations on the event loop (crypto, fs.readFileSync)
- [ ] Unbounded in-memory caches (memory leak — must set maxSize or TTL)
- [ ] Missing pagination on list endpoints (can return millions of rows)
- [ ] Missing database indexes for frequently queried columns
- [ ] Tight polling instead of events/WebSockets
- [ ] Missing response compression for large payloads

---

### 4. Maintainability & Design (0–2)

| Score | Criteria |
|-------|----------|
| 0 | No observations about code structure or design |
| 1 | Notes readability issues but not design-level concerns |
| 2 | Identifies single-responsibility violations, missing abstractions, and proposes specific refactors |

**What to look for:**
- [ ] Functions doing too many things (should have one clear responsibility)
- [ ] Magic numbers/strings without named constants
- [ ] Deep nesting (callback hell, complex conditionals — extract to named functions)
- [ ] Module coupling (business logic mixed with HTTP/DB concerns)
- [ ] Missing error types (generic `Error` thrown everywhere vs. typed domain errors)
- [ ] Repeated code that should be a shared utility
- [ ] Unclear variable names (`data`, `result`, `temp`)

---

### 5. Testing & Observability (0–2)

| Score | Criteria |
|-------|----------|
| 0 | No comments about testability or observability |
| 1 | Notes code is untestable but not why |
| 2 | Identifies specific testability blockers + suggests fixes; notes missing observability |

**What to look for:**
- [ ] External dependencies not injectable (can't swap DB/email in tests)
- [ ] Missing error logging (silent catch blocks — bugs disappear)
- [ ] PII or secrets logged (GDPR/security violation)
- [ ] No structured logging (plain strings instead of JSON with context fields)
- [ ] No request tracing (no correlation ID for distributed debugging)
- [ ] Critical paths have no metrics (can't detect degradation)

---

## Total Score Interpretation

| Score | Level |
|-------|-------|
| 9–10 | Exceptional — principal-level insight across all dimensions |
| 7–8 | Strong — ready for senior/principal role |
| 5–6 | Adequate — senior-level, needs growth in security/performance |
| 3–4 | Developing — misses systemic issues |
| 0–2 | Needs significant growth |

---

## How to Structure Your Review Findings

Use this template for each issue found:

```
## Issue: [short title]
**Category:** Security | Correctness | Performance | Maintainability | Observability
**Severity:** Critical | High | Medium | Low
**Location:** [file:line or function name]

**Problem:**
[1-2 sentences describing what is wrong]

**Impact:**
[What goes wrong in production — data breach, outage, slow query, etc.]

**Fix:**
[Concrete code change or approach]
```

---

## Red Flags (Automatic Disqualifiers at Principal Level)

1. Missing a SQL injection vulnerability
2. Approving code that stores plaintext passwords
3. Approving code that logs passwords or PII
4. Not flagging an unauthenticated admin endpoint
5. Claiming an N+1 query "won't matter in practice" without evidence
