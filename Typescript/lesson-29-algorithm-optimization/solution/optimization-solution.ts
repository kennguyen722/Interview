// ============================================================================
// LESSON 29: ALGORITHM OPTIMIZATION - SOLUTION
// ============================================================================

/**
 * SOLUTION 1: Complexity Analysis Answers
 */

// Function 1: O(n²) time, O(n) space
// Nested loops = O(n²), result array = O(n)

// Function 2: O(n) time, O(n) space
// Single loop = O(n), Set storage = O(n)

/**
 * SOLUTION 2: Two Sum Optimization
 */

// SLOW: O(n²)
function countPairsWithSumLessThan_Slow(arr: number[], target: number): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] < target) {
        count++;
      }
    }
  }
  return count;
}

// FAST: O(n log n)
function countPairsWithSumLessThan_Fast(arr: number[], target: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  let count = 0;
  let left = 0, right = sorted.length - 1;

  while (left < right) {
    if (sorted[left] + sorted[right] < target) {
      // All pairs between left and right work
      count += right - left;
      left++;
    } else {
      right--;
    }
  }

  return count;
}

/**
 * SOLUTION 3: Memoization
 */

function fibonacci_Optimized(n: number): number {
  const memo: Record<number, number> = {};

  function compute(n: number): number {
    if (n in memo) return memo[n];
    if (n <= 1) return n;

    memo[n] = compute(n - 1) + compute(n - 2);
    return memo[n];
  }

  return compute(n);
}

// Test: fibonacci(40) is now instant!

/**
 * SOLUTION 4: Hash Map Optimization
 */

// SLOW: O(n²)
function allUniqueElements_Slow(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return false;
    }
  }
  return true;
}

// FAST: O(n)
function allUniqueElements_Fast(arr: number[]): boolean {
  const seen = new Set<number>();

  for (const num of arr) {
    if (seen.has(num)) return false;
    seen.add(num);
  }

  return true;
}

/**
 * SOLUTION 5: Space-Time Tradeoff
 */

const tradeoffAnswers = {
  scenario1: {
    // 1 million numbers, limited RAM
    choice: "Solution B (O(n²) time, O(1) space)",
    reason:
      "Memory is the bottleneck. Need to minimize space usage. " +
      "O(n²) is acceptable for 1M items (1T operations ~seconds). " +
      "O(n) space = 1M numbers = too much RAM.",
  },

  scenario2: {
    // 100 numbers, critical response time
    choice: "Solution A (O(n) time, O(n) space)",
    reason:
      "Response time is critical. O(n²) with 100 items = 10K operations = slow. " +
      "O(n) with extra memory = instant response. " +
      "Small dataset so space isn't an issue.",
  },

  scenario3: {
    // 10K req/sec server
    choice: "Solution A (O(n) time, O(n) space)",
    reason:
      "With 10K requests/sec, total throughput matters. " +
      "O(n²) would stack requests and cause cascading failures. " +
      "O(n) allows handling multiple concurrent requests. " +
      "Memory grows but is manageable with pooling.",
  },
};

/**
 * SOLUTION 6: N+1 Query Fix
 */

// Solution 1: JOIN
async function getOrdersWithProducts_Join(userId: string) {
  // SELECT o.*, p.* FROM orders o
  // LEFT JOIN products p ON o.id = p.order_id
  // WHERE o.user_id = ?

  return null; // Query returns flattened data, need to restructure
}

// Solution 2: Batch Loading
async function getOrdersWithProducts_Batch(userId: string) {
  const orders = await db.query("SELECT * FROM orders WHERE user_id = ?", [userId]);

  const orderIds = orders.map((o) => o.id);
  const allProducts = await db.query(
    "SELECT * FROM products WHERE order_id IN (?)",
    [orderIds]
  );

  // Map products to orders
  const productMap = new Map();
  for (const product of allProducts) {
    if (!productMap.has(product.order_id)) {
      productMap.set(product.order_id, []);
    }
    productMap.get(product.order_id).push(product);
  }

  for (const order of orders) {
    order.products = productMap.get(order.id) || [];
  }

  return orders;
}

/**
 * SOLUTION 7: Algorithm Selection
 */

const algorithmChoices = {
  problem1: {
    problem: "Find element in sorted array",
    best: "Binary Search",
    complexity: "O(log n)",
    reason: "Sorted input allows logarithmic search",
  },

  problem2: {
    problem: "Find all unique elements",
    best: "Hash Set",
    complexity: "O(n)",
    reason: "Single pass through data",
  },

  problem3: {
    problem: "Find path in weighted graph",
    best: "Dijkstra",
    complexity: "O(E log V)",
    reason: "Weighted graph needs distance tracking",
  },
};

/**
 * SOLUTION 8: Bottleneck Identification
 */

const bottleneckAnalysis = {
  bottlenecks: [
    "JSON.stringify in loop - serialize every record",
    "Regex compilation in loop - compile same pattern repeatedly",
    "await validateSchema - sequential validation",
  ],

  optimizations: [
    "Compile regex once outside loop: const regex = /^[a-zA-Z0-9]+$/;",
    'Use simpler check instead of regex: email.match(/^[^@]+@[^@]+\\.[^@]+$/)',
    "Batch validations: Promise.all() for parallel processing",
  ],
};

/**
 * SOLUTION 9: Complexity Explanation
 */

const complexityExplanation = `
The time complexity is O(n²) because:
- Sort: O(n log n)
- Outer loop: O(n)
- Inner while loop: O(n) in worst case
- Total: O(n log n) + O(n²) = O(n²)

The space complexity is O(1) or O(n) depending on sort implementation:
- In-place sort: O(1)
- Merge sort: O(n)

This is better than brute force O(n³) because:
- We sort first (O(n log n))
- Then use two pointers instead of third loop
- This reduces one dimension of nested iteration
`;

/**
 * SOLUTION 10: Two Sum Optimization
 */

// SLOW: O(n²)
function twoSum_Slow(arr: number[], target: number): [number, number] | null {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        return [arr[i], arr[j]];
      }
    }
  }
  return null;
}

// FAST: O(n)
function twoSum_Fast(arr: number[], target: number): [number, number] | null {
  const seen = new Set<number>();

  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      return [complement, num];
    }
    seen.add(num);
  }

  return null;
}

// Test
console.log("twoSum([2, 7, 11, 15], 9):", twoSum_Fast([2, 7, 11, 15], 9)); // [2, 7]

/**
 * SOLUTION 11: Database Query Optimization
 */

const queryOptimizations = {
  issue: "Slow query without proper indexes",
  opportunities: [
    "Create index on created_at column",
    "Create index on user_id (if not part of primary key)",
    "Add composite index: (created_at, user_id)",
  ],
  improved: `
    SELECT u.id, u.name, COUNT(p.id) as product_count
    FROM users u
    LEFT JOIN products p ON u.id = p.user_id
    WHERE u.created_at > '2024-01-01'
    GROUP BY u.id
    ORDER BY product_count DESC
    
    Indexes:
    CREATE INDEX idx_users_created ON users(created_at);
    CREATE INDEX idx_products_user ON products(user_id);
  `,
};

/**
 * SOLUTION 12: Benchmark Function
 */

function benchmarkAlgorithms<T>(
  algorithms: { name: string; fn: () => T }[],
  iterations = 1000
) {
  console.log("=== BENCHMARK RESULTS ===");

  const results = [];

  for (const algo of algorithms) {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      algo.fn();
    }

    const duration = performance.now() - start;
    const opsPerSec = (iterations / duration) * 1000;

    results.push({
      name: algo.name,
      duration: duration.toFixed(2),
      opsPerSec: Math.round(opsPerSec),
    });
  }

  // Sort by performance
  results.sort((a, b) => parseFloat(b.opsPerSec) - parseFloat(a.opsPerSec));

  for (const result of results) {
    console.log(`${result.name}: ${result.duration}ms (${result.opsPerSec} ops/sec)`);
  }

  return results;
}

console.log("Algorithm Optimization Solutions Complete");
