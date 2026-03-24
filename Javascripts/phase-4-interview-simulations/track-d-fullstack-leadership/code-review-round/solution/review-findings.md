# Code Review — Complete Issue List (Reference Solution)

## Issue 1: SQL Injection (CRITICAL) — `handleGetUser`, `handleGetProduct`, `handleCreateOrder`

**What:** String interpolation used directly in SQL queries.
```js
// BAD
db.query(`SELECT * FROM users WHERE id = ${userId}`)

// An attacker can send: id = "1 OR 1=1 --"
// Which becomes: SELECT * FROM users WHERE id = 1 OR 1=1 --
```
**Impact:** Full database read/write access for any attacker.

**Fix:** Use parameterized queries:
```js
db.query('SELECT * FROM users WHERE id = ?', [userId])
```

---

## Issue 2: Missing Authorization Check — `handleCreateOrder`

**What:** The handler checks if the user _exists_, but does NOT verify that the authenticated user is the same as `req.body.userId`.
```js
// BAD — any authenticated user can create orders for any userId
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```
**Impact:** Privilege escalation — attacker with any valid auth token can create orders billed to any other user.

**Fix:**
```js
if (req.user.id !== userId) return res.status(403).json({ error: 'Forbidden' });
```

---

## Issue 3: Sensitive Data in Logs — `handleGetUser`

**What:** Full user object is logged including PII (email, address, phone, possibly password hash).
```js
console.log('User looked up:', JSON.stringify(user));
```
**Impact:** PII written to log files, potentially shipped to external log aggregators. GDPR/PCI violation.

**Fix:** Log only a non-sensitive identifier:
```js
console.log('User looked up:', { id: user.id });
```

---

## Issue 4: Unbounded Memory Leak — `productCache`

**What:** `productCache` is a plain object that grows forever. Every product ever looked up is retained in memory.
```js
const productCache = {};  // Never evicted
productCache[productId] = product;  // Grows without bound
```
**Impact:** Memory leak that eventually causes the Node.js process to OOM-crash.

**Fix:** Use an LRU cache with a fixed size and TTL:
```js
const productCache = new LRUCache({ max: 500, ttl: 60_000 });
```

---

## Issue 5: N+1 Query — `handleCreateOrder`

**What:** One DB query fires per item in the order in a `for` loop (serial queries).
```js
for (const item of items) {
  const product = await db.query(`SELECT price FROM products WHERE id = ${item.productId}`);
  total += product.price * item.quantity;
}
```
**Impact:** An order with 20 items fires 20+ sequential queries. At scale this is a performance bottleneck.

**Fix:** Fetch all products in one batch query:
```js
const ids = items.map(i => i.productId);
const products = await db.query('SELECT id, price FROM products WHERE id IN (?)', [ids]);
const priceMap = new Map(products.map(p => [p.id, p.price]));
const total = items.reduce((sum, item) => sum + priceMap.get(item.productId) * item.quantity, 0);
```

---

## Issue 6: Blocking Third-Party Call in Critical Path — `handleCreateOrder`

**What:** Email is sent synchronously inside the order creation handler. If the mail service is slow or down, the order endpoint hangs or fails.
```js
await axios.post('https://mail.internal/send', { ... });
```
**Impact:** Latency and availability of order creation is coupled to the mail service. A mail service outage breaks order creation.

**Fix:** Publish an event to an async queue (fire-and-forget or outbox pattern):
```js
await eventQueue.publish({ type: 'order.created', orderId: order.id, userId });
// Mail handler processes this event independently
```

---

## Issue 7: Path Traversal — `handleUploadAvatar`

**What:** Client-supplied `filename` is used directly in a file path without sanitization.
```js
const path = `/uploads/${filename}`;
fs.writeFileSync(path, ...);
```
**Impact:** An attacker can send `filename: "../../etc/cron.d/malicious"` to write arbitrary files anywhere on the server.

**Fix:** Sanitize filename to basename only and validate extension:
```js
const { basename } = require('path');
const safe = basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
if (!/\.(jpg|png|gif|webp)$/.test(safe)) return res.status(400).json({ error: 'Invalid file type' });
const filePath = `/uploads/${safe}`;
```

---

## Issue 8: Sensitive Data Exposure in Admin Report — `handleAdminReport`

**What:** The "internal-only" claim is enforced by nothing. Any request can reach this handler if the route isn't protected at the router level. Additionally, SSNs and credit card numbers are included in the response.
```js
const report = allUsers.map(u => `${u.name},${u.email},${u.ssn},${u.creditCard}`).join('\n');
```
**Impact:** Complete PII/PCI data breach. Violates PCI-DSS, GDPR, HIPAA.

**Fix:**
1. Require `req.user.role === 'admin'` check
2. Never select sensitive columns (`ssn`, `creditCard`) — apply column-level access control
3. Audit-log every access to this endpoint

---

## Bonus Issue: No Error Handling

**What:** None of the async handlers have `try/catch`. Any DB or network error will be an unhandled rejection, potentially crashing the process.

**Fix:** Wrap each handler in `try/catch` or use an error-handling middleware wrapper:
```js
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
```
