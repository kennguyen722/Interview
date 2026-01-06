// ============================================================================
// PERFORMANCE ANALYSIS EXERCISES
// ============================================================================

/**
 * EXERCISE 1: Measuring Performance
 * 
 * Measure the execution time of these functions:
 */

// TODO: Implement measurePerformance() helper that:
// 1. Records start time
// 2. Executes function
// 3. Records end time
// 4. Returns duration in milliseconds

function slow_fibonacci(n: number): number {
  if (n <= 1) return n;
  return slow_fibonacci(n - 1) + slow_fibonacci(n - 2);
}

function fast_fibonacci(n: number): number {
  const cache: Record<number, number> = {};
  const compute = (n: number): number => {
    if (n in cache) return cache[n];
    if (n <= 1) return n;
    cache[n] = compute(n - 1) + compute(n - 2);
    return cache[n];
  };
  return compute(n);
}

// TODO: Measure and compare:
// - fast_fibonacci(40) vs slow_fibonacci(40)
// - Expected ratio: ~10000x faster

/**
 * EXERCISE 2: Memory Profiling
 * 
 * Identify which function uses less memory:
 */

// Approach 1: Build entire array in memory
function getAllNumbersArray(limit: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < limit; i++) {
    result.push(i);
  }
  return result;
}

// Approach 2: Generator (lazy evaluation)
function* getAllNumbersGenerator(limit: number): Generator<number> {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}

// TODO: Implement:
// 1. getMemoryUsage() helper
// 2. Compare memory of both approaches
// 3. Explain why generator is better
// 4. Test with limit = 1,000,000

/**
 * EXERCISE 3: Bottleneck Detection
 * 
 * Find the bottleneck in this code:
 */

async function processLargeDataset(ids: string[]): Promise<string[]> {
  const results: string[] = [];

  // Processing one at a time - SLOW
  for (const id of ids) {
    const data = await fetchUserData(id);
    const processed = processData(data);
    const validated = await validateWithServer(processed);
    results.push(validated);
  }

  return results;
}

// TODO: Identify bottlenecks and optimize:
// 1. Current bottleneck: _________
// 2. Optimization strategy: _________
// 3. Implement optimized version using:
//    - Promise.all() for parallel requests
//    - Batch processing
//    - Streaming

/**
 * EXERCISE 4: LRU Cache Implementation
 * 
 * Implement an LRU cache:
 */

interface LRUCache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  delete(key: K): boolean;
  clear(): void;
  size: number;
}

// TODO: Implement LRUCache<K, V> with:
// 1. Fixed capacity
// 2. LRU eviction
// 3. O(1) get/set operations
// 4. Order tracking
// 5. Test with cache misses and hits

/**
 * EXERCISE 5: Memoization Pattern
 * 
 * Implement memoization for expensive functions:
 */

function expensiveComputation(a: number, b: number): number {
  // Simulate expensive work
  const start = Date.now();
  while (Date.now() - start < 100) {}
  return a + b;
}

// TODO: Implement:
// 1. memoize<T extends Function>(fn: T): T
// 2. Cache based on arguments
// 3. Support optional TTL (time to live)
// 4. Verify cache hits reduce execution time
// 5. Clear cache on expiration

/**
 * EXERCISE 6: Bundle Size Analysis
 * 
 * This is a real-world scenario:
 */

// Your main bundle is 500KB and slow to load.
// The browser profiler shows:
// - app.js: 300KB
// - vendor.js: 180KB
// - styles.css: 20KB

// TODO: Create optimization plan:
// 1. Identify the largest contributors in app.js
// 2. Code splitting strategy: _________
// 3. Lazy loading strategy: _________
// 4. Tree-shaking improvements: _________
// 5. Compression options: _________

/**
 * EXERCISE 7: Database Query Optimization
 * 
 * Optimize these N+1 queries:
 */

// SLOW - N+1 Problem
async function getUsersWithPosts_Slow(limit: number) {
  const users = await db.query("SELECT * FROM users LIMIT ?", [limit]);

  // This runs a separate query for EACH user
  for (const user of users) {
    const posts = await db.query("SELECT * FROM posts WHERE user_id = ?", [user.id]);
    user.posts = posts;
  }

  return users;
}

// TODO: Implement optimized versions:
// 1. Using JOIN
// 2. Using batch loading
// 3. Using GraphQL dataloader pattern
// 4. Compare execution times

/**
 * EXERCISE 8: Network Request Optimization
 * 
 * Optimize API calls that are slow:
 */

// Current: Makes separate request for each item
async function fetchItemDetails_Slow(itemIds: string[]) {
  return Promise.all(
    itemIds.map(id => fetch(`/api/items/${id}`).then(r => r.json()))
  );
}

// TODO: Implement optimized version:
// 1. Batch endpoint: POST /api/items/batch { ids: [...] }
// 2. Compare number of requests
// 3. Measure total execution time
// 4. Calculate savings

/**
 * EXERCISE 9: Caching Strategy
 * 
 * Design caching for different scenarios:
 */

// Scenario 1: User profile data
// - Changes: Sometimes (user edits profile)
// - Access: Frequently
// - Staleness tolerance: 5 minutes
// Cache strategy: ___________
// Implementation: ___________

// Scenario 2: Product catalog
// - Changes: Rarely (admin updates)
// - Access: Frequently
// - Staleness tolerance: 24 hours
// Cache strategy: ___________
// Implementation: ___________

// Scenario 3: Real-time notifications
// - Changes: Constantly
// - Access: Always needed
// - Staleness tolerance: 0 seconds
// Cache strategy: ___________
// Implementation: ___________

/**
 * EXERCISE 10: Query Performance Analysis
 * 
 * These queries execute in ~5 seconds. Speed them up:
 */

// TODO: For each query, identify:
// 1. What indexes are needed?
// 2. What's the execution plan?
// 3. How to rewrite for better performance?

const query1 = `
  SELECT u.id, u.name, COUNT(o.id) as order_count
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  WHERE YEAR(u.created_at) = 2024
  GROUP BY u.id
  HAVING COUNT(o.id) > 5
`;

const query2 = `
  SELECT p.id, p.name, SUM(oi.quantity) as total_sold
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  WHERE oi.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY p.id
  ORDER BY total_sold DESC
  LIMIT 10
`;

/**
 * EXERCISE 11: Performance Profiling
 * 
 * Create a performance profiler that:
 * - Tracks function execution time
 * - Identifies slow functions
 * - Generates reports
 * - Helps with optimization
 */

// TODO: Implement:
// 1. Profiler.start(label) / .end(label)
// 2. Profiler.report() - shows all measurements
// 3. Profiler.slowest(n) - shows n slowest functions
// 4. Profiler.exportJSON() - for external analysis
// 5. Integration with error tracking

/**
 * EXERCISE 12: Real-World Optimization
 * 
 * You're given this slow service:
 * 
 * - API endpoint: /api/users/{id}/dashboard
 * - Response time: 5-8 seconds
 * - Load: 1000 requests/second
 * - Database: PostgreSQL
 * - Cache: Redis available
 * 
 * Steps to optimize:
 * 1. Profile to find bottlenecks: _________
 * 2. Implement caching: _________
 * 3. Optimize database queries: _________
 * 4. Consider async operations: _________
 * 5. Set target: response time < 200ms
 * 6. Monitor with: _________
 */

// TODO: Create optimization plan with:
// - Before/after performance metrics
// - Implementation steps
// - Testing strategy
// - Rollback plan
