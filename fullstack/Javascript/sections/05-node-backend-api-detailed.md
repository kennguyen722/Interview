# Section 5: Node.js and Backend API Engineering Practical Interviews (Full Detail)

This section focuses on practical backend interview tasks that map directly to production Node.js services.

## Problem 1: Idempotency Key Middleware for Create Endpoints

### Problem statement
Implement middleware that ensures repeated requests with same idempotency key do not create duplicate resources.

### Difficulty
Hard

### Interview expectations
- Correct key scoping and replay behavior.
- Safe handling for in-flight duplicate requests.

### Clarifying questions a strong candidate should ask
- Key scope: per-user/per-route/global?
- TTL duration and persistence store?
- Same key but different payload behavior?

### Brute-force approach
- Ignore duplicates and rely on DB unique constraints only.

### Optimized approach
- Store request fingerprint + response snapshot by key.
- Replay prior response for exact duplicate requests.

### Time and space complexity
- O(1) key lookup, O(1) insert average.

### Clean JavaScript solution
```javascript
function createIdempotencyMiddleware(store) {
  return async function idempotency(req, res, next) {
    const key = req.headers['idempotency-key'];
    if (!key) return next();

    const scope = `${req.method}:${req.path}:${req.user?.id || 'anon'}:${key}`;
    const fingerprint = JSON.stringify(req.body || {});
    const existing = await store.get(scope);

    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        res.status(409).json({ error: 'idempotency key reuse with different payload' });
        return;
      }
      res.status(existing.status).json(existing.body);
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await store.set(scope, {
        fingerprint,
        status: res.statusCode || 200,
        body,
        createdAt: Date.now(),
      });
      return originalJson(body);
    };

    next();
  };
}
```

### Alternative solutions when useful
- DB transaction-backed idempotency table.
- Distributed lock on key for race elimination.

### Edge cases
- Same key concurrent requests.
- Request crashes before response snapshot persists.

### Test cases
- Duplicate same payload returns same response.
- Duplicate different payload returns 409.

### Follow-up questions
- How to expire old keys safely?

### Real-world production relevance
- Payment/order APIs where duplicate writes are unacceptable.

---

## Problem 2: Cursor Pagination Endpoint

### Problem statement
Design and implement cursor-based pagination with stable ordering.

### Difficulty
Medium-Hard

### Interview expectations
- Stable sort key usage.
- Correct next cursor generation.

### Clarifying questions a strong candidate should ask
- Forward-only or bidirectional?
- Cursor signing/encryption needed?

### Brute-force approach
- Offset/limit with mutable data set.

### Optimized approach
- Keyset pagination using `(createdAt, id)` tuple cursor.

### Time and space complexity
- O(pageSize) query with proper index.

### Clean JavaScript solution
```javascript
function encodeCursor(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
}

async function listOrders({ db, pageSize = 20, cursor }) {
  const where = [];
  const params = [];

  if (cursor) {
    const c = decodeCursor(cursor);
    where.push('(created_at < $1 OR (created_at = $1 AND id < $2))');
    params.push(c.createdAt, c.id);
  }

  params.push(pageSize + 1);

  const rows = await db.query(
    `SELECT id, created_at, total
     FROM orders
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY created_at DESC, id DESC
     LIMIT $${params.length}`,
    params
  );

  const hasNext = rows.length > pageSize;
  const page = hasNext ? rows.slice(0, pageSize) : rows;
  const nextCursor = hasNext
    ? encodeCursor({
        createdAt: page[page.length - 1].created_at,
        id: page[page.length - 1].id,
      })
    : null;

  return { items: page, nextCursor };
}
```

### Alternative solutions when useful
- Opaque signed cursor to prevent tampering.

### Edge cases
- Empty result set.
- Deleted rows between requests.

### Test cases
- Ensure no duplicates across page boundaries.

### Follow-up questions
- Add reverse pagination.

### Real-world production relevance
- High-volume feeds and timeline endpoints.

---

## Problem 3: Validation Middleware with Structured Errors

### Problem statement
Validate request payload and return machine-readable error details.

### Difficulty
Medium

### Interview expectations
- Input validation at boundary.
- Consistent error schema.

### Clarifying questions a strong candidate should ask
- Error format standard (RFC7807/custom)?
- Localization requirements?

### Brute-force approach
- Inline manual checks in handlers.

### Optimized approach
- Shared middleware and schema.

### Time and space complexity
- O(fields)

### Clean JavaScript solution
```javascript
function validateCreateUser(req, res, next) {
  const { email, name } = req.body || {};
  const errors = [];

  if (typeof email !== 'string' || !email.includes('@')) {
    errors.push({ field: 'email', code: 'INVALID_EMAIL' });
  }
  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', code: 'INVALID_NAME' });
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'VALIDATION_FAILED',
      details: errors,
    });
    return;
  }

  next();
}
```

### Alternative solutions when useful
- Zod/Joi schema-driven validation.

### Edge cases
- Null body.
- Unexpected extra fields.

### Test cases
- Invalid email and short name both reported.

### Follow-up questions
- Version schema evolution without breaking clients.

### Real-world production relevance
- Reduces incident rate by rejecting bad inputs early.

---

## Problem 4: Token Bucket Rate Limiter Middleware

### Problem statement
Implement per-user/IP token bucket rate limiting.

### Difficulty
Hard

### Interview expectations
- Correct refill math.
- Predictable behavior over time.

### Clarifying questions a strong candidate should ask
- Key by user, API key, or IP?
- Global or per-route limits?

### Brute-force approach
- Fixed window counter.

### Optimized approach
- Token bucket with gradual refill.

### Time and space complexity
- O(1) per request, O(keys) memory.

### Clean JavaScript solution
```javascript
function createTokenBucketLimiter({
  capacity = 20,
  refillPerSec = 5,
  keyFn = (req) => req.user?.id || req.ip,
} = {}) {
  const buckets = new Map();

  return function limiter(req, res, next) {
    const key = keyFn(req);
    const now = Date.now();
    const entry = buckets.get(key) || { tokens: capacity, last: now };

    const elapsed = (now - entry.last) / 1000;
    entry.tokens = Math.min(capacity, entry.tokens + elapsed * refillPerSec);
    entry.last = now;

    if (entry.tokens < 1) {
      buckets.set(key, entry);
      res.status(429).json({ error: 'RATE_LIMITED' });
      return;
    }

    entry.tokens -= 1;
    buckets.set(key, entry);
    next();
  };
}
```

### Alternative solutions when useful
- Redis-backed limiter for multi-instance deployments.

### Edge cases
- Clock drift.
- Bursty traffic after idle period.

### Test cases
- Exceed capacity then recover after refill delay.

### Follow-up questions
- Add route-level overrides and headers (`Retry-After`).

### Real-world production relevance
- Protects APIs from abuse and accidental traffic spikes.

---

## Problem 5: N+1 Query Elimination

### Problem statement
Given endpoint fetching users and each user's latest order separately, remove N+1 query pattern.

### Difficulty
Medium-Hard

### Interview expectations
- Detect anti-pattern quickly.
- Consolidate into join/batch query.

### Clarifying questions a strong candidate should ask
- DB type and indexing?
- Need full order object or summary fields?

### Brute-force approach
- For each user, query latest order.

### Optimized approach
- Batch query and map by userId.

### Time and space complexity
- Before: O(n) queries
- After: O(1) or O(log n) query count depending on shape

### Clean JavaScript solution
```javascript
async function attachLatestOrders(db, users) {
  const userIds = users.map((u) => u.id);
  if (userIds.length === 0) return users;

  const latest = await db.query(
    `SELECT DISTINCT ON (user_id) user_id, id, total, created_at
     FROM orders
     WHERE user_id = ANY($1)
     ORDER BY user_id, created_at DESC`,
    [userIds]
  );

  const byUser = new Map(latest.map((o) => [o.user_id, o]));
  return users.map((u) => ({ ...u, latestOrder: byUser.get(u.id) || null }));
}
```

### Alternative solutions when useful
- DataLoader batching for GraphQL resolvers.

### Edge cases
- Users with no orders.
- Large user set requiring chunking.

### Test cases
- Validate one query instead of N+1 in instrumentation.

### Follow-up questions
- Caching layer for repeated resolver calls.

### Real-world production relevance
- Major latency and DB-load reduction in production APIs.

---

## Problem 6: Error Taxonomy and Safe API Responses

### Problem statement
Design error classes and response mapping to avoid leaking internal details.

### Difficulty
Medium

### Interview expectations
- Separate operational vs programmer errors.
- Stable error response contract.

### Clarifying questions a strong candidate should ask
- Internal vs external error code scheme?
- Correlation ID exposure policy?

### Brute-force approach
- Return raw exception message and stack.

### Optimized approach
- Typed errors + centralized handler.

### Time and space complexity
- O(1)

### Clean JavaScript solution
```javascript
class AppError extends Error {
  constructor(code, status, message, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function errorHandler(err, req, res, next) {
  const traceId = req.headers['x-correlation-id'] || 'unknown';

  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.code,
      message: err.message,
      details: err.details,
      traceId,
    });
    return;
  }

  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Unexpected server error',
    traceId,
  });
}
```

### Alternative solutions when useful
- RFC 7807 Problem Details format.

### Edge cases
- Non-Error throw values.
- Double-send response guard.

### Test cases
- Assert internal errors never leak stack to clients.

### Follow-up questions
- Integrate with structured logging and tracing.

### Real-world production relevance
- Improves operability and client integration stability.

---

## Problem 7: Graceful Shutdown in Node Service

### Problem statement
Implement shutdown flow that:
- stops accepting new traffic
- drains in-flight requests
- closes DB and external clients safely

### Difficulty
Hard

### Interview expectations
- Signal handling and deadline-based shutdown.
- Avoid request drops and data corruption.

### Clarifying questions a strong candidate should ask
- Shutdown timeout budget?
- Kubernetes readiness/liveness interplay?

### Brute-force approach
- `process.exit(0)` on signal.

### Optimized approach
- Server close, mark unready, drain, cleanup resources.

### Time and space complexity
- O(in-flight requests)

### Clean JavaScript solution
```javascript
function setupGracefulShutdown({ server, closeResources, timeoutMs = 10000 }) {
  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}, shutting down...`);

    const timeout = setTimeout(() => {
      console.error('Forced shutdown');
      process.exit(1);
    }, timeoutMs);

    server.close(async () => {
      try {
        await closeResources();
        clearTimeout(timeout);
        process.exit(0);
      } catch {
        clearTimeout(timeout);
        process.exit(1);
      }
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
```

### Alternative solutions when useful
- Track active requests and reject new requests with 503 + Retry-After.

### Edge cases
- Multiple signals.
- Hung connection never completes.

### Test cases
- Integration test with open request during shutdown.

### Follow-up questions
- Zero-downtime deployment strategy.

### Real-world production relevance
- Mandatory for stable rolling deploys.

---

## Problem 8: API Versioning Strategy and Compatibility Guard

### Problem statement
Design route/version handler supporting evolution without breaking old clients.

### Difficulty
Medium-Hard

### Interview expectations
- Explain compatibility policy.
- Demonstrate deprecation path.

### Clarifying questions a strong candidate should ask
- URI versioning or header versioning?
- Sunset timeline and observability requirements?

### Brute-force approach
- Breaking changes in place.

### Optimized approach
- Explicit version contract and migration plan.

### Time and space complexity
- O(1) routing overhead.

### Clean JavaScript solution
```javascript
function versionGate(req, res, next) {
  const version = req.headers['x-api-version'] || '1';
  if (!['1', '2'].includes(version)) {
    res.status(400).json({ error: 'UNSUPPORTED_VERSION' });
    return;
  }
  req.apiVersion = version;
  next();
}

function getUserHandler(req, res) {
  if (req.apiVersion === '1') {
    res.json({ id: 'u1', fullName: 'Ada Lovelace' });
    return;
  }

  res.json({ id: 'u1', firstName: 'Ada', lastName: 'Lovelace' });
}
```

### Alternative solutions when useful
- Media-type versioning.
- Consumer-driven contract testing.

### Edge cases
- Partial rollout of new fields.
- Old clients ignoring unknown fields.

### Test cases
- Verify schema response differs by version but remains valid.

### Follow-up questions
- Automated deprecation communication and usage tracking.

### Real-world production relevance
- Critical for multi-client ecosystems and gradual migrations.

---

## Section 5 Mock Interview Drill

1. Implement idempotency middleware and defend race-handling strategy.
2. Build cursor pagination endpoint and prove no duplicates between pages.
3. Diagnose N+1 pattern and provide SQL rewrite.
4. Explain graceful shutdown sequence in Kubernetes deployment.

## Section 5 Exit Criteria

- You can implement backend primitives with production-safe behavior.
- You can discuss reliability, security, and operability tradeoffs clearly.
- Your solutions are clean, testable, and easy to maintain.
