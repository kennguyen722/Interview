# Lesson 31: Performance Analysis & Profiling

## Objective
Master performance measurement, bottleneck identification, and optimization techniques. Learn to profile TypeScript/Node.js applications and make data-driven optimization decisions.

## Topics Covered

### 1. Measurement Tools & Techniques

#### 1.1 Performance API
```typescript
// Basic timing
function measureExecutionTime(fn: () => void): number {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start; // milliseconds
}

// Measuring function
const duration = measureExecutionTime(() => {
  // Code to measure
  expensiveOperation();
});
console.log(`Execution time: ${duration.toFixed(2)}ms`);

// Mark and measure (more granular)
performance.mark("calculation-start");

expensiveCalculation();

performance.mark("calculation-end");
performance.measure("calculation", "calculation-start", "calculation-end");

const measure = performance.getEntriesByName("calculation")[0];
console.log(`Calculation took ${measure.duration.toFixed(2)}ms`);
```

#### 1.2 Memory Profiling
```typescript
// Memory usage
function getMemoryUsage() {
  const memUsage = process.memoryUsage();
  return {
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
  };
}

console.log("Before:", getMemoryUsage());

// Create objects
const largeArray = Array(1000000).fill(0);

console.log("After:", getMemoryUsage());

// Clear references
largeArray.length = 0;
console.log("Cleared:", getMemoryUsage());
```

### 2. Identifying Bottlenecks

#### Pattern 1: N+1 Query Problem
```typescript
// ❌ PROBLEM: N+1 queries
async function getUsersWithComments() {
  const users = await db.query("SELECT * FROM users"); // 1 query
  
  for (const user of users) {
    user.comments = await db.query(
      "SELECT * FROM comments WHERE user_id = ?",
      [user.id]
    ); // N queries
  }
  
  return users; // Total: N+1 queries
}

// ✅ SOLUTION: Use JOIN
async function getUsersWithComments() {
  return await db.query(`
    SELECT u.*, c.id as comment_id, c.text
    FROM users u
    LEFT JOIN comments c ON u.id = c.user_id
  `);
}

// ✅ SOLUTION: Batch load comments
async function getUsersWithComments() {
  const users = await db.query("SELECT * FROM users");
  const userIds = users.map(u => u.id);
  
  const comments = await db.query(
    "SELECT * FROM comments WHERE user_id IN (?)",
    [userIds]
  );
  
  const commentsByUserId = new Map();
  for (const comment of comments) {
    if (!commentsByUserId.has(comment.user_id)) {
      commentsByUserId.set(comment.user_id, []);
    }
    commentsByUserId.get(comment.user_id).push(comment);
  }
  
  return users.map(u => ({
    ...u,
    comments: commentsByUserId.get(u.id) || []
  }));
}
```

#### Pattern 2: Unnecessary Data Transfer
```typescript
// ❌ PROBLEM: Transferring unused data
async function getUserList() {
  const users = await db.query("SELECT * FROM users"); // 50 columns
  return users.map(u => ({ id: u.id, name: u.name })); // Only need 2
}

// ✅ SOLUTION: Select only needed columns
async function getUserList() {
  return await db.query("SELECT id, name FROM users");
}
```

#### Pattern 3: Inefficient Algorithms
```typescript
// ❌ O(n²) - Array.indexOf in loop
function findDuplicates(arr: number[]): number[] {
  return arr.filter((item, index) => arr.indexOf(item) !== index);
}

// ✅ O(n) - Use Set
function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}
```

### 3. Caching Strategies

#### LRU Cache
```typescript
class LRUCache<K, V> {
  private cache: Map<K, V> = new Map();

  constructor(private maxSize: number) {}

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
      this.cache.delete(key); // Remove old entry
    }

    this.cache.set(key, value);

    // Evict oldest if over capacity
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Usage
const cache = new LRUCache<string, any>(100);
const userId = "123";

const user = cache.get(userId) || await loadUser(userId);
cache.set(userId, user);
```

#### Memoization with Expiration
```typescript
class MemoizationCache<Args extends any[], Result> {
  private cache: Map<string, { value: Result; expiresAt: number }> = new Map();

  constructor(
    private fn: (...args: Args) => Result,
    private ttlMs: number = 60000
  ) {}

  execute(...args: Args): Result {
    const key = JSON.stringify(args);
    const cached = this.cache.get(key);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.value;
    }

    const value = this.fn(...args);
    this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });

    return value;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage
const expensiveCalculation = new MemoizationCache(
  (a: number, b: number) => {
    // Expensive operation
    return a * b * 1000;
  },
  5000 // 5 second TTL
);

const result1 = expensiveCalculation.execute(5, 10); // Computed
const result2 = expensiveCalculation.execute(5, 10); // From cache
```

### 4. Bundle Size Analysis

```typescript
// Analyze what's in your bundle
import { analyzeMetafile } from "esbuild";

const result = await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  metafile: true,
  outfile: "dist/bundle.js",
});

console.log(await analyzeMetafile(result.metafile));

// Output shows:
// - Total bundle size
// - Size of each import
// - Which files are largest
// - Opportunities to remove unused code
```

### 5. Database Query Optimization

```typescript
// Enable query logging
// In development, log slow queries:

interface QueryLog {
  sql: string;
  duration: number;
  rows: number;
}

const queryLogs: QueryLog[] = [];
const SLOW_QUERY_THRESHOLD = 100; // ms

class OptimizedDatabase {
  async query(sql: string, params: any[]): Promise<any[]> {
    const start = performance.now();
    const result = await executeQuery(sql, params);
    const duration = performance.now() - start;

    if (duration > SLOW_QUERY_THRESHOLD) {
      console.warn(
        `SLOW QUERY (${duration.toFixed(2)}ms): ${sql}`,
        params
      );
    }

    queryLogs.push({ sql, duration, rows: result.length });
    return result;
  }

  generateReport(): void {
    const slowest = queryLogs
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    console.log("Top 10 slowest queries:");
    slowest.forEach(log => {
      console.log(`${log.duration.toFixed(2)}ms: ${log.sql}`);
    });
  }
}
```

### 6. Common Performance Issues

```typescript
// ❌ PROBLEM: Creating large objects in tight loops
function processMillionItems(items: Item[]): Result[] {
  const results = [];
  for (const item of items) {
    results.push({
      id: item.id,
      name: item.name,
      description: item.description,
      metadata: JSON.parse(item.metadata), // Parsing in loop
      tags: item.tags.split(","), // Splitting in loop
    });
  }
  return results;
}

// ✅ SOLUTION: Precompute what you can
function processMillionItems(items: Item[]): Result[] {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    metadata: typeof item.metadata === "string" 
      ? JSON.parse(item.metadata) 
      : item.metadata,
    tags: typeof item.tags === "string" 
      ? item.tags.split(",") 
      : item.tags,
  }));
}

// ❌ PROBLEM: Unnecessary regex compilation
function validateEmails(emails: string[]): boolean[] {
  return emails.map(email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Compiled for each email
    return regex.test(email);
  });
}

// ✅ SOLUTION: Compile once
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmails(emails: string[]): boolean[] {
  return emails.map(email => EMAIL_REGEX.test(email));
}
```

### 7. Performance Monitoring in Production

```typescript
// APM (Application Performance Monitoring) pattern
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();

    return fn()
      .then(result => {
        this.recordMetric(name, performance.now() - start, metadata);
        return result;
      })
      .catch(error => {
        this.recordMetric(name, performance.now() - start, {
          ...metadata,
          error: error.message,
        });
        throw error;
      });
  }

  private recordMetric(
    name: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date(),
      metadata,
    };

    this.metrics.push(metric);

    // Send to monitoring service
    if (duration > 1000) {
      // Slow operation
      this.sendAlert(metric);
    }
  }

  private sendAlert(metric: PerformanceMetric): void {
    // Send to Datadog, New Relic, etc.
    console.warn("Performance alert:", metric);
  }
}

// Usage
const monitor = new PerformanceMonitor();

await monitor.measureAsync("database-query", async () => {
  return await db.query("SELECT * FROM users");
});
```

## Learning Outcomes
- Measure performance accurately
- Identify bottlenecks systematically
- Implement effective caching
- Optimize database queries
- Monitor production performance
- Make data-driven optimization decisions

## Resources
- [Node.js Performance Hooks](https://nodejs.org/api/perf_hooks.html)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [Database Query Optimization](https://use-the-index-luke.com/)
