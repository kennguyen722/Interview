// ============================================================================
// PERFORMANCE ANALYSIS - PRACTICAL EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Performance Measurement
 */

function measurePerformance<T>(
  label: string,
  fn: () => T,
  iterations = 1
): { result: T; duration: number; opsPerSecond: number } {
  const start = performance.now();

  let result: T;
  for (let i = 0; i < iterations; i++) {
    result = fn();
  }

  const end = performance.now();
  const duration = end - start;
  const opsPerSecond = Math.round((iterations / duration) * 1000);

  console.log(`${label}: ${duration.toFixed(2)}ms (${opsPerSecond} ops/sec)`);

  return { result: result!, duration, opsPerSecond };
}

// Compare algorithms
console.log("=== PERFORMANCE MEASUREMENT ===");

measurePerformance(
  "Array find",
  () => [1, 2, 3, 4, 5].find((x) => x === 4),
  10000
);

measurePerformance(
  "Array indexOf",
  () => [1, 2, 3, 4, 5].indexOf(4),
  10000
);

measurePerformance(
  "Set has",
  () => new Set([1, 2, 3, 4, 5]).has(4),
  10000
);

/**
 * EXAMPLE 2: Memory Profiling
 */

function getMemoryUsage(): { heapUsed: number; heapTotal: number } {
  const mem = process.memoryUsage();
  return {
    heapUsed: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100, // MB
    heapTotal: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100, // MB
  };
}

// Example: Array vs Generator
console.log("\n=== MEMORY PROFILING ===");

const before = getMemoryUsage();
const largeArray = Array.from({ length: 100000 }, (_, i) => i);
const afterArray = getMemoryUsage();

console.log(`Array allocation: ${afterArray.heapUsed - before.heapUsed}MB`);

function* numberGenerator(limit: number) {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}

const gen = numberGenerator(100000);
const afterGen = getMemoryUsage();

console.log(`Generator allocation: ${afterGen.heapUsed - afterArray.heapUsed}MB`);

/**
 * EXAMPLE 3: Bottleneck Identification
 */

console.log("\n=== BOTTLENECK IDENTIFICATION ===");

// Simulate different components
function componentsWithBottlenecks() {
  const start = Date.now();
  console.time("Component A");
  // Expensive operation
  for (let i = 0; i < 100000; i++) {
    Math.sqrt(i);
  }
  console.timeEnd("Component A");

  console.time("Component B");
  // Fast operation
  const arr = [1, 2, 3];
  arr.map((x) => x * 2);
  console.timeEnd("Component B");

  console.time("Component C");
  // Moderate operation
  const sum = Array.from({ length: 1000 }, (_, i) => i).reduce((a, b) => a + b, 0);
  console.timeEnd("Component C");

  console.log(`Total time: ${Date.now() - start}ms`);
}

componentsWithBottlenecks();

/**
 * EXAMPLE 4: LRU Cache Implementation
 */

class LRUCache<K, V> {
  private cache: Map<K, V> = new Map();

  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recent)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key); // Remove old entry
    }

    this.cache.set(key, value);

    // Evict least recently used if capacity exceeded
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }
}

console.log("\n=== LRU CACHE ===");

const cache = new LRUCache<string, string>(3);

cache.set("a", "value-a");
cache.set("b", "value-b");
cache.set("c", "value-c");
console.log("Cache size:", cache.size()); // 3

cache.get("a"); // Access 'a', moves to end
cache.set("d", "value-d"); // Add 'd', evict 'b' (least recently used)
console.log("Cache size:", cache.size()); // 3

console.log("Get 'a':", cache.get("a")); // value-a
console.log("Get 'b':", cache.get("b")); // undefined (evicted)

/**
 * EXAMPLE 5: Memoization with TTL
 */

class MemoizationCache<K, V> {
  private cache: Map<K, { value: V; expiresAt: number }> = new Map();

  constructor(private ttl: number) {} // ttl in milliseconds

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

  clear(): void {
    this.cache.clear();
  }
}

function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  ttl = 60000 // Default 1 minute
): (...args: Args) => Return {
  const cache = new MemoizationCache<string, Return>(ttl);

  return (...args: Args): Return => {
    const key = JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== undefined) {
      console.log(`Cache hit for ${key}`);
      return cached;
    }

    console.log(`Cache miss for ${key}`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

console.log("\n=== MEMOIZATION WITH TTL ===");

let callCount = 0;

const memoized = memoize((a: number, b: number) => {
  callCount++;
  console.log(`  Computing ${a} + ${b}`);
  return a + b;
}, 2000);

console.log("Call 1:", memoized(2, 3)); // Computes
console.log("Call 2:", memoized(2, 3)); // Cached
console.log("Call 3:", memoized(2, 3)); // Cached
console.log("Call 4:", memoized(3, 4)); // Computes

/**
 * EXAMPLE 6: N+1 Query Problem
 */

// Simulated database
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const posts = [
  { id: 1, userId: 1, title: "Post 1" },
  { id: 2, userId: 1, title: "Post 2" },
  { id: 3, userId: 2, title: "Post 3" },
];

// SLOW: N+1 Problem - 1 query for users + N queries for posts
async function getUsersWithPosts_Slow(limit: number) {
  console.log("\n=== N+1 QUERY PROBLEM ===");

  const dbUsers = users.slice(0, limit);
  console.time("N+1 Solution");

  for (const user of dbUsers) {
    const userPosts = posts.filter((p) => p.userId === user.id);
    (user as any).posts = userPosts;
  }

  console.timeEnd("N+1 Solution");
  return dbUsers;
}

// FAST: 1 JOIN query + batching
function getUsersWithPosts_Fast(limit: number) {
  console.log("\n=== OPTIMIZED SOLUTION ===");

  const dbUsers = users.slice(0, limit);
  console.time("Join Solution");

  // In real DB: SELECT u.*, p.* FROM users u LEFT JOIN posts p ON u.id = p.user_id
  const userMap = new Map();
  for (const user of dbUsers) {
    userMap.set(user.id, { ...user, posts: [] });
  }

  for (const post of posts) {
    if (userMap.has(post.userId)) {
      userMap.get(post.userId).posts.push(post);
    }
  }

  console.timeEnd("Join Solution");
  return Array.from(userMap.values());
}

getUsersWithPosts_Slow(3);
getUsersWithPosts_Fast(3);

/**
 * EXAMPLE 7: Query Optimization Examples
 */

console.log("\n=== QUERY OPTIMIZATION ===");

// Slow: Full table scan
// SELECT * FROM orders WHERE YEAR(created_at) = 2024
// Better with index on created_at

// Slow: Multiple joins with filtering
// SELECT * FROM users u JOIN orders o ON u.id = o.user_id
// WHERE u.status = 'active' ORDER BY o.created_at DESC
// Better: Add index on (u.status, u.id) and (o.created_at)

// Slow: Aggregation without proper grouping
// SELECT COUNT(*) FROM orders GROUP BY user_id
// Better: Use HAVING clause and index on user_id

console.log("Query optimization tips:");
console.log("1. Create indexes on WHERE and JOIN columns");
console.log("2. Use EXPLAIN to analyze query execution");
console.log("3. Batch similar queries together");
console.log("4. Use connection pooling");
console.log("5. Monitor slow query logs");

/**
 * EXAMPLE 8: Bundling and Code Splitting
 */

console.log("\n=== BUNDLE SIZE OPTIMIZATION ===");

// Analysis of bundle:
const bundleAnalysis = {
  "app.js": 300, // KB
  "vendor.js": 180,
  "styles.css": 20,
  total: 500,
};

console.log("Bundle Analysis:");
Object.entries(bundleAnalysis).forEach(([name, size]) => {
  const percent = ((size / bundleAnalysis.total) * 100).toFixed(1);
  console.log(`  ${name}: ${size}KB (${percent}%)`);
});

console.log("\nOptimization strategies:");
console.log("1. Code splitting - lazy load routes");
console.log("2. Tree shaking - remove unused code");
console.log("3. Minification - reduce file size");
console.log("4. Compression - gzip/brotli");
console.log("5. Async imports - defer non-critical code");

/**
 * EXAMPLE 9: Caching Headers
 */

console.log("\n=== CACHING HEADERS ===");

interface CacheStrategy {
  type: string;
  maxAge: number;
  public: boolean;
  description: string;
}

const cacheStrategies: CacheStrategy[] = [
  {
    type: "immutable",
    maxAge: 31536000, // 1 year
    public: true,
    description: "Versioned assets (js, css with hash)",
  },
  {
    type: "long-term",
    maxAge: 31536000,
    public: true,
    description: "Images, fonts that rarely change",
  },
  {
    type: "medium-term",
    maxAge: 86400, // 1 day
    public: true,
    description: "HTML documents",
  },
  {
    type: "short-term",
    maxAge: 3600, // 1 hour
    public: false,
    description: "User-specific data",
  },
  {
    type: "no-cache",
    maxAge: 0,
    public: false,
    description: "Real-time data",
  },
];

console.log("Cache-Control strategies:");
cacheStrategies.forEach((strategy) => {
  const header = `public, max-age=${strategy.maxAge}`;
  console.log(`  ${strategy.type}: ${header} - ${strategy.description}`);
});

/**
 * EXAMPLE 10: Performance Monitoring
 */

console.log("\n=== PERFORMANCE MONITORING ===");

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
      p50: sorted[Math.floor(data.length * 0.5)],
      p95: sorted[Math.floor(data.length * 0.95)],
      p99: sorted[Math.floor(data.length * 0.99)],
    };
  }

  report() {
    console.log("Performance Report:");
    for (const label of this.metrics.keys()) {
      const stats = this.getStats(label);
      if (stats) {
        console.log(`\n${label}:`);
        console.log(`  Count: ${stats.count}`);
        console.log(`  Avg: ${stats.avg.toFixed(2)}ms`);
        console.log(`  P95: ${stats.p95.toFixed(2)}ms`);
        console.log(`  P99: ${stats.p99.toFixed(2)}ms`);
      }
    }
  }
}

const monitor = new PerformanceMonitor();

// Simulate operations
for (let i = 0; i < 100; i++) {
  monitor.record("api-request", Math.random() * 100);
  monitor.record("db-query", Math.random() * 50);
}

monitor.report();
