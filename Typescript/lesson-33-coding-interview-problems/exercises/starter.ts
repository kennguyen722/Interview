// ============================================================================
// LESSON 33: CODING INTERVIEW PROBLEMS - EXERCISES
// ============================================================================

/**
 * EXERCISE 1: FizzBuzz
 * Difficulty: Easy
 * Companies: Amazon, Microsoft
 * 
 * Print numbers 1 to n:
 * - "Fizz" for multiples of 3
 * - "Buzz" for multiples of 5
 * - "FizzBuzz" for multiples of both
 * - Otherwise print the number
 */

export function fizzBuzz(n: number): string[] {
  // TODO: Implement FizzBuzz
  return [];
}

/**
 * EXERCISE 2: Valid Parentheses
 * Difficulty: Easy
 * Companies: Amazon, Facebook, Microsoft
 * 
 * Check if string has valid parentheses: (), {}, []
 * Input: "()[]{}" -> Output: true
 * Input: "([)]" -> Output: false
 */

export function isValid(s: string): boolean {
  // TODO: Use a stack to match opening/closing brackets
  return false;
}

/**
 * EXERCISE 3: Merge Two Sorted Arrays
 * Difficulty: Easy
 * Companies: Facebook, Microsoft
 * 
 * Merge nums2 into nums1 (nums1 has enough space)
 * Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
 * Output: [1,2,2,3,5,6]
 */

export function merge(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  // TODO: Merge from end to avoid shifting
}

/**
 * EXERCISE 4: First Unique Character
 * Difficulty: Easy
 * Companies: Amazon, Bloomberg
 * 
 * Find first non-repeating character index
 * Input: "leetcode" -> Output: 0
 * Input: "loveleetcode" -> Output: 2
 */

export function firstUniqChar(s: string): number {
  // TODO: Use hash map for frequencies
  return -1;
}

/**
 * EXERCISE 5: Single Number
 * Difficulty: Easy
 * Companies: Amazon, Apple
 * 
 * Every element appears twice except one. Find it.
 * Must be O(n) time and O(1) space.
 * Input: [2,2,1] -> Output: 1
 * Input: [4,1,2,1,2] -> Output: 4
 */

export function singleNumber(nums: number[]): number {
  // TODO: Use XOR - duplicates cancel out
  return 0;
}

/**
 * EXERCISE 6: Move Zeroes
 * Difficulty: Easy
 * Companies: Facebook, Apple
 * 
 * Move all zeros to end while maintaining order
 * Input: [0,1,0,3,12] -> Output: [1,3,12,0,0]
 */

export function moveZeroes(nums: number[]): void {
  // TODO: Two pointers - one for non-zero position
}

/**
 * EXERCISE 7: Contains Duplicate
 * Difficulty: Easy
 * Companies: Amazon, Apple
 * 
 * Check if array has duplicates
 * Input: [1,2,3,1] -> Output: true
 * Input: [1,2,3,4] -> Output: false
 */

export function containsDuplicate(nums: number[]): boolean {
  // TODO: Use Set for O(1) lookup
  return false;
}

/**
 * EXERCISE 8: Intersection of Two Arrays
 * Difficulty: Easy
 * Companies: Facebook, LinkedIn
 * 
 * Find intersection (unique elements present in both)
 * Input: [1,2,2,1], [2,2] -> Output: [2]
 */

export function intersection(nums1: number[], nums2: number[]): number[] {
  // TODO: Use Set intersection
  return [];
}

/**
 * EXERCISE 9: Plus One
 * Difficulty: Easy
 * Companies: Google, Uber
 * 
 * Add 1 to large number represented as array
 * Input: [1,2,3] -> Output: [1,2,4]
 * Input: [9,9,9] -> Output: [1,0,0,0]
 */

export function plusOne(digits: number[]): number[] {
  // TODO: Handle carry propagation
  return [];
}

/**
 * EXERCISE 10: Majority Element
 * Difficulty: Easy
 * Companies: Amazon, Microsoft
 * 
 * Find element appearing more than n/2 times (guaranteed to exist)
 * Input: [3,2,3] -> Output: 3
 * Input: [2,2,1,1,1,2,2] -> Output: 2
 */

export function majorityElement(nums: number[]): number {
  // TODO: Boyer-Moore Voting Algorithm or hash map
  return 0;
}

/**
 * EXERCISE 11: Reverse String
 * Difficulty: Easy
 * Companies: Amazon, Microsoft
 * 
 * Reverse string in-place
 * Input: ["h","e","l","l","o"] -> ["o","l","l","e","h"]
 */

export function reverseString(s: string[]): void {
  // TODO: Two pointers from both ends
}

/**
 * EXERCISE 12: Best Time to Buy and Sell Stock
 * Difficulty: Easy
 * Companies: Amazon, Facebook, Google
 * 
 * Find maximum profit (buy before sell)
 * Input: [7,1,5,3,6,4] -> Output: 5 (buy at 1, sell at 6)
 * Input: [7,6,4,3,1] -> Output: 0
 */

export function maxProfit(prices: number[]): number {
  // TODO: Track minimum price and max profit
  return 0;
}

/**
 * EXERCISE 13: Remove Duplicates from Sorted Array
 * Difficulty: Easy
 * Companies: Amazon, Microsoft
 * 
 * Remove duplicates in-place, return new length
 * Input: [1,1,2] -> Output: 2, nums = [1,2,_]
 */

export function removeDuplicates(nums: number[]): number {
  // TODO: Two pointers
  return 0;
}

/**
 * EXERCISE 14: Find Peak Element
 * Difficulty: Medium
 * Companies: Amazon, Google, Facebook
 * 
 * Find any peak element (greater than neighbors)
 * Input: [1,2,3,1] -> Output: 2 (index where element is 3)
 */

export function findPeakElement(nums: number[]): number {
  // TODO: Binary search
  return -1;
}

/**
 * EXERCISE 15: 3Sum
 * Difficulty: Medium
 * Companies: Amazon, Facebook, Microsoft
 * 
 * Find all unique triplets that sum to zero
 * Input: [-1,0,1,2,-1,-4] -> Output: [[-1,-1,2],[-1,0,1]]
 */

export function threeSum(nums: number[]): number[][] {
  // TODO: Sort + two pointers for each element
  return [];
}

/**
 * EXERCISE 16: Search in Rotated Sorted Array
 * Difficulty: Medium
 * Companies: Amazon, Microsoft, Facebook
 * 
 * Binary search in rotated array
 * Input: nums = [4,5,6,7,0,1,2], target = 0 -> Output: 4
 */

export function search(nums: number[], target: number): number {
  // TODO: Modified binary search
  return -1;
}

/**
 * EXERCISE 17: Subarray Sum Equals K
 * Difficulty: Medium
 * Companies: Facebook, Amazon
 * 
 * Count subarrays with sum = k
 * Input: [1,1,1], k = 2 -> Output: 2
 */

export function subarraySum(nums: number[], k: number): number {
  // TODO: Prefix sum + hash map
  return 0;
}

/**
 * EXERCISE 18: Lowest Common Ancestor of BST
 * Difficulty: Easy
 * Companies: Amazon, Microsoft, Facebook
 * 
 * Find LCA in binary search tree
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
  // TODO: Use BST property (left < root < right)
  return null;
}

/**
 * EXERCISE 19: Kth Largest Element
 * Difficulty: Medium
 * Companies: Amazon, Facebook, LinkedIn
 * 
 * Find kth largest element in array
 * Input: [3,2,1,5,6,4], k = 2 -> Output: 5
 */

export function findKthLargest(nums: number[], k: number): number {
  // TODO: Min heap of size k OR quickselect
  return 0;
}

/**
 * EXERCISE 20: Word Break
 * Difficulty: Medium
 * Companies: Amazon, Google, Facebook
 * 
 * Check if string can be segmented into dictionary words
 * Input: s = "leetcode", wordDict = ["leet","code"] -> Output: true
 */

export function wordBreak(s: string, wordDict: string[]): boolean {
  // TODO: Dynamic programming
  return false;
}

/**
 * EXERCISE 21: Longest Palindromic Substring
 * Difficulty: Medium
 * Companies: Amazon, Microsoft, Facebook
 * 
 * Find longest palindromic substring
 * Input: "babad" -> Output: "bab" or "aba"
 */

export function longestPalindrome(s: string): string {
  // TODO: Expand around center
  return "";
}

/**
 * EXERCISE 22: Valid Sudoku
 * Difficulty: Medium
 * Companies: Amazon, Apple, Microsoft
 * 
 * Validate partially filled 9x9 Sudoku board
 */

export function isValidSudoku(board: string[][]): boolean {
  // TODO: Check rows, cols, 3x3 boxes with Sets
  return false;
}

/**
 * EXERCISE 23: Top K Frequent Elements
 * Difficulty: Medium
 * Companies: Amazon, Facebook, Yelp
 * 
 * Find k most frequent elements
 * Input: [1,1,1,2,2,3], k = 2 -> Output: [1,2]
 */

export function topKFrequent(nums: number[], k: number): number[] {
  // TODO: Hash map + bucket sort or heap
  return [];
}

/**
 * EXERCISE 24: Generate Parentheses
 * Difficulty: Medium
 * Companies: Amazon, Microsoft, Google
 * 
 * Generate all valid combinations of n pairs of parentheses
 * Input: n = 3 -> Output: ["((()))","(()())","(())()","()(())","()()()"]
 */

export function generateParenthesis(n: number): string[] {
  // TODO: Backtracking
  return [];
}

/**
 * EXERCISE 25: Min Stack
 * Difficulty: Easy
 * Companies: Amazon, Bloomberg
 * 
 * Stack that supports push, pop, top, and getMin in O(1)
 */

export class MinStack {
  // TODO: Use two stacks or store pairs
  
  constructor() {
    // Initialize
  }

  push(val: number): void {
    // TODO
  }

  pop(): void {
    // TODO
  }

  top(): number {
    // TODO
    return 0;
  }

  getMin(): number {
    // TODO
    return 0;
  }
}

/**
 * EXERCISE 26: Implement Trie (Prefix Tree)
 * Difficulty: Medium
 * Companies: Amazon, Google, Microsoft
 * 
 * Implement trie with insert, search, and startsWith
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
  // TODO: Implement prefix tree
  
  constructor() {
    // Initialize
  }

  insert(word: string): void {
    // TODO
  }

  search(word: string): boolean {
    // TODO
    return false;
  }

  startsWith(prefix: string): boolean {
    // TODO
    return false;
  }
}

/**
 * EXERCISE 27: Course Schedule (Cycle Detection)
 * Difficulty: Medium
 * Companies: Amazon, Microsoft, Facebook
 * 
 * Check if can finish all courses (detect cycle in directed graph)
 * Input: numCourses = 2, prerequisites = [[1,0]] -> Output: true
 * Input: numCourses = 2, prerequisites = [[1,0],[0,1]] -> Output: false
 */

export function canFinish(
  numCourses: number,
  prerequisites: number[][]
): boolean {
  // TODO: DFS with visited states or topological sort
  return false;
}

/**
 * EXERCISE 28: Number of Islands
 * Difficulty: Medium
 * Companies: Amazon, Facebook, Microsoft
 * 
 * Count number of islands (1=land, 0=water)
 * Input: grid = [
 *   ["1","1","0","0","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","1","0","0"],
 *   ["0","0","0","1","1"]
 * ]
 * Output: 3
 */

export function numIslands(grid: string[][]): number {
  // TODO: DFS or BFS for each island
  return 0;
}

/**
 * EXERCISE 29: LRU Cache
 * Difficulty: Medium
 * Companies: Amazon, Facebook, Microsoft
 * 
 * Implement LRU Cache with O(1) get and put
 */

export class LRUCache {
  // TODO: Use Map (maintains insertion order) or doubly linked list + hash map
  
  constructor(capacity: number) {
    // Initialize
  }

  get(key: number): number {
    // TODO: Return value and mark as recently used
    return -1;
  }

  put(key: number, value: number): void {
    // TODO: Add/update and evict if over capacity
  }
}

/**
 * EXERCISE 30: Serialize and Deserialize Binary Tree
 * Difficulty: Hard
 * Companies: Amazon, Facebook, Google
 * 
 * Serialize tree to string and deserialize back
 */

export function serialize(root: TreeNode | null): string {
  // TODO: Level order or preorder with null markers
  return "";
}

export function deserialize(data: string): TreeNode | null {
  // TODO: Reconstruct tree from serialized string
  return null;
}

/**
 * ============================================================================
 * HARD PROBLEMS
 * ============================================================================
 */

/**
 * EXERCISE 31: Median of Two Sorted Arrays
 * Difficulty: Hard
 * Companies: Google, Facebook, Amazon
 * 
 * Find median in O(log(min(m,n))) time
 * Input: nums1 = [1,3], nums2 = [2] -> Output: 2.0
 * Input: nums1 = [1,2], nums2 = [3,4] -> Output: 2.5
 */

export function findMedianSortedArrays(
  nums1: number[],
  nums2: number[]
): number {
  // TODO: Binary search on smaller array
  return 0;
}

/**
 * EXERCISE 32: Word Ladder
 * Difficulty: Hard
 * Companies: Amazon, Facebook, Microsoft
 * 
 * Transform word changing one letter at a time
 * Input: beginWord = "hit", endWord = "cog", 
 *        wordList = ["hot","dot","dog","lot","log","cog"]
 * Output: 5 (hit -> hot -> dot -> dog -> cog)
 */

export function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[]
): number {
  // TODO: BFS with word transformations
  return 0;
}

/**
 * EXERCISE 33: N-Queens
 * Difficulty: Hard
 * Companies: Amazon, Microsoft, Google
 * 
 * Place N queens on N×N board so none attack each other
 * Input: n = 4 -> Output: 2 solutions
 */

export function solveNQueens(n: number): string[][] {
  // TODO: Backtracking with column/diagonal tracking
  return [];
}

/**
 * EXERCISE 34: Trapping Rain Water
 * Difficulty: Hard
 * Companies: Amazon, Bloomberg, Facebook
 * 
 * Calculate trapped water between bars
 * Input: [0,1,0,2,1,0,1,3,2,1,2,1] -> Output: 6
 */

export function trap(height: number[]): number {
  // TODO: Two pointers tracking left/right max
  return 0;
}

/**
 * EXERCISE 35: Regular Expression Matching
 * Difficulty: Hard
 * Companies: Facebook, Google, Uber
 * 
 * Implement regex with '.' and '*'
 * Input: s = "aa", p = "a*" -> Output: true
 * Input: s = "mississippi", p = "mis*is*p*." -> Output: false
 */

export function isMatch(s: string, p: string): boolean {
  // TODO: Dynamic programming
  return false;
}

/**
 * EXERCISE 36: Merge K Sorted Lists
 * Difficulty: Hard
 * Companies: Amazon, Microsoft, Google
 * 
 * Merge k sorted linked lists
 * Input: [[1,4,5],[1,3,4],[2,6]] -> Output: [1,1,2,3,4,4,5,6]
 */

export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // TODO: Min heap or divide and conquer
  return null;
}

/**
 * EXERCISE 37: Longest Valid Parentheses
 * Difficulty: Hard
 * Companies: Amazon, Uber
 * 
 * Find longest valid parentheses substring
 * Input: "(()" -> Output: 2
 * Input: ")()())" -> Output: 4
 */

export function longestValidParentheses(s: string): number {
  // TODO: DP or stack
  return 0;
}

/**
 * EXERCISE 38: Wildcard Matching
 * Difficulty: Hard
 * Companies: Facebook, Google
 * 
 * Implement wildcard with '?' and '*'
 * Input: s = "adceb", p = "*a*b" -> Output: true
 * Input: s = "acdcb", p = "a*c?b" -> Output: false
 */

export function isMatchWildcard(s: string, p: string): boolean {
  // TODO: DP with wildcard logic
  return false;
}

/**
 * EXERCISE 39: Sliding Window Maximum
 * Difficulty: Hard
 * Companies: Amazon, Google
 * 
 * Find maximum in each sliding window
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
 * Output: [3,3,5,5,6,7]
 */

export function maxSlidingWindow(nums: number[], k: number): number[] {
  // TODO: Deque to track maximums
  return [];
}

/**
 * EXERCISE 40: Edit Distance
 * Difficulty: Hard
 * Companies: Amazon, Google, Microsoft
 * 
 * Minimum operations to convert word1 to word2
 * Operations: insert, delete, replace
 * Input: word1 = "horse", word2 = "ros" -> Output: 3
 */

export function minDistance(word1: string, word2: string): number {
  // TODO: Dynamic programming
  return 0;
}

console.log("✅ All exercises defined!");
console.log("Implement each function and test with example inputs.");
console.log("Run tests with: npm test lesson-33");
console.log("\n📊 Total: 40 coding interview problems!");
console.log("- Easy: 13 problems");
console.log("- Medium: 17 problems");  
console.log("- Hard: 10 problems");
