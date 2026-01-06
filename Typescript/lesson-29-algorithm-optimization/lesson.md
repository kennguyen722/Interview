# Lesson 29: Algorithm Optimization & Complexity Analysis

## Objective
Master algorithmic thinking: understand time/space complexity, recognize optimization patterns, and choose efficient solutions for interview problems.

## Topics Covered

### 1. Big O Complexity Analysis

**Common Complexities (Worst Case)**
```
O(1)     - Constant: Array access by index
O(log n) - Logarithmic: Binary search
O(n)     - Linear: Simple loop
O(n log n) - Linearithmic: Efficient sorting
O(n²)    - Quadratic: Nested loops
O(n³)    - Cubic: Triple nested loops
O(2ⁿ)    - Exponential: Recursive without memoization
O(n!)    - Factorial: Generate permutations
```

**Analyzing Code**
```typescript
// O(1) - Constant time
function getFirst(arr: number[]): number {
  return arr[0];
}

// O(n) - Linear
function sum(arr: number[]): number {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// O(n²) - Quadratic (two nested loops)
function hasDuplicate(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n log n) - Linearithmic (divide and conquer)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

// O(2ⁿ) - Exponential (recursive without memoization)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### 2. Space Complexity Analysis

```typescript
// O(1) - Constant space
function maxValue(arr: number[]): number {
  let max = arr[0];
  for (const num of arr) {
    max = Math.max(max, num);
  }
  return max;
}

// O(n) - Linear space
function reverseArray(arr: number[]): number[] {
  const reversed = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    reversed[i] = arr[arr.length - 1 - i];
  }
  return reversed;
}

// O(log n) - Space for recursion stack
function binarySearch(arr: number[], target: number): number {
  function search(left: number, right: number): number {
    if (left > right) return -1;
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) return search(mid + 1, right);
    return search(left, mid - 1);
  }
  return search(0, arr.length - 1);
}

// O(n) - Space for recursion stack
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

### 3. Optimization Strategies

#### Strategy 1: Hash Maps for Lookups
```typescript
// ❌ O(n²) - Inefficient
function twoSum(arr: number[], target: number): [number, number] | null {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) return [arr[i], arr[j]];
    }
  }
  return null;
}

// ✅ O(n) - Optimized with hash map
function twoSum(arr: number[], target: number): [number, number] | null {
  const seen = new Set<number>();
  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) return [complement, num];
    seen.add(num);
  }
  return null;
}
```

#### Strategy 2: Sorting for Problems Requiring Order
```typescript
// Problem: Find triplets that sum to target
// ❌ O(n³) - Brute force
function threeSumBrute(arr: number[], target: number): number[][] {
  const results: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      for (let k = j + 1; k < arr.length; k++) {
        if (arr[i] + arr[j] + arr[k] === target) {
          results.push([arr[i], arr[j], arr[k]]);
        }
      }
    }
  }
  return results;
}

// ✅ O(n²) - Optimized with sorting + two pointers
function threeSum(arr: number[], target: number): number[][] {
  arr.sort((a, b) => a - b);
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
```

#### Strategy 3: Memoization for Overlapping Subproblems
```typescript
// ❌ O(2ⁿ) - Exponential
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// ✅ O(n) - Memoized
function fibonacci(n: number): number {
  const memo = new Map<number, number>();

  function fib(num: number): number {
    if (num <= 1) return num;
    if (memo.has(num)) return memo.get(num)!;

    const result = fib(num - 1) + fib(num - 2);
    memo.set(num, result);
    return result;
  }

  return fib(n);
}
```

#### Strategy 4: Two Pointers for Sorted Data
```typescript
// Find target sum in sorted array - O(n)
function twoPointerSum(arr: number[], target: number): [number, number] | null {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [arr[left], arr[right]];
    if (sum < target) left++;
    else right--;
  }

  return null;
}
```

### 4. Space-Time Tradeoff

```typescript
// Time-optimized: O(1) space, O(n²) time
function containsDuplicate_SpaceOptimized(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// Space-optimized: O(n) space, O(n) time
function containsDuplicate_TimeOptimized(arr: number[]): boolean {
  return new Set(arr).size !== arr.length;
}

// Choose based on constraints:
// - Limited memory? Use space-optimized
// - Time-critical? Use time-optimized
```

### 5. Complexity Reduction Checklist

When stuck with inefficient solution:

**1. Can I use a data structure?**
- Hash map/Set for O(n) lookup
- Heap for priority
- Tree for sorted data

**2. Can I preprocess data?**
- Sort first (O(n log n)) to enable two pointers
- Build indices
- Create lookup tables

**3. Can I use dynamic programming?**
- Are there overlapping subproblems?
- Optimal substructure property?

**4. Can I reduce scope?**
- Binary search to skip half the data
- Early termination conditions
- Skip unnecessary iterations

**5. Can I parallelize?**
- Independent subproblems
- Tree/graph traversal
- Sorting with multiple threads

### 6. Interview Complexity Discussion Template

```
"Let me analyze the complexity:

Current solution:
- Time: O(n²) because [explain why]
- Space: O(n) because [explain why]

For optimization:
- The bottleneck is [identify bottleneck]
- I can improve this by [suggest approach]

With the optimization:
- Time: O(n log n) - [explain how]
- Space: O(1) - [explain why it's constant]

This is O(n log n) because [final explanation]

Trade-offs:
- Benefit: Faster solution
- Cost: Slightly more complex code
- Net: Worth it because [justify]"
```

## Learning Outcomes
- Analyze time and space complexity accurately
- Identify optimization opportunities
- Know when to trade space for time
- Recognize complexity patterns
- Explain complexity clearly in interviews

## Resources
- [Big O Cheat Sheet](https://www.bigocheatsheet.com/)
- [Complexity Analysis in Algorithms](https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/)
