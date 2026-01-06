// ============================================================================
// ALGORITHM OPTIMIZATION EXERCISES
// ============================================================================

/**
 * EXERCISE 1: Complexity Analysis
 * 
 * Analyze the time and space complexity of each function:
 */

// Function 1
function findDuplicates1(arr: number[]): number[] {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        result.push(arr[i]);
        break;
      }
    }
  }
  return result;
}

// TODO: Time: _____, Space: _____

// Function 2
function findDuplicates2(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }
  return Array.from(duplicates);
}

// TODO: Time: _____, Space: _____

/**
 * EXERCISE 2: Optimization Opportunity
 * 
 * Optimize this O(n²) solution to O(n log n) or O(n):
 */

function countPairsWithSumLessThan(arr: number[], target: number): number {
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

// TODO: Implement optimized version
// Hint: Sort first, then use two pointers

/**
 * EXERCISE 3: Memoization
 * 
 * Add memoization to reduce from O(2ⁿ) to O(n):
 */

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// TODO: Add memoization
// Test: console.log(fibonacci(40)) should be instant

/**
 * EXERCISE 4: Hash Map Optimization
 * 
 * Reduce from O(n²) to O(n) using hash map:
 */

function allUniqueElements(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return false;
    }
  }
  return true;
}

// TODO: Implement O(n) version using Set

/**
 * EXERCISE 5: Space-Time Tradeoff
 * 
 * You have two solutions:
 * - Solution A: O(n) time, O(n) space
 * - Solution B: O(n²) time, O(1) space
 * 
 * For each scenario, which would you choose?
 * 
 * Scenario 1: Processing 1 million numbers with limited RAM (2GB)
 * Choice: _____
 * Reason: _____
 * 
 * Scenario 2: Processing 100 numbers but response time is critical
 * Choice: _____
 * Reason: _____
 * 
 * Scenario 3: Web server handling 10,000 requests per second
 * Choice: _____
 * Reason: _____
 */

/**
 * EXERCISE 6: N+1 Query Problem
 * 
 * Identify and fix the N+1 query problem:
 */

async function getOrdersWithProducts_BadVersion(userId: string) {
  const orders = await db.query("SELECT * FROM orders WHERE user_id = ?", [userId]);
  
  for (const order of orders) {
    const products = await db.query(
      "SELECT * FROM products WHERE order_id = ?",
      [order.id]
    );
    order.products = products;
  }
  
  return orders;
}

// TODO: Rewrite using:
// 1. JOIN approach
// 2. Batch loading approach

/**
 * EXERCISE 7: Algorithm Selection
 * 
 * For each problem, choose the optimal algorithm:
 * 
 * Problem 1: Find element in sorted array
 * Algorithms: Linear Search, Binary Search
 * Best choice: _____ (Complexity: _____)
 * 
 * Problem 2: Find all unique elements
 * Algorithms: Nested loops, Hash Set
 * Best choice: _____ (Complexity: _____)
 * 
 * Problem 3: Find path in weighted graph
 * Algorithms: BFS, Dijkstra
 * Best choice: _____ (Complexity: _____)
 */

/**
 * EXERCISE 8: Bottleneck Identification
 * 
 * This function processes 1 million records.
 * Identify what the bottleneck is and suggest optimization:
 */

async function processRecords(records: Record[]) {
  const results = [];
  
  for (const record of records) {
    const json = JSON.stringify(record);
    const regex = /^[a-zA-Z0-9]+$/;
    
    if (regex.test(record.id)) {
      const validated = await validateSchema(record);
      const transformed = transformData(validated);
      results.push(transformed);
    }
  }
  
  return results;
}

// TODO: Identify bottlenecks:
// 1. _________________
// 2. _________________
// 3. _________________
// 
// Optimizations:
// 1. _________________
// 2. _________________
// 3. _________________

/**
 * EXERCISE 9: Complexity Communication
 * 
 * In an interview, explain the complexity of this solution:
 */

function threeSum(arr: number[], target: number): number[][] {
  arr.sort((a, b) => a - b); // O(n log n)
  const results: number[][] = [];

  for (let i = 0; i < arr.length - 2; i++) {
    let left = i + 1, right = arr.length - 1;

    while (left < right) {
      const sum = arr[i] + arr[left] + arr[right];
      if (sum === target) {
        results.push([arr[i], arr[left], arr[right]]);
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }

  return results;
}

// TODO: Write explanation:
// "The time complexity is _____ because ____________.
// The space complexity is _____ because ____________.
// This is better than the brute force approach which is _____ because _____."

/**
 * EXERCISE 10: Optimization Challenge
 * 
 * Optimize this function from O(n²) to better:
 */

function twoSum(arr: number[], target: number): [number, number] | null {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        return [arr[i], arr[j]];
      }
    }
  }
  return null;
}

// TODO: Implement O(n) solution
// Test with: twoSum([2, 7, 11, 15], 9) => [2, 7]

/**
 * EXERCISE 11: Real-World Optimization
 * 
 * You have a database query that's slow:
 * 
 * "SELECT u.id, u.name, COUNT(p.id) as product_count
 *  FROM users u
 *  LEFT JOIN products p ON u.id = p.user_id
 *  WHERE u.created_at > '2024-01-01'
 *  GROUP BY u.id
 *  ORDER BY product_count DESC"
 * 
 * Identify optimization opportunities:
 * 1. _________________
 * 2. _________________
 * 3. _________________
 */

/**
 * EXERCISE 12: Measure and Optimize
 * 
 * Write a function that:
 * 1. Measures execution time
 * 2. Measures memory usage
 * 3. Compares different implementations
 * 4. Determines which is faster/more memory efficient
 */

// TODO: Create benchmark function for comparing algorithms
