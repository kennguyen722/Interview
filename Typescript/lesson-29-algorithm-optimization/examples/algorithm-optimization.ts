// ============================================================================
// ALGORITHM OPTIMIZATION - PRACTICAL EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Complexity Analysis with Visualizations
 */

// O(1) - Constant Time
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0]; // Always one operation
}

// O(n) - Linear Time
function findElement<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// O(n²) - Quadratic Time (Bubble Sort)
function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}

// O(n log n) - Linearithmic Time (Merge Sort)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}

// O(log n) - Logarithmic Time (Binary Search)
function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// O(2ⁿ) - Exponential Time (Fibonacci without memoization)
function fibonacciExponential(n: number): number {
  if (n <= 1) return n;
  return fibonacciExponential(n - 1) + fibonacciExponential(n - 2);
}

console.log("COMPLEXITY ANALYSIS:");
console.log("O(1): getFirstElement([1,2,3]) =", getFirstElement([1, 2, 3]));
console.log("O(n): findElement([1,2,3], 2) =", findElement([1, 2, 3], 2));
console.log("O(n²): bubbleSort([3,1,2]) =", bubbleSort([3, 1, 2]));
console.log("O(n log n): mergeSort([3,1,2]) =", mergeSort([3, 1, 2]));
console.log("O(log n): binarySearch([1,2,3,4,5], 3) =", binarySearch([1, 2, 3, 4, 5], 3));

/**
 * EXAMPLE 2: O(n²) to O(n) Optimization
 */

// SLOW: O(n²) - Find all pairs that sum to target
function twoSum_Slow(arr: number[], target: number): [number, number][] {
  const pairs: [number, number][] = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }

  return pairs;
}

// FAST: O(n) - Using hash set
function twoSum_Fast(arr: number[], target: number): [number, number][] {
  const seen = new Set<number>();
  const pairs: [number, number][] = [];

  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      pairs.push([Math.min(num, complement), Math.max(num, complement)]);
    }
    seen.add(num);
  }

  return pairs;
}

console.log("\nTWO SUM OPTIMIZATION:");
const testArr = [1, 5, 7, -1, 5];
const testTarget = 6;
console.log("Slow:", twoSum_Slow(testArr, testTarget));
console.log("Fast:", twoSum_Fast(testArr, testTarget));

/**
 * EXAMPLE 3: Memoization - O(2ⁿ) to O(n)
 */

// SLOW: O(2ⁿ) - Exponential
function fibonacci_Slow(n: number): number {
  if (n <= 1) return n;
  return fibonacci_Slow(n - 1) + fibonacci_Slow(n - 2);
}

// FAST: O(n) - With memoization
function fibonacci_Fast(n: number): number {
  const cache: Record<number, number> = {};

  const compute = (n: number): number => {
    if (n in cache) return cache[n];
    if (n <= 1) return n;

    cache[n] = compute(n - 1) + compute(n - 2);
    return cache[n];
  };

  return compute(n);
}

console.log("\nMEMOIZATION OPTIMIZATION:");
console.log("fibonacci(10) Slow:", fibonacci_Slow(10)); // 55
console.log("fibonacci(10) Fast:", fibonacci_Fast(10)); // 55
console.log("fibonacci(40) Fast:", fibonacci_Fast(40)); // Instant with memoization

/**
 * EXAMPLE 4: Space-Time Tradeoff
 */

// Option A: O(n) space, O(n) time
function findDuplicates_HashMap(arr: number[]): number[] {
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

// Option B: O(1) space, O(n²) time
function findDuplicates_NoSpace(arr: number[]): number[] {
  const duplicates: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }

  return duplicates;
}

console.log("\nSPACE-TIME TRADEOFF:");
const testData = [1, 2, 2, 3, 3, 3, 4];
console.log("HashMap approach:", findDuplicates_HashMap(testData)); // [2, 3]
console.log("No space approach:", findDuplicates_NoSpace(testData)); // [2, 3]

/**
 * EXAMPLE 5: Two Pointers Optimization
 */

// Count pairs with sum less than target
// SLOW: O(n²)
function countPairs_Slow(arr: number[], target: number): number {
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

// FAST: O(n log n) with sort + O(n) with two pointers
function countPairs_Fast(arr: number[], target: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  let count = 0;
  let left = 0, right = sorted.length - 1;

  while (left < right) {
    if (sorted[left] + sorted[right] < target) {
      // If left + right < target, all elements between left and right also work
      count += right - left;
      left++;
    } else {
      right--;
    }
  }

  return count;
}

console.log("\nTWO POINTERS OPTIMIZATION:");
const pairsArr = [1, 5, 3, 4, 2];
const pairsTarget = 7;
console.log("Slow (O(n²)):", countPairs_Slow(pairsArr, pairsTarget));
console.log("Fast (O(n log n)):", countPairs_Fast(pairsArr, pairsTarget));

/**
 * EXAMPLE 6: Sliding Window Optimization
 */

// Find max sum of k consecutive elements
// SLOW: O(n*k)
function maxSubarraySum_Slow(arr: number[], k: number): number {
  let maxSum = -Infinity;

  for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += arr[j];
    }
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}

// FAST: O(n) with sliding window
function maxSubarraySum_Fast(arr: number[], k: number): number {
  // Calculate first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log("\nSLIDING WINDOW OPTIMIZATION:");
const subarrayArr = [1, 3, 2, 6, -1, 4, 1, 8];
const k = 3;
console.log("Slow (O(n*k)):", maxSubarraySum_Slow(subarrayArr, k)); // 13
console.log("Fast (O(n)):", maxSubarraySum_Fast(subarrayArr, k)); // 13

/**
 * EXAMPLE 7: Complexity Analysis Toolkit
 */

function analyzeComplexity() {
  console.log("\n=== COMPLEXITY HIERARCHY ===");
  console.log("O(1)     - Constant - Dictionary lookup, array access");
  console.log("O(log n) - Logarithmic - Binary search");
  console.log("O(n)     - Linear - Simple loop");
  console.log("O(n log n) - Linearithmic - Efficient sorting");
  console.log("O(n²)    - Quadratic - Nested loops");
  console.log("O(n³)    - Cubic - Triple nested loops");
  console.log("O(2ⁿ)    - Exponential - Recursion without memoization");
  console.log("O(n!)    - Factorial - Permutations");
}

analyzeComplexity();

/**
 * EXAMPLE 8: Real-World Optimization Case Study
 */

// BEFORE: O(n³) - Check every group of 3
function threeSum_Slow(arr: number[], target: number): number[][] {
  const result: number[][] = [];

  for (let i = 0; i < arr.length - 2; i++) {
    for (let j = i + 1; j < arr.length - 1; j++) {
      for (let k = j + 1; k < arr.length; k++) {
        if (arr[i] + arr[j] + arr[k] === target) {
          result.push([arr[i], arr[j], arr[k]]);
        }
      }
    }
  }

  return result;
}

// AFTER: O(n²) - Sort + two pointers
function threeSum_Fast(arr: number[], target: number): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    let left = i + 1, right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];

      if (sum === target) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

console.log("\nTHREE SUM OPTIMIZATION:");
const threeSumArr = [1, 0, -1, 0, -2, 2];
const threeSumTarget = 0;
console.log("Fast version:", threeSum_Fast(threeSumArr, threeSumTarget));
