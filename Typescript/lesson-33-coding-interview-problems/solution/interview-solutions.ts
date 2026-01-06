// ============================================================================
// LESSON 33: CODING INTERVIEW PROBLEMS - SOLUTIONS
// ============================================================================

/**
 * SOLUTION 1: FizzBuzz
 */
export function fizzBuzz(n: number): string[] {
  const result: string[] = [];

  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(i.toString());
    }
  }

  return result;
}

/**
 * SOLUTION 2: Valid Parentheses
 */
export function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}

/**
 * SOLUTION 3: Merge Two Sorted Arrays
 */
export function merge(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }

  while (j >= 0) {
    nums1[k] = nums2[j];
    j--;
    k--;
  }
}

/**
 * SOLUTION 4: First Unique Character
 */
export function firstUniqChar(s: string): number {
  const counts = new Map<string, number>();

  for (const char of s) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }

  return -1;
}

/**
 * SOLUTION 5: Single Number
 */
export function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    result ^= num; // XOR - duplicates cancel out
  }
  return result;
}

/**
 * SOLUTION 6: Move Zeroes
 */
export function moveZeroes(nums: number[]): void {
  let nonZeroPos = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[nonZeroPos], nums[i]] = [nums[i], nums[nonZeroPos]];
      nonZeroPos++;
    }
  }
}

/**
 * SOLUTION 7: Contains Duplicate
 */
export function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }

  return false;
}

/**
 * SOLUTION 8: Intersection of Two Arrays
 */
export function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const result = new Set<number>();

  for (const num of nums2) {
    if (set1.has(num)) {
      result.add(num);
    }
  }

  return Array.from(result);
}

/**
 * SOLUTION 9: Plus One
 */
export function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }

  return [1, ...digits];
}

/**
 * SOLUTION 10: Majority Element
 */
export function majorityElement(nums: number[]): number {
  // Boyer-Moore Voting Algorithm
  let candidate = nums[0];
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += num === candidate ? 1 : -1;
  }

  return candidate;
}

/**
 * SOLUTION 11: Reverse String
 */
export function reverseString(s: string[]): void {
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}

/**
 * SOLUTION 12: Best Time to Buy and Sell Stock
 */
export function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}

/**
 * SOLUTION 13: Remove Duplicates from Sorted Array
 */
export function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let writeIndex = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  return writeIndex;
}

/**
 * SOLUTION 14: Find Peak Element
 */
export function findPeakElement(nums: number[]): number {
  let left = 0,
    right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[mid + 1]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * SOLUTION 15: 3Sum
 */
export function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1,
      right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

/**
 * SOLUTION 16: Search in Rotated Sorted Array
 */
export function search(nums: number[], target: number): number {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

/**
 * SOLUTION 17: Subarray Sum Equals K
 */
export function subarraySum(nums: number[], k: number): number {
  const prefixSums = new Map<number, number>();
  prefixSums.set(0, 1);

  let sum = 0;
  let count = 0;

  for (const num of nums) {
    sum += num;

    if (prefixSums.has(sum - k)) {
      count += prefixSums.get(sum - k)!;
    }

    prefixSums.set(sum, (prefixSums.get(sum) || 0) + 1);
  }

  return count;
}

/**
 * SOLUTION 18: Lowest Common Ancestor of BST
 */
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

export function lowestCommonAncestorBST(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root) return null;

  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestorBST(root.left, p, q);
  }

  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestorBST(root.right, p, q);
  }

  return root;
}

/**
 * SOLUTION 19: Kth Largest Element
 */
export function findKthLargest(nums: number[], k: number): number {
  // Using quickselect for O(n) average time
  function partition(left: number, right: number, pivotIndex: number): number {
    const pivotValue = nums[pivotIndex];
    [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];

    let storeIndex = left;
    for (let i = left; i < right; i++) {
      if (nums[i] < pivotValue) {
        [nums[storeIndex], nums[i]] = [nums[i], nums[storeIndex]];
        storeIndex++;
      }
    }

    [nums[right], nums[storeIndex]] = [nums[storeIndex], nums[right]];
    return storeIndex;
  }

  function select(left: number, right: number, kSmallest: number): number {
    if (left === right) return nums[left];

    const pivotIndex = Math.floor(Math.random() * (right - left + 1)) + left;
    const finalIndex = partition(left, right, pivotIndex);

    if (kSmallest === finalIndex) {
      return nums[finalIndex];
    } else if (kSmallest < finalIndex) {
      return select(left, finalIndex - 1, kSmallest);
    } else {
      return select(finalIndex + 1, right, kSmallest);
    }
  }

  return select(0, nums.length - 1, nums.length - k);
}

/**
 * SOLUTION 20: Word Break
 */
export function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}

/**
 * SOLUTION 21: Longest Palindromic Substring
 */
export function longestPalindrome(s: string): string {
  let longest = "";

  function expandAroundCenter(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const current = s.substring(left, right + 1);
      if (current.length > longest.length) {
        longest = current;
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i); // Odd length
    expandAroundCenter(i, i + 1); // Even length
  }

  return longest;
}

/**
 * SOLUTION 22: Valid Sudoku
 */
export function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = board[i][j];
      if (num === ".") continue;

      const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

      if (rows[i].has(num) || cols[j].has(num) || boxes[boxIndex].has(num)) {
        return false;
      }

      rows[i].add(num);
      cols[j].add(num);
      boxes[boxIndex].add(num);
    }
  }

  return true;
}

/**
 * SOLUTION 23: Top K Frequent Elements
 */
export function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const num of nums) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  // Bucket sort
  const buckets: number[][] = Array.from(
    { length: nums.length + 1 },
    () => []
  );

  for (const [num, freq] of counts) {
    buckets[freq].push(num);
  }

  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }

  return result.slice(0, k);
}

/**
 * SOLUTION 24: Generate Parentheses
 */
export function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  function backtrack(current: string, open: number, close: number): void {
    if (current.length === n * 2) {
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  }

  backtrack("", 0, 0);
  return result;
}

/**
 * SOLUTION 25: Min Stack
 */
export class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);

    const currentMin =
      this.minStack.length === 0
        ? val
        : Math.min(val, this.minStack[this.minStack.length - 1]);

    this.minStack.push(currentMin);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

/**
 * SOLUTION 26: Implement Trie
 */
class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;

  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }

    return node.isEnd;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }

    return true;
  }
}

/**
 * SOLUTION 27: Course Schedule
 */
export function canFinish(
  numCourses: number,
  prerequisites: number[][]
): boolean {
  const graph = Array.from({ length: numCourses }, () => [] as number[]);

  for (const [course, prereq] of prerequisites) {
    graph[course].push(prereq);
  }

  const UNVISITED = 0;
  const VISITING = 1;
  const VISITED = 2;

  const state = new Array(numCourses).fill(UNVISITED);

  function hasCycle(course: number): boolean {
    if (state[course] === VISITING) return true;
    if (state[course] === VISITED) return false;

    state[course] = VISITING;

    for (const prereq of graph[course]) {
      if (hasCycle(prereq)) return true;
    }

    state[course] = VISITED;
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }

  return true;
}

/**
 * SOLUTION 28: Number of Islands
 */
export function numIslands(grid: string[][]): number {
  if (!grid.length) return 0;

  let count = 0;

  function dfs(i: number, j: number): void {
    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      grid[i][j] === "0"
    ) {
      return;
    }

    grid[i][j] = "0"; // Mark as visited

    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1") {
        count++;
        dfs(i, j);
      }
    }
  }

  return count;
}

/**
 * SOLUTION 29: LRU Cache
 */
export class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value); // Move to end (most recent)

    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }
}

/**
 * SOLUTION 30: Serialize and Deserialize Binary Tree
 */
export function serialize(root: TreeNode | null): string {
  if (!root) return "null";

  const result: string[] = [];

  function preorder(node: TreeNode | null): void {
    if (!node) {
      result.push("null");
      return;
    }

    result.push(node.val.toString());
    preorder(node.left);
    preorder(node.right);
  }

  preorder(root);
  return result.join(",");
}

export function deserialize(data: string): TreeNode | null {
  const values = data.split(",");
  let index = 0;

  function buildTree(): TreeNode | null {
    if (index >= values.length || values[index] === "null") {
      index++;
      return null;
    }

    const node = new TreeNode(parseInt(values[index]));
    index++;

    node.left = buildTree();
    node.right = buildTree();

    return node;
  }

  return buildTree();
}

/**
 * ============================================================================
 * HARD PROBLEM SOLUTIONS
 * ============================================================================
 */

/**
 * SOLUTION 31: Median of Two Sorted Arrays
 */
export function findMedianSortedArrays(
  nums1: number[],
  nums2: number[]
): number {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  const m = nums1.length;
  const n = nums2.length;
  let left = 0,
    right = m;

  while (left <= right) {
    const partition1 = Math.floor((left + right) / 2);
    const partition2 = Math.floor((m + n + 1) / 2) - partition1;

    const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
    const minRight1 = partition1 === m ? Infinity : nums1[partition1];

    const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
    const minRight2 = partition2 === n ? Infinity : nums2[partition2];

    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 0) {
        return (
          (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2
        );
      } else {
        return Math.max(maxLeft1, maxLeft2);
      }
    } else if (maxLeft1 > minRight2) {
      right = partition1 - 1;
    } else {
      left = partition1 + 1;
    }
  }

  throw new Error("Input arrays are not sorted");
}

// Time: O(log(min(m,n))), Space: O(1)

/**
 * SOLUTION 32: Word Ladder
 */
export function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[]
): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const queue: [string, number][] = [[beginWord, 1]];
  const visited = new Set<string>([beginWord]);

  while (queue.length > 0) {
    const [word, level] = queue.shift()!;

    if (word === endWord) return level;

    for (let i = 0; i < word.length; i++) {
      const chars = word.split("");

      for (let c = 97; c <= 122; c++) {
        chars[i] = String.fromCharCode(c);
        const newWord = chars.join("");

        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, level + 1]);
        }
      }
    }
  }

  return 0;
}

// Time: O(M² × N), Space: O(M × N)

/**
 * SOLUTION 33: N-Queens
 */
export function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board: string[][] = Array.from({ length: n }, () => Array(n).fill("."));

  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();

  function backtrack(row: number): void {
    if (row === n) {
      result.push(board.map((r) => r.join("")));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }

      board[row][col] = "Q";
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);

      backtrack(row + 1);

      board[row][col] = ".";
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }

  backtrack(0);
  return result;
}

// Time: O(N!), Space: O(N²)

/**
 * SOLUTION 34: Trapping Rain Water
 */
export function trap(height: number[]): number {
  if (height.length === 0) return 0;

  let left = 0,
    right = height.length - 1;
  let leftMax = 0,
    rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }

  return water;
}

// Time: O(n), Space: O(1)

/**
 * SOLUTION 35: Regular Expression Matching
 */
export function isMatch(s: string, p: string): boolean {
  const m = s.length,
    n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(false)
  );

  dp[0][0] = true;

  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 2];
    }
  }

  function matches(s: string, p: string): boolean {
    return p === "." || s === p;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] =
          dp[i][j - 2] || (matches(s[i - 1], p[j - 2]) && dp[i - 1][j]);
      } else if (matches(s[i - 1], p[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}

// Time: O(m × n), Space: O(m × n)

/**
 * SOLUTION 36: Merge K Sorted Lists
 */
class MinHeap {
  private heap: ListNode[] = [];

  push(node: ListNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): ListNode | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].val <= this.heap[index].val) break;
      [this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent],
      ];
      index = parent;
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (
        left < this.heap.length &&
        this.heap[left].val < this.heap[smallest].val
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        this.heap[right].val < this.heap[smallest].val
      ) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }
}

export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap = new MinHeap();

  for (const head of lists) {
    if (head) heap.push(head);
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (heap.size() > 0) {
    const node = heap.pop()!;
    current.next = node;
    current = current.next;

    if (node.next) {
      heap.push(node.next);
    }
  }

  return dummy.next;
}

// Time: O(N log k), Space: O(k)

/**
 * SOLUTION 37: Longest Valid Parentheses
 */
export function longestValidParentheses(s: string): number {
  const n = s.length;
  const dp = new Array(n).fill(0);
  let maxLen = 0;

  for (let i = 1; i < n; i++) {
    if (s[i] === ")") {
      if (s[i - 1] === "(") {
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
      } else if (i - dp[i - 1] > 0 && s[i - dp[i - 1] - 1] === "(") {
        dp[i] =
          dp[i - 1] + 2 + (i - dp[i - 1] >= 2 ? dp[i - dp[i - 1] - 2] : 0);
      }

      maxLen = Math.max(maxLen, dp[i]);
    }
  }

  return maxLen;
}

// Time: O(n), Space: O(n)

/**
 * SOLUTION 38: Wildcard Matching
 * explanation: '?' matches any single character.
 * '*' matches any sequence of characters (including the empty sequence).
 * The matching should cover the entire input string (not partial).
 */
export function isMatchWildcard(s: string, p: string): boolean {
    const m = s.length,
        n = p.length;

    // DP table where dp[i][j] indicates if s[0..i-1] matches p[0..j-1]
    // Initialize a (m+1) x (n+1) table with false
    const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(false) 
  );

    dp[0][0] = true;

    // Handle patterns with '*' at the beginning
    // An empty string can match with patterns like '*', '**', '***', etc.
    // Fill the first row of the DP table
    // If p[j-1] is '*', it can match an empty sequence
    // so dp[0][j] = dp[0][j-1]
    for (let j = 1; j <= n; j++) {
        if (p[j - 1] === "*") {
        dp[0][j] = dp[0][j - 1];
        }
    }

    // Fill the DP table
    // Iterate through each character in s and p
    // Update the DP table based on the matching rules
    // If p[j-1] is '*', it can match zero characters (dp[i][j-1]) or one/more characters (dp[i-1][j])
    // If p[j-1] is '?' or matches s[i-1], we take the diagonal value dp[i-1][j-1]
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
        if (p[j - 1] === "*") {
            dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
        } else if (p[j - 1] === "?" || s[i - 1] === p[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
        }
        }
    }

    return dp[m][n];
}

// Time: O(m × n), Space: O(m × n)

/**
 * SOLUTION 39: Sliding Window Maximum
 */
export function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = []; // Store indices

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // Remove smaller elements
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

// Time: O(n), Space: O(k)

/**
 * SOLUTION 40: Edit Distance
 */
export function minDistance(word1: string, word2: string): number {
  const m = word1.length,
    n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // Delete
            dp[i][j - 1], // Insert
            dp[i - 1][j - 1] // Replace
          );
      }
    }
  }

  return dp[m][n];
}

// Time: O(m × n), Space: O(m × n)

console.log("✅ All solutions implemented!");
console.log("These are complete, production-ready solutions.");
console.log("Study the patterns and techniques used in each.");
console.log("\n📊 Total: 40 complete solutions!");
console.log("- Easy: 13 solutions");
console.log("- Medium: 17 solutions");
console.log("- Hard: 10 solutions");
