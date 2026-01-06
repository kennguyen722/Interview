// ============================================================================
// LESSON 31: PERFORMANCE ANALYSIS - SOLUTION
// ============================================================================

/**
 * SOLUTION 1: Performance Measurement Helper
 */

function measurePerformance<T>(
  label: string,
  fn: () => T,
  iterations = 1
): { result: T; duration: number; opsPerSec: number } {
  const start = performance.now();

  let result: T;
  for (let i = 0; i < iterations; i++) {
    result = fn();
  }

  const end = performance.now();
  const duration = end - start;
  const opsPerSec = Math.round((iterations / duration) * 1000);

  console.log(`${label}: ${duration.toFixed(2)}ms (${opsPerSec.toLocaleString()} ops/sec)`);

  return { result: result!, duration, opsPerSec };
}

// Compare slow vs fast fibonacci
function fibonacci_Slow(n: number): number {
  if (n <= 1) return n;
  return fibonacci_Slow(n - 1) + fibonacci_Slow(n - 2);
}

function fibonacci_Fast(n: number, memo: Record<number, number> = {}): number {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci_Fast(n - 1, memo) + fibonacci_Fast(n - 2, memo);
  return memo[n];
}

console.log("=== SOLUTION 1: PERFORMANCE MEASUREMENT ===");
measurePerformance("fibonacci(10) Slow", () => fibonacci_Slow(10));
measurePerformance("fibonacci(10) Fast", () => fibonacci_Fast(10));
measurePerformance("fibonacci(35) Fast", () => fibonacci_Fast(35));
// fibonacci(35) Slow would take several seconds!

/**
 * SOLUTION 2: Memory Profiling
 */

function getMemoryUsage(): { heapUsed: number; heapTotal: number } {
  const mem = process.memoryUsage();
  return {
    heapUsed: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
    heapTotal: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
  };
}

console.log("\n=== SOLUTION 2: MEMORY PROFILING ===");

const before = getMemoryUsage();
const largeArray = Array.from({ length: 100000 }, (_, i) => i);
const afterArray = getMemoryUsage();

console.log(
  `Array (100K items): ${(afterArray.heapUsed - before.heapUsed).toFixed(2)}MB allocated`
);

function* numberGenerator(limit: number) {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}

const gen = numberGenerator(100000);
const afterGen = getMemoryUsage();

console.log(
  `Generator (100K items): ${(afterGen.heapUsed - afterArray.heapUsed).toFixed(2)}MB allocated`
);
console.log("Generator is much more memory efficient!");

/**
 * SOLUTION 3: Bottleneck Detection
 */

console.log("\n=== SOLUTION 3: BOTTLENECK IDENTIFICATION ===");

async function processLargeDataset_Slow(ids: string[]): Promise<string[]> {
  const results: string[] = [];

  console.time("Sequential Processing");

  // Processing one at a time - SLOW
  for (const id of ids) {
    const data = await simulateFetch(id);
    const processed = processData(data);
    const validated = await simulateValidation(processed);
    results.push(validated);
  }

  console.timeEnd("Sequential Processing");
  return results;
}

async function processLargeDataset_Fast(ids: string[]): Promise<string[]> {
  console.time("Parallel Processing");

  // Use Promise.all for parallel requests
  const results = await Promise.all(
    ids.map(async (id) => {
      const data = await simulateFetch(id);
      const processed = processData(data);
      return simulateValidation(processed);
    })
  );

  console.timeEnd("Parallel Processing");
  return results;
}

async function simulateFetch(id: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`data-${id}`), 100));
}

function processData(data: string): string {
  return `processed-${data}`;
}

async function simulateValidation(data: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`validated-${data}`), 50));
}

// Test with small dataset
processLargeDataset_Fast(["1", "2", "3"]).then((results) => {
  console.log(`Processed ${results.length} items`);
});

/**
 * SOLUTION 4: LRU Cache
 */

console.log("\n=== SOLUTION 4: LRU CACHE ===");

class LRUCache<K, V> {
  private cache: Map<K, V> = new Map();

  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // Evict LRU if capacity exceeded
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

const cache = new LRUCache<string, string>(3);

cache.set("a", "value-a");
cache.set("b", "value-b");
cache.set("c", "value-c");
console.log("Initial cache size:", 3);

cache.get("a"); // Access 'a'
cache.set("d", "value-d"); // Evict 'b' (least recently used)

console.log("After access and new insert:");
console.log("  a:", cache.get("a")); // value-a
console.log("  b:", cache.get("b")); // undefined (evicted)
console.log("  d:", cache.get("d")); // value-d

/**
 * SOLUTION 5: Memoization with TTL
 */

console.log("\n=== SOLUTION 5: MEMOIZATION WITH TTL ===");

class MemoizationCache<K, V> {
  private cache: Map<K, { value: V; expiresAt: number }> = new Map();

  constructor(private ttl: number) {}

  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: K, value: V): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }
}

const memoCache = new MemoizationCache<string, number>(1000); // 1 second TTL

function expensiveCalculation(n: number): number {
  const key = `calc-${n}`;

  const cached = memoCache.get(key);
  if (cached !== undefined) {
    console.log(`Cache hit for ${key}`);
    return cached;
  }

  console.log(`Computing ${key}`);
  const result = n * n;
  memoCache.set(key, result);
  return result;
}

console.log("First call:", expensiveCalculation(5)); // Compute
console.log("Second call:", expensiveCalculation(5)); // Cache hit
console.log("Third call:", expensiveCalculation(5)); // Cache hit

/**
 * SOLUTION 6: N+1 Query Solution
 */

console.log("\n=== SOLUTION 6: N+1 QUERY FIX ===");

// Simulated database
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const posts = [
  { id: 1, userId: 1, title: "Post 1" },
  { id: 2, userId: 1, title: "Post 2" },
  { id: 3, userId: 2, title: "Post 3" },
];

// Solution: Batch loading
function getUsersWithPosts_Optimized(limit: number) {
  const dbUsers = users.slice(0, limit);

  // Single query for all products
  const userMap = new Map();
  for (const user of dbUsers) {
    userMap.set(user.id, { ...user, posts: [] });
  }

  for (const post of posts) {
    if (userMap.has(post.userId)) {
      userMap.get(post.userId).posts.push(post);
    }
  }

  return Array.from(userMap.values());
}

console.log("Result:", getUsersWithPosts_Optimized(2));

/**
 * SOLUTION 7: Query Optimization
 */

console.log("\n=== SOLUTION 7: QUERY OPTIMIZATION ===");

const queryOptimizations = {
  original: `
    SELECT * FROM orders 
    WHERE YEAR(created_at) = 2024`,

  optimized: `
    SELECT id, user_id, total, status 
    FROM orders 
    WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'`,

  improvements: [
    "Avoid functions on WHERE columns - they prevent index usage",
    "Use date range instead of YEAR() function",
    "Select only needed columns instead of *",
    "Add indexes: CREATE INDEX idx_orders_created ON orders(created_at)",
  ],
};

console.log("Query optimization tips:");
optimizations.improvements.forEach((tip) => console.log("  -", tip));

/**
 * SOLUTION 8: Bundle Size Analysis
 */

console.log("\n=== SOLUTION 8: BUNDLE SIZE ===");

const bundleOptimization = {
  current: {
    "app.js": 300,
    "vendor.js": 180,
    "styles.css": 20,
  },

  strategies: [
    "Code splitting: Split by route (React.lazy)",
    "Tree shaking: Remove unused dependencies",
    "Minification: terser for JS, csso for CSS",
    "Compression: gzip (good), brotli (better)",
    "Async imports: Defer non-critical libraries",
  ],

  expectedReduction: "30-40% if all applied",
};

console.log("Bundle size: 500KB");
console.log("Optimizations:", bundleOptimization.strategies.length);

/**
 * SOLUTION 9: Caching Strategies
 */

console.log("\n=== SOLUTION 9: CACHING STRATEGIES ===");

const cacheStrategies = {
  immutable: {
    assets: "Versioned JS/CSS (with hash in filename)",
    header: "Cache-Control: public, max-age=31536000",
  },

  longTerm: {
    assets: "Images, fonts that rarely change",
    header: "Cache-Control: public, max-age=31536000",
  },

  mediumTerm: {
    assets: "HTML pages",
    header: "Cache-Control: public, max-age=86400",
  },

  shortTerm: {
    assets: "API responses, user data",
    header: "Cache-Control: private, max-age=3600",
  },

  noCache: {
    assets: "Real-time data, authentication",
    header: "Cache-Control: no-cache, must-revalidate",
  },
};

console.log("Cache strategies configured");

/**
 * SOLUTION 10: Performance Monitor
 */

console.log("\n=== SOLUTION 10: PERFORMANCE MONITOR ===");

class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  record(label: string, duration: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
  }

  getStats(label: string) {
    const data = this.metrics.get(label) || [];
    if (data.length === 0) return null;

    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((a, b) => a + b, 0);

    return {
      count: data.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / data.length,
      p95: sorted[Math.floor(data.length * 0.95)],
      p99: sorted[Math.floor(data.length * 0.99)],
    };
  }
}

const monitor = new PerformanceMonitor();

// Simulate operations
for (let i = 0; i < 100; i++) {
  monitor.record("api-request", Math.random() * 100);
}

const stats = monitor.getStats("api-request");
console.log("API request stats:", {
  avg: stats?.avg.toFixed(2),
  p95: stats?.p95.toFixed(2),
  p99: stats?.p99.toFixed(2),
});

console.log("\nPerformance Analysis Solutions Complete");
