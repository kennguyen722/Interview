'use strict';
// Track D — Code Review Round: FIXED VERSION
// All 8+ issues from code-under-review.js have been corrected.

const { basename } = require('path');

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Wrap async handlers: unhandled errors go to Express error middleware
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// ─── Bounded LRU Cache (simple TTL map) ───────────────────────────────────────
function createBoundedCache({ maxSize = 500, ttlMs = 60_000 } = {}) {
  const cache = new Map();
  function set(key, value) {
    if (cache.size >= maxSize) {
      // Evict oldest entry
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  function get(key) {
    const entry = cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) { cache.delete(key); return undefined; }
    return entry.value;
  }
  return { set, get };
}

const productCache = createBoundedCache({ maxSize: 500, ttlMs: 60_000 });

// ─── Fix 1+3: Parameterized queries + no PII in logs ─────────────────────────
const handleGetUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // FIX 1: Use parameterized query to prevent SQL injection
  const user = await req.db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);

  if (!user) return res.status(404).json({ error: 'Not found' });

  // FIX 3: Log only non-sensitive identifier, never the full user object
  console.log('User looked up:', { id: user.id });

  return res.json(user);
});

// ─── Fix 1+4: Parameterized queries + bounded LRU cache ──────────────────────
const handleGetProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // FIX 4: Use bounded cache with TTL
  const cached = productCache.get(productId);
  if (cached) return res.json(cached);

  // FIX 1: Parameterized query
  const product = await req.db.query('SELECT * FROM products WHERE id = ?', [productId]);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  productCache.set(productId, product);
  return res.json(product);
});

// ─── Fix 1+2+5+6: Auth check + batch query + async email ─────────────────────
const handleCreateOrder = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;

  // FIX 2: Verify caller owns the userId (no privilege escalation)
  if (!req.user || req.user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden: cannot create order for another user' });
  }

  // FIX 1: Parameterized query
  const user = await req.db.query('SELECT id, email FROM users WHERE id = ?', [userId]);
  if (!user) return res.status(400).json({ error: 'Invalid user' });

  // FIX 5: Batch query instead of N+1 loop
  const productIds = items.map(i => i.productId);
  const products   = await req.db.query('SELECT id, price FROM products WHERE id IN (?)', [productIds]);
  const priceMap   = new Map(products.map(p => [String(p.id), p.price]));

  let total = 0;
  for (const item of items) {
    const price = priceMap.get(String(item.productId));
    if (!price) return res.status(400).json({ error: `Unknown product: ${item.productId}` });
    total += price * item.quantity;
  }

  // FIX 1: Parameterized INSERT
  const order = await req.db.query(
    'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
    [userId, total, 'pending']
  );

  // FIX 6: Fire email asynchronously via event queue — never block the response
  req.eventQueue.publish({ type: 'order.created', orderId: order.id, userId, email: user.email, total })
    .catch(err => console.error('Event publish failed:', { orderId: order.id, err: err.message }));

  return res.json({ orderId: order.id, total });
});

// ─── Fix 7: Path traversal + file type validation ────────────────────────────
const handleUploadAvatar = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const rawFilename = req.body.filename || '';

  // FIX 7: Extract only the basename; reject path traversal attempts
  const safe = basename(rawFilename).replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(safe)) {
    return res.status(400).json({ error: 'Only image files are allowed (jpg, png, gif, webp)' });
  }

  const uploadPath = `/uploads/${safe}`;
  require('fs').writeFileSync(uploadPath, Buffer.from(data, 'base64'));
  return res.json({ path: uploadPath });
});

// ─── Fix 8: Auth check + no sensitive fields in report ───────────────────────
const handleAdminReport = asyncHandler(async (req, res) => {
  // FIX 8: Explicit authorization check — never rely on route-level "security by obscurity"
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // FIX 8: Never SELECT sensitive columns (ssn, creditCard) — use explicit safe columns
  const allUsers = await req.db.query('SELECT id, name, email, role, created_at FROM users');

  // Audit log
  console.log('Admin report accessed:', { by: req.user.id, at: new Date().toISOString(), rowCount: allUsers.length });

  const csv = ['id,name,email,role,created_at',
    ...allUsers.map(u => `${u.id},${u.name},${u.email},${u.role},${u.created_at}`)
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  return res.send(csv);
});

module.exports = { handleGetUser, handleGetProduct, handleCreateOrder, handleUploadAvatar, handleAdminReport };
