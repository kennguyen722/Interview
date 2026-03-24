'use strict';
// Module 15: Full Stack Integration Patterns — Reference Solution

// ─── 1. BFF (Backend for Frontend) Aggregator ────────────────────────────────
function createBFF(services) {
  return {
    async aggregate(userId) {
      const [user, orders] = await Promise.all([
        services.users.get(userId),
        services.orders.listByUser(userId)
      ]);
      if (!user) throw new Error(`User ${userId} not found`);
      return {
        user,
        recentOrders: orders.slice(0, 5),
        totalOrders: orders.length
      };
    }
  };
}

// ─── 2. GraphQL-style Resolver Execution ─────────────────────────────────────
async function executeQuery(schema, query, context) {
  const entries = Object.entries(query);
  const results = await Promise.allSettled(
    entries.map(([fieldName, args]) => {
      if (typeof schema[fieldName] !== 'function')
        return Promise.reject(new Error(`No resolver for field: ${fieldName}`));
      return schema[fieldName](args, context);
    })
  );

  const data = {};
  const errors = [];

  for (let i = 0; i < entries.length; i++) {
    const [fieldName] = entries[i];
    const result = results[i];
    if (result.status === 'fulfilled') {
      data[fieldName] = result.value;
    } else {
      data[fieldName] = null;
      errors.push({ field: fieldName, message: result.reason.message });
    }
  }

  return { data, errors };
}

// ─── 3. DataLoader: Batched N+1 Query Elimination ────────────────────────────
function createDataLoader(batchFn) {
  const cache = new Map();
  let batch = [];
  let scheduled = false;

  function dispatch() {
    const currentBatch = batch;
    batch = [];
    scheduled = false;

    const keys = currentBatch.map(item => item.key);
    Promise.resolve(batchFn(keys)).then(results => {
      currentBatch.forEach((item, i) => item.resolve(results[i]));
    }).catch(err => {
      currentBatch.forEach(item => item.reject(err));
    });
  }

  function load(key) {
    if (cache.has(key)) return cache.get(key);

    const promise = new Promise((resolve, reject) => {
      batch.push({ key, resolve, reject });
      if (!scheduled) {
        scheduled = true;
        Promise.resolve().then(dispatch);
      }
    });

    cache.set(key, promise);
    return promise;
  }

  function clearCache() { cache.clear(); }

  return { load, clearCache };
}

// ─── 4. API Versioning Middleware ─────────────────────────────────────────────
function createVersionRouter(handlers) {
  const versions = ['v1', 'v2', 'v3'];

  return {
    dispatch(version, method, path, body, context) {
      const routeKey = `${method.toUpperCase()} ${path}`;
      // Try exact version first, then fall back through lower versions
      const versionIndex = versions.indexOf(version);
      for (let i = versionIndex; i >= 0; i--) {
        const v = versions[i];
        if (handlers[v]?.[routeKey]) {
          return handlers[v][routeKey](body, context);
        }
      }
      return { status: 404, body: { error: `No handler for ${routeKey} at ${version}` } };
    }
  };
}

// ─── 5. SSR Cache with Hydration Data ────────────────────────────────────────
function createSSRCache({ ttlMs = 30_000 } = {}) {
  const store = new Map();

  function set(route, html, initialData) {
    store.set(route, { html, initialData, ts: Date.now() });
  }

  function get(route) {
    const entry = store.get(route);
    if (!entry) return null;
    if (Date.now() - entry.ts > ttlMs) { store.delete(route); return null; }
    return {
      html: entry.html,
      initialData: entry.initialData,
      hydrationScript: `<script>window.__INITIAL_DATA__=${JSON.stringify(entry.initialData)}</script>`
    };
  }

  function invalidate(route) { store.delete(route); }
  function size() { return store.size; }

  return { set, get, invalidate, size };
}

// ─── 6. Feature Flags Service ─────────────────────────────────────────────────
// Simple deterministic hash (djb2 variant) — no crypto dependency
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0; // Force 32-bit int
  }
  return Math.abs(hash);
}

function createFeatureFlags(config) {
  return {
    isEnabled(flagName, userId) {
      const rollout = config[flagName];
      if (rollout === undefined) return false;
      if (rollout >= 100) return true;
      if (rollout <= 0) return false;
      const bucket = hashString(`${flagName}:${userId}`) % 100;
      return bucket < rollout;
    },
    getConfig: () => ({ ...config })
  };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    // BFF
    const bff = createBFF({
      users:  { get: async id => ({ id, name: 'Alice' }) },
      orders: { listByUser: async () => [1, 2, 3, 4, 5, 6].map(i => ({ id: i })) }
    });
    const agg = await bff.aggregate('u1');
    console.log('BFF: user=', agg.user.name, 'recentOrders=', agg.recentOrders.length, 'total=', agg.totalOrders);

    // GraphQL resolver
    const schema = {
      user: (args) => ({ id: args.id, name: 'Bob' }),
      missingField: null
    };
    const result = await executeQuery(schema, { user: { id: '42' }, nonexistent: {} }, {});
    console.log('GraphQL data:', result.data.user?.name, '| errors:', result.errors.length);

    // DataLoader
    let batchCalls = 0;
    const loader = createDataLoader(async (ids) => { batchCalls++; return ids.map(id => `user_${id}`); });
    const [a, b, c] = await Promise.all([loader.load(1), loader.load(2), loader.load(3)]);
    console.log(`DataLoader: ${a}, ${b}, ${c} — batch calls: ${batchCalls} (expected 1)`);

    // SSR Cache
    const ssrCache = createSSRCache({ ttlMs: 1000 });
    ssrCache.set('/home', '<html>...</html>', { userId: 'u1' });
    const cached = ssrCache.get('/home');
    console.log('SSR hydration script present:', cached?.hydrationScript?.includes('__INITIAL_DATA__'));

    // Feature Flags
    const flags = createFeatureFlags({ 'new-checkout': 50, 'dark-mode': 100, 'beta': 0 });
    const enabledCount = ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10']
      .filter(uid => flags.isEnabled('new-checkout', uid)).length;
    console.log(`Feature flag 'new-checkout': ~${enabledCount}/10 enabled (expect ~5)`);
    console.log('dark-mode always on:', flags.isEnabled('dark-mode', 'anyone'));
    console.log('beta always off:', flags.isEnabled('beta', 'anyone'));
  })();
}

module.exports = { createBFF, executeQuery, createDataLoader, createVersionRouter, createSSRCache, createFeatureFlags };
