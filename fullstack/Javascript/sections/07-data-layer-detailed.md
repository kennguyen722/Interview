# Section 7: Data Layer and Persistence Design (Full Detail)

## Problem 1: Repository Pattern with Transaction Boundary
### Problem statement
Implement service method creating user + audit record atomically.
### Difficulty
Hard
### Interview expectations
- Clear separation of domain/service/repository.
- Transaction correctness.
### Clarifying questions a strong candidate should ask
- Isolation level requirements?
- Retry policy on deadlock?
### Brute-force approach
Two independent writes without transaction.
### Optimized approach
Unit-of-work transaction wrapper.
### Time and space complexity
O(1) repository calls.
### Clean JavaScript solution
```javascript
async function createUserWithAudit({ db, user }) {
  return db.transaction(async (tx) => {
    const created = await tx.users.insert(user);
    await tx.audit.insert({ type: 'USER_CREATED', userId: created.id });
    return created;
  });
}
```
### Alternative solutions when useful
Outbox pattern for async audit/event publishing.
### Edge cases
Second write fails after first succeeds.
### Test cases
Rollback occurs when audit insert fails.
### Follow-up questions
How to make this idempotent with retry?
### Real-world production relevance
Core pattern for consistency-critical workflows.

---

## Problem 2: N+1 Elimination in Relational Query
### Problem statement
Refactor user-list endpoint that fetches orders per user.
### Difficulty
Medium-Hard
### Interview expectations
- Batch query or join strategy.
- Index-aware design.
### Clarifying questions a strong candidate should ask
- Which fields required from orders?
- DB engine and EXPLAIN support?
### Brute-force approach
Loop users and query orders each time.
### Optimized approach
Single join/batch query and in-memory map.
### Time and space complexity
Time O(n) rows; query count reduced to O(1).
### Clean JavaScript solution
```javascript
async function fetchUsersWithOrderCount(db) {
  return db.query(`
    SELECT u.id, u.email, COALESCE(o.cnt, 0) AS order_count
    FROM users u
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS cnt
      FROM orders
      GROUP BY user_id
    ) o ON o.user_id = u.id
  `);
}
```
### Alternative solutions when useful
Materialized view for heavy read paths.
### Edge cases
Users without orders.
### Test cases
Verify row counts and query count instrumentation.
### Follow-up questions
How to cache this safely?
### Real-world production relevance
Frequent performance bottleneck in CRUD-heavy systems.

---

## Problem 3: Cursor Pagination with Composite Key
### Problem statement
Implement keyset pagination for high-write table.
### Difficulty
Hard
### Interview expectations
- Stable ordering and no duplicate/skip.
### Clarifying questions a strong candidate should ask
- Sort key uniqueness strategy?
- Forward-only or backward pagination?
### Brute-force approach
Offset/limit.
### Optimized approach
Composite cursor (createdAt,id).
### Time and space complexity
O(page size) with proper index.
### Clean JavaScript solution
```javascript
function encodeCursor(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
}

async function listOrdersPage(db, { pageSize = 20, cursor = null }) {
  const params = [];
  let where = '';

  if (cursor) {
    const c = decodeCursor(cursor);
    params.push(c.createdAt, c.id);
    where = 'WHERE (created_at < $1 OR (created_at = $1 AND id < $2))';
  }

  params.push(pageSize + 1);

  const rows = await db.query(
    `SELECT id, created_at, total
     FROM orders
     ${where}
     ORDER BY created_at DESC, id DESC
     LIMIT $${params.length}`,
    params
  );

  const hasNext = rows.length > pageSize;
  const items = hasNext ? rows.slice(0, pageSize) : rows;
  const nextCursor = hasNext
    ? encodeCursor({
        createdAt: items[items.length - 1].created_at,
        id: items[items.length - 1].id,
      })
    : null;

  return { items, nextCursor };
}
```

Explanation: composite ordering by `(created_at, id)` prevents duplicates and skips when new rows are inserted between page requests.
### Alternative solutions when useful
Seek pagination by monotonic ID when available.
### Edge cases
Rows inserted between pages.
### Test cases
No duplicate across consecutive pages.
### Follow-up questions
How to paginate deterministic snapshots?
### Real-world production relevance
Scalable API pagination under concurrent writes.

---

## Problem 4: Migration Runner with Idempotency
### Problem statement
Design migration system that applies scripts exactly once.
### Difficulty
Medium-Hard
### Interview expectations
- Ordered execution and metadata table.
- Safe retries.
### Clarifying questions a strong candidate should ask
- Rollback policy?
- Zero-downtime migration constraints?
### Brute-force approach
Run SQL scripts manually.
### Optimized approach
Track applied migrations table and checksum.
### Time and space complexity
O(m) migrations.
### Clean JavaScript solution
```javascript
async function runMigrations({ db, files }) {
  await db.query('CREATE TABLE IF NOT EXISTS migrations(name text primary key, applied_at timestamptz not null)');
  for (const file of files) {
    const applied = await db.oneOrNone('SELECT name FROM migrations WHERE name=$1', [file.name]);
    if (applied) continue;
    await db.transaction(async (tx) => {
      await tx.query(file.sql);
      await tx.query('INSERT INTO migrations(name, applied_at) VALUES($1, NOW())', [file.name]);
    });
  }
}
```
### Alternative solutions when useful
Liquibase/Flyway style checksum validation.
### Edge cases
Partially failed migration.
### Test cases
Re-running runner is no-op for applied files.
### Follow-up questions
How to backfill large columns safely?
### Real-world production relevance
Critical for reliable schema evolution.

---

## Problem 5: Connection Pool Exhaustion Guard
### Problem statement
Prevent service collapse when DB pool saturates.
### Difficulty
Medium
### Interview expectations
- Backpressure and timeout policy.
### Clarifying questions a strong candidate should ask
- Max pool size and queue size?
- Shed load behavior?
### Brute-force approach
Unlimited wait for DB connection.
### Optimized approach
Acquire timeout + fail fast + fallback.
### Time and space complexity
O(1) per acquisition attempt.
### Clean JavaScript solution
```javascript
async function withDbTimeout(pool, fn, timeoutMs = 200) {
  const client = await Promise.race([
    pool.connect(),
    new Promise((_, rej) => setTimeout(() => rej(new Error('DB_ACQUIRE_TIMEOUT')), timeoutMs)),
  ]);
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
```
### Alternative solutions when useful
Circuit-break DB path under saturation.
### Edge cases
Connection leaked on exception.
### Test cases
Acquire timeout triggers controlled 503 path.
### Follow-up questions
How to size pool per instance?
### Real-world production relevance
Protects latency and prevents cascading failures.

---

## Problem 6: Multi-tenant Data Isolation Guard
### Problem statement
Ensure every query is scoped by tenant id.
### Difficulty
Hard
### Interview expectations
- Prevent cross-tenant data leaks.
### Clarifying questions a strong candidate should ask
- Shared DB/schema or separate DB?
- RLS availability?
### Brute-force approach
Remember to add tenant filter manually everywhere.
### Optimized approach
Repository guard or database row-level security.
### Time and space complexity
O(1) extra predicate cost.
### Clean JavaScript solution
```javascript
function tenantScopedRepo(db, tenantId) {
  return {
    findOrderById: (id) => db.oneOrNone('SELECT * FROM orders WHERE id=$1 AND tenant_id=$2', [id, tenantId]),
  };
}
```
### Alternative solutions when useful
Postgres RLS with session variable tenant context.
### Edge cases
Background jobs lacking tenant context.
### Test cases
Cross-tenant access attempt returns empty/forbidden.
### Follow-up questions
How to enforce tenant isolation in analytics pipelines?
### Real-world production relevance
Mandatory for SaaS security and compliance.

---

## Section 7 Exit Criteria
- You can design transaction-safe, scalable, and tenant-safe persistence patterns.
