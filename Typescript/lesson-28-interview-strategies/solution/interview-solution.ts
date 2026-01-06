// ============================================================================
// LESSON 28: INTERVIEW STRATEGIES - SOLUTION
// ============================================================================

/**
 * SOLUTION 1: Two Pointers Pattern
 */

// Problem: Find two numbers that add up to target
function twoSum(arr: number[], target: number): [number, number] | null {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [arr[left], arr[right]];
    if (sum < target) left++;
    else right--;
  }

  return null;
}

// Problem: Remove duplicates from sorted array
function removeDuplicates(arr: number[]): number {
  let j = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      j++;
      arr[j] = arr[i];
    }
  }

  return j + 1;
}

/**
 * SOLUTION 2: Sliding Window Pattern
 */

// Problem: Maximum sum of k consecutive elements
function maxSubarraySum(arr: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Problem: Longest substring without repeating characters
function lengthOfLongestSubstring(s: string): number {
  const charIndex = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (charIndex.has(char) && charIndex.get(char)! >= left) {
      left = charIndex.get(char)! + 1;
    }

    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * SOLUTION 3: Binary Search Pattern
 */

// Problem: Find target in sorted array
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

// Problem: First position of target
function searchFirstPosition(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

/**
 * SOLUTION 4: DFS/BFS Pattern
 */

// Problem: Binary tree traversal - DFS (Depth-First)
class TreeNode {
  constructor(public val: number, public left?: TreeNode, public right?: TreeNode) {}
}

function inorderTraversal(root: TreeNode | undefined): number[] {
  const result: number[] = [];

  function dfs(node: TreeNode | undefined) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// Problem: BFS - Level order traversal
function levelOrderTraversal(root: TreeNode | undefined): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const level: number[] = [];
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}

/**
 * SOLUTION 5: Dynamic Programming Pattern
 */

// Problem: Fibonacci with memoization
function fibonacci(n: number): number {
  const cache: Record<number, number> = {};

  function compute(n: number): number {
    if (n in cache) return cache[n];
    if (n <= 1) return n;

    cache[n] = compute(n - 1) + compute(n - 2);
    return cache[n];
  }

  return compute(n);
}

// Problem: Coin change
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * SOLUTION 6: Backtracking Pattern
 */

// Problem: Generate permutations
function permute(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(current: number[], remaining: number[]) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const num = remaining[i];
      current.push(num);
      const newRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
      backtrack(current, newRemaining);
      current.pop();
    }
  }

  backtrack([], nums);
  return result;
}

// Problem: Word search in grid
function wordSearch(board: string[][], word: string): boolean {
  function dfs(row: number, col: number, index: number): boolean {
    if (index === word.length) return true;
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return false;
    if (board[row][col] !== word[index]) return false;

    const char = board[row][col];
    board[row][col] = "*"; // Mark as visited

    const found =
      dfs(row + 1, col, index + 1) ||
      dfs(row - 1, col, index + 1) ||
      dfs(row, col + 1, index + 1) ||
      dfs(row, col - 1, index + 1);

    board[row][col] = char; // Restore

    return found;
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }

  return false;
}

/**
 * SOLUTION 7: Interview Communication Template
 */

const interviewTemplate = {
  step1_clarify: {
    questions: [
      "Can you give me an example input and expected output?",
      "Are there any constraints (size, time, space)?",
      "Is the input sorted? Unique elements? Positive/negative?",
    ],
  },

  step2_approach: {
    explanation: "Let me think about the approach...",
    steps: [
      "Brute force: Try every possibility (if time permits)",
      "Optimize: Can we use a data structure (Set, Map, Heap)?",
      "Pattern: Does this match a known pattern (two pointers, binary search)?",
      "Complexity: Time O(?), Space O(?)",
    ],
  },

  step3_code: {
    steps: [
      "Write clean, readable code",
      "Add comments for complex logic",
      "Handle edge cases",
      "Test with examples",
    ],
  },

  step4_test: {
    cases: [
      "Happy path: normal input",
      "Edge case: empty, single element",
      "Boundary: minimum, maximum",
      "Invalid: null, negative",
    ],
  },
};

/**
 * SOLUTION 8: Time Management Tips
 */

const timeManagement = {
  problem1: "5 min - Clarify the problem",
  problem2: "10 min - Discuss approach and complexity",
  problem3: "15-20 min - Write code",
  test: "5 min - Test with examples",
  optimize: "5 min - Discuss optimizations if time permits",
};

/**
 * SOLUTION 9: Mistake Avoidance
 */

const mistakesToAvoid = {
  rushing: "Don't start coding immediately - clarify first",
  silence: "Think out loud - explain your approach",
  panic: "It's okay to not know - work through it",
  edgeCases: "Always consider edge cases",
  complexity: "Always discuss time and space complexity",
  testing: "Test with examples before submitting",
};

/**
 * SOLUTION 10: Complex Problem Example
 */

// Problem: Merge k sorted lists
class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}

function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (!lists || lists.length === 0) return null;

  // Using min heap approach
  const minHeap: ListNode[] = [];

  // Add first node from each list to heap
  for (const list of lists) {
    if (list) minHeap.push(list);
  }

  // Sort by value
  minHeap.sort((a, b) => a.val - b.val);

  const dummy = new ListNode(0);
  let current = dummy;

  while (minHeap.length > 0) {
    // Get min node
    const min = minHeap.shift()!;
    current.next = min;
    current = current.next;

    // Add next node from same list
    if (min.next) {
      minHeap.push(min.next);
      minHeap.sort((a, b) => a.val - b.val);
    }
  }

  return dummy.next;
}

console.log("Interview Strategy Solutions:");
console.log("✓ Two Pointers: 2-sum, remove duplicates");
console.log("✓ Sliding Window: max subarray, longest substring");
console.log("✓ Binary Search: find element, first position");
console.log("✓ DFS/BFS: tree traversal, level order");
console.log("✓ Dynamic Programming: fibonacci, coin change");
console.log("✓ Backtracking: permutations, word search");
