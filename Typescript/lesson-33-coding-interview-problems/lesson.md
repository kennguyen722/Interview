# Lesson 33: Common Coding Interview Problems

## Overview
Master the most frequently asked coding interview questions with detailed explanations, multiple approaches, and optimization strategies.

---

## 🎯 Learning Objectives
- Solve 30+ common coding interview problems
- Understand multiple solution approaches
- Optimize from brute force to optimal
- Recognize problem patterns quickly
- Implement clean, bug-free code under pressure

---

## 📚 Problem Categories

### 1. String Manipulation
### 2. Array Operations
### 3. Linked Lists
### 4. Trees and Graphs
### 5. Dynamic Programming
### 6. Matrix Problems
### 7. Sorting and Searching
### 8. Stack and Queue Problems

---

## 1. STRING MANIPULATION PROBLEMS

### Problem 1: Reverse Words in a String
**Difficulty**: Medium  
**Companies**: Amazon, Microsoft, Google

**Problem**: Given a string, reverse the order of words.

```typescript
Input: "the sky is blue"
Output: "blue is sky the"

Input: "  hello world  "
Output: "world hello"
```

**Approach 1: Split and Reverse (Easy)**
```typescript
function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(' ');
}

// Time: O(n), Space: O(n)
```

**Approach 2: Two Pointers (Optimal)**
```typescript
function reverseWords_TwoPointers(s: string): string {
  const chars = s.trim().split('');
  
  // Reverse entire string
  reverse(chars, 0, chars.length - 1);
  
  // Reverse each word
  let start = 0;
  for (let i = 0; i <= chars.length; i++) {
    if (i === chars.length || chars[i] === ' ') {
      reverse(chars, start, i - 1);
      start = i + 1;
    }
  }
  
  // Remove extra spaces
  return chars.join('').replace(/\s+/g, ' ').trim();
}

function reverse(arr: string[], left: number, right: number): void {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// Time: O(n), Space: O(n)
```

**Interview Tips**:
- Ask about leading/trailing spaces
- Clarify if multiple spaces should become one
- Consider in-place modification constraints

---

### Problem 2: Valid Palindrome
**Difficulty**: Easy  
**Companies**: Facebook, Microsoft

**Problem**: Check if string is palindrome (ignore non-alphanumeric, case-insensitive).

```typescript
Input: "A man, a plan, a canal: Panama"
Output: true

Input: "race a car"
Output: false
```

**Solution**:
```typescript
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  
  return true;
}

// Time: O(n), Space: O(n)
```

---

### Problem 3: Longest Substring Without Repeating Characters
**Difficulty**: Medium  
**Companies**: Amazon, Bloomberg, Adobe

**Problem**: Find length of longest substring without repeating characters.

```typescript
Input: "abcabcbb"
Output: 3 ("abc")

Input: "bbbbb"
Output: 1 ("b")

Input: "pwwkew"
Output: 3 ("wke")
```

**Solution: Sliding Window**
```typescript
function lengthOfLongestSubstring(s: string): number {
  const charIndex = new Map<string, number>();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // If char seen and within window, move left pointer
    if (charIndex.has(char) && charIndex.get(char)! >= left) {
      left = charIndex.get(char)! + 1;
    }
    
    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// Time: O(n), Space: O(min(n, m)) where m is charset size
```

---

### Problem 4: Group Anagrams
**Difficulty**: Medium  
**Companies**: Amazon, Facebook, Uber

**Problem**: Group strings that are anagrams.

```typescript
Input: ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

**Solution**:
```typescript
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  
  for (const str of strs) {
    // Sort string as key
    const key = str.split('').sort().join('');
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(str);
  }
  
  return Array.from(groups.values());
}

// Time: O(n * k log k) where k is max string length
// Space: O(n * k)
```

---

## 2. ARRAY OPERATIONS

### Problem 5: Rotate Array
**Difficulty**: Medium  
**Companies**: Microsoft, Amazon

**Problem**: Rotate array to right by k steps.

```typescript
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
```

**Solution: Reverse Three Times**
```typescript
function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  
  // Reverse entire array
  reverse(nums, 0, nums.length - 1);
  
  // Reverse first k elements
  reverse(nums, 0, k - 1);
  
  // Reverse remaining elements
  reverse(nums, k, nums.length - 1);
}

function reverse(arr: number[], left: number, right: number): void {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// Time: O(n), Space: O(1)
```

---

### Problem 6: Find Missing Number
**Difficulty**: Easy  
**Companies**: Amazon, Microsoft

**Problem**: Array contains n distinct numbers from 0 to n. Find missing number.

```typescript
Input: [3,0,1]
Output: 2

Input: [9,6,4,2,3,5,7,0,1]
Output: 8
```

**Solution 1: Math (Sum)**
```typescript
function missingNumber_Math(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}

// Time: O(n), Space: O(1)
```

**Solution 2: XOR (Optimal)**
```typescript
function missingNumber_XOR(nums: number[]): number {
  let missing = nums.length;
  
  for (let i = 0; i < nums.length; i++) {
    missing ^= i ^ nums[i];
  }
  
  return missing;
}

// Time: O(n), Space: O(1)
// XOR properties: a ^ a = 0, a ^ 0 = a
```

---

### Problem 7: Product of Array Except Self
**Difficulty**: Medium  
**Companies**: Amazon, Microsoft, Facebook

**Problem**: Return array where output[i] = product of all elements except nums[i]. No division allowed.

```typescript
Input: [1,2,3,4]
Output: [24,12,8,6]
```

**Solution: Left and Right Products**
```typescript
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n);
  
  // Left products
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }
  
  // Right products
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  
  return result;
}

// Time: O(n), Space: O(1) excluding output
```

---

### Problem 8: Maximum Subarray Sum (Kadane's Algorithm)
**Difficulty**: Easy  
**Companies**: Amazon, Microsoft, LinkedIn

**Problem**: Find contiguous subarray with largest sum.

```typescript
Input: [-2,1,-3,4,-1,2,1,-5,4]
Output: 6  (subarray [4,-1,2,1])
```

**Solution**:
```typescript
function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // Either extend current subarray or start new
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// Time: O(n), Space: O(1)
// This is Kadane's Algorithm!
```

---

### Problem 9: Container With Most Water
**Difficulty**: Medium  
**Companies**: Amazon, Facebook, Bloomberg

**Problem**: Find two lines that form container with most water.

```typescript
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
```

**Solution: Two Pointers**
```typescript
function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  
  while (left < right) {
    const width = right - left;
    const minHeight = Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, width * minHeight);
    
    // Move pointer with smaller height
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxArea;
}

// Time: O(n), Space: O(1)
```

---

## 3. LINKED LIST PROBLEMS

### Problem 10: Reverse Linked List
**Difficulty**: Easy  
**Companies**: Amazon, Microsoft, Facebook

**Problem**: Reverse a singly linked list.

```typescript
Input: 1 -> 2 -> 3 -> 4 -> 5 -> null
Output: 5 -> 4 -> 3 -> 2 -> 1 -> null
```

**Solution 1: Iterative**
```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;
  
  while (current !== null) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  
  return prev;
}

// Time: O(n), Space: O(1)
```

**Solution 2: Recursive**
```typescript
function reverseList_Recursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  
  const newHead = reverseList_Recursive(head.next);
  head.next.next = head;
  head.next = null;
  
  return newHead;
}

// Time: O(n), Space: O(n) due to recursion stack
```

---

### Problem 11: Detect Cycle in Linked List
**Difficulty**: Easy  
**Companies**: Amazon, Microsoft, Google

**Problem**: Detect if linked list has a cycle.

**Solution: Floyd's Cycle Detection (Tortoise and Hare)**
```typescript
function hasCycle(head: ListNode | null): boolean {
  if (!head) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
    
    if (slow === fast) return true;
  }
  
  return false;
}

// Time: O(n), Space: O(1)
```

---

### Problem 12: Merge Two Sorted Lists
**Difficulty**: Easy  
**Companies**: Amazon, Microsoft, LinkedIn

**Problem**: Merge two sorted linked lists.

```typescript
Input: l1 = 1->2->4, l2 = 1->3->4
Output: 1->1->2->3->4->4
```

**Solution**:
```typescript
function mergeTwoLists(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  // Attach remaining
  current.next = l1 || l2;
  
  return dummy.next;
}

// Time: O(n + m), Space: O(1)
```

---

## 4. TREE PROBLEMS

### Problem 13: Maximum Depth of Binary Tree
**Difficulty**: Easy  
**Companies**: Amazon, Microsoft, LinkedIn

**Solution**:
```typescript
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

function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Time: O(n), Space: O(h) where h is height
```

---

### Problem 14: Validate Binary Search Tree
**Difficulty**: Medium  
**Companies**: Amazon, Microsoft, Facebook

**Solution**:
```typescript
function isValidBST(
  root: TreeNode | null,
  min = -Infinity,
  max = Infinity
): boolean {
  if (!root) return true;
  
  if (root.val <= min || root.val >= max) return false;
  
  return (
    isValidBST(root.left, min, root.val) &&
    isValidBST(root.right, root.val, max)
  );
}

// Time: O(n), Space: O(h)
```

---

### Problem 15: Lowest Common Ancestor
**Difficulty**: Medium  
**Companies**: Facebook, Amazon, Microsoft

**Solution**:
```typescript
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root || root === p || root === q) return root;
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root;
  return left || right;
}

// Time: O(n), Space: O(h)
```

---

## 5. DYNAMIC PROGRAMMING

### Problem 16: Climbing Stairs
**Difficulty**: Easy  
**Companies**: Amazon, Google, Adobe

**Problem**: How many ways to climb n stairs (1 or 2 steps at a time)?

```typescript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1, prev1 = 2;
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// Time: O(n), Space: O(1)
// This is actually Fibonacci!
```

---

### Problem 17: House Robber
**Difficulty**: Medium  
**Companies**: Amazon, Google, LinkedIn

**Problem**: Rob houses to maximize money without robbing adjacent houses.

```typescript
Input: [2,7,9,3,1]
Output: 12 (rob house 0, 2, 4)
```

**Solution**:
```typescript
function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  let prev2 = 0, prev1 = 0;
  
  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// Time: O(n), Space: O(1)
```

---

### Problem 18: Coin Change
**Difficulty**: Medium  
**Companies**: Amazon, Microsoft, Uber

**Problem**: Minimum coins to make amount.

```typescript
Input: coins = [1,2,5], amount = 11
Output: 3 (5 + 5 + 1)
```

**Solution**:
```typescript
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

// Time: O(amount * coins), Space: O(amount)
```

---

## 6. MATRIX PROBLEMS

### Problem 19: Rotate Matrix 90 Degrees
**Difficulty**: Medium  
**Companies**: Amazon, Microsoft, Apple

**Problem**: Rotate n×n matrix 90 degrees clockwise.

```typescript
Input: [[1,2,3],
        [4,5,6],
        [7,8,9]]
        
Output: [[7,4,1],
         [8,5,2],
         [9,6,3]]
```

**Solution**:
```typescript
function rotate(matrix: number[][]): void {
  const n = matrix.length;
  
  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}

// Time: O(n²), Space: O(1)
```

---

### Problem 20: Spiral Matrix
**Difficulty**: Medium  
**Companies**: Amazon, Microsoft, Google

**Problem**: Return elements in spiral order.

```typescript
Input: [[1,2,3],
        [4,5,6],
        [7,8,9]]
        
Output: [1,2,3,6,9,8,7,4,5]
```

**Solution**:
```typescript
function spiralOrder(matrix: number[][]): number[] {
  if (!matrix.length) return [];
  
  const result: number[] = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    // Right
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;
    
    // Down
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;
    
    // Left
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }
    
    // Up
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }
  
  return result;
}

// Time: O(m * n), Space: O(1) excluding output
```

---

## 7. HARD PROBLEMS

### Problem 21: Median of Two Sorted Arrays
**Difficulty**: Hard  
**Companies**: Google, Facebook, Amazon

**Problem**: Find median of two sorted arrays in O(log(min(m,n))) time.

```typescript
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0

Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.5
```

**Solution: Binary Search**
```typescript
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Ensure nums1 is the smaller array
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  
  const m = nums1.length;
  const n = nums2.length;
  let left = 0, right = m;
  
  while (left <= right) {
    const partition1 = Math.floor((left + right) / 2);
    const partition2 = Math.floor((m + n + 1) / 2) - partition1;
    
    const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
    const minRight1 = partition1 === m ? Infinity : nums1[partition1];
    
    const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
    const minRight2 = partition2 === n ? Infinity : nums2[partition2];
    
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      // Found correct partition
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
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
```

**Key Insights**:
- Binary search on smaller array
- Partition both arrays such that left half has same size as right half
- Elements in left half must be ≤ elements in right half

---

### Problem 22: Word Ladder
**Difficulty**: Hard  
**Companies**: Amazon, Facebook, Microsoft

**Problem**: Transform beginWord to endWord changing one letter at a time, each intermediate word must be in dictionary.

```typescript
Input: 
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]

Output: 5
Explanation: "hit" -> "hot" -> "dot" -> "dog" -> "cog"
```

**Solution: BFS**
```typescript
function ladderLength(
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
    
    // Try changing each character
    for (let i = 0; i < word.length; i++) {
      const chars = word.split('');
      
      for (let c = 97; c <= 122; c++) { // 'a' to 'z'
        chars[i] = String.fromCharCode(c);
        const newWord = chars.join('');
        
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, level + 1]);
        }
      }
    }
  }
  
  return 0;
}

// Time: O(M² × N) where M is word length, N is wordList size
// Space: O(M × N)
```

**Optimization: Bidirectional BFS**
```typescript
function ladderLength_Bidirectional(
  beginWord: string,
  endWord: string,
  wordList: string[]
): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  
  let beginSet = new Set([beginWord]);
  let endSet = new Set([endWord]);
  const visited = new Set<string>();
  let level = 1;
  
  while (beginSet.size > 0 && endSet.size > 0) {
    // Always expand smaller set
    if (beginSet.size > endSet.size) {
      [beginSet, endSet] = [endSet, beginSet];
    }
    
    const nextSet = new Set<string>();
    
    for (const word of beginSet) {
      for (let i = 0; i < word.length; i++) {
        const chars = word.split('');
        
        for (let c = 97; c <= 122; c++) {
          chars[i] = String.fromCharCode(c);
          const newWord = chars.join('');
          
          if (endSet.has(newWord)) {
            return level + 1;
          }
          
          if (wordSet.has(newWord) && !visited.has(newWord)) {
            visited.add(newWord);
            nextSet.add(newWord);
          }
        }
      }
    }
    
    beginSet = nextSet;
    level++;
  }
  
  return 0;
}

// Time: O(M² × N), Space: O(M × N)
// Faster in practice due to bidirectional search
```

---

### Problem 23: N-Queens
**Difficulty**: Hard  
**Companies**: Amazon, Microsoft, Google

**Problem**: Place N queens on N×N chessboard so no two queens attack each other.

```typescript
Input: n = 4
Output: [
  [".Q..",  // Solution 1
   "...Q",
   "Q...",
   "..Q."],
   
  ["..Q.",  // Solution 2
   "Q...",
   "...Q",
   ".Q.."]
]
```

**Solution: Backtracking**
```typescript
function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board: string[][] = Array.from({ length: n }, () => 
    Array(n).fill('.')
  );
  
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // row - col
  const diag2 = new Set<number>(); // row + col
  
  function backtrack(row: number): void {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      
      // Place queen
      board[row][col] = 'Q';
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      
      backtrack(row + 1);
      
      // Remove queen
      board[row][col] = '.';
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }
  
  backtrack(0);
  return result;
}

// Time: O(N!), Space: O(N²)
```

**Key Insights**:
- Use sets to track attacked columns and diagonals
- Diagonal 1: `row - col` is constant
- Diagonal 2: `row + col` is constant
- Backtrack when no valid position found

---

### Problem 24: Trapping Rain Water
**Difficulty**: Hard  
**Companies**: Amazon, Bloomberg, Facebook

**Problem**: Calculate how much water can be trapped after raining.

```typescript
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```

**Solution 1: Two Pointers (Optimal)**
```typescript
function trap(height: number[]): number {
  if (height.length === 0) return 0;
  
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
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
```

---

### Problem 25: Regular Expression Matching
**Difficulty**: Hard  
**Companies**: Facebook, Google, Uber

**Problem**: Implement regex matching with '.' and '*'.

```typescript
Input: s = "aa", p = "a*"
Output: true

Input: s = "mississippi", p = "mis*is*p*."
Output: false
```

**Solution: Dynamic Programming**
```typescript
function isMatch(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => 
    Array(n + 1).fill(false)
  );
  
  dp[0][0] = true;
  
  // Handle patterns like a*, a*b*, a*b*c*
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        // Zero occurrences or one+ occurrences
        dp[i][j] = dp[i][j - 2] || 
          (matches(s[i - 1], p[j - 2]) && dp[i - 1][j]);
      } else if (matches(s[i - 1], p[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  
  return dp[m][n];
}

function matches(s: string, p: string): boolean {
  return p === '.' || s === p;
}

// Time: O(m × n), Space: O(m × n)
```

---

### Problem 26: Merge K Sorted Lists
**Difficulty**: Hard  
**Companies**: Amazon, Microsoft, Google

**Problem**: Merge k sorted linked lists into one sorted list.

```typescript
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
```

**Solution: Min Heap**
```typescript
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
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }
  
  private bubbleDown(index: number): void {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      
      if (left < this.heap.length && 
          this.heap[left].val < this.heap[smallest].val) {
        smallest = left;
      }
      
      if (right < this.heap.length && 
          this.heap[right].val < this.heap[smallest].val) {
        smallest = right;
      }
      
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap = new MinHeap();
  
  // Add first node from each list
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

// Time: O(N log k) where N is total nodes, k is number of lists
// Space: O(k)
```

---

### Problem 27: Longest Valid Parentheses
**Difficulty**: Hard  
**Companies**: Amazon, Uber

**Problem**: Find length of longest valid parentheses substring.

```typescript
Input: "(()"
Output: 2

Input: ")()())"
Output: 4
```

**Solution: Dynamic Programming**
```typescript
function longestValidParentheses(s: string): number {
  const n = s.length;
  const dp = new Array(n).fill(0);
  let maxLen = 0;
  
  for (let i = 1; i < n; i++) {
    if (s[i] === ')') {
      if (s[i - 1] === '(') {
        // Case: ...()
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
      } else if (i - dp[i - 1] > 0 && s[i - dp[i - 1] - 1] === '(') {
        // Case: ...))
        dp[i] = dp[i - 1] + 2 + 
          (i - dp[i - 1] >= 2 ? dp[i - dp[i - 1] - 2] : 0);
      }
      
      maxLen = Math.max(maxLen, dp[i]);
    }
  }
  
  return maxLen;
}

// Time: O(n), Space: O(n)
```

---

### Problem 28: Wildcard Matching
**Difficulty**: Hard  
**Companies**: Facebook, Google

**Problem**: Implement wildcard matching with '?' and '*'.

```typescript
Input: s = "adceb", p = "*a*b"
Output: true

Input: s = "acdcb", p = "a*c?b"
Output: false
```

**Solution: Dynamic Programming**
```typescript
function isMatch_Wildcard(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => 
    Array(n + 1).fill(false)
  );
  
  dp[0][0] = true;
  
  // Handle leading *
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 1];
    }
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        // Match zero or more characters
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  
  return dp[m][n];
}

// Time: O(m × n), Space: O(m × n)
```

---

## Interview Communication Template

When solving these problems in interviews:

### 1. Clarify (2-3 minutes)
```
"Let me make sure I understand:
- What's the expected input format?
- Are there any constraints? (size, values, edge cases)
- What should I return for invalid inputs?
- Can you give me an example?"
```

### 2. Approach (5 minutes)
```
"Here's my approach:
1. First, the brute force solution is... [explain]
   - Time complexity: O(?)
   - Space complexity: O(?)
   
2. We can optimize by... [explain optimization]
   - Improved complexity: O(?)
   
3. I'll implement the optimized version."
```

### 3. Code (15-20 minutes)
- Write clean, readable code
- Add comments for complex logic
- Handle edge cases
- Use meaningful variable names

### 4. Test (5 minutes)
```
"Let me test with:
- Normal case: [example]
- Edge case: empty input
- Edge case: single element
- Edge case: large input"
```

---

## Common Patterns Summary

| Pattern | When to Use | Example Problems |
|---------|-------------|------------------|
| Two Pointers | Sorted array, palindrome | Two Sum, Container With Water |
| Sliding Window | Substring, subarray | Longest Substring |
| Hash Map | Frequency, lookup | Group Anagrams |
| Binary Search | Sorted data | Search in Rotated Array |
| DFS/BFS | Trees, graphs | Max Depth, Level Order |
| Dynamic Programming | Optimization, counting | Coin Change, House Robber |
| Backtracking | Combinations, permutations | N-Queens, Word Search |
| Fast & Slow Pointers | Linked list cycle | Detect Cycle |

---

## Complexity Quick Reference

```typescript
O(1)        - Hash map lookup, array access
O(log n)    - Binary search, balanced tree ops
O(n)        - Single loop, linear search
O(n log n)  - Efficient sorting (merge, quick)
O(n²)       - Nested loops, bubble sort
O(2ⁿ)       - Recursive without memoization
O(n!)       - Permutations, brute force
```

---

## Next Steps

Practice these problems until you can:
1. Recognize the pattern instantly
2. Code the solution in 15-20 minutes
3. Explain time/space complexity
4. Handle edge cases automatically
5. Optimize from brute force to optimal

**Resources**:
- LeetCode: Practice by difficulty
- HackerRank: Interview preparation kit
- Pramp: Mock interviews with peers
- AlgoExpert: Video explanations

Good luck! 🚀
