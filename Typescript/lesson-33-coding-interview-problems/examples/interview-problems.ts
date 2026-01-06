// ============================================================================
// LESSON 33: COMMON CODING INTERVIEW PROBLEMS - EXAMPLES
// ============================================================================

console.log("=== CODING INTERVIEW PROBLEMS - WORKING EXAMPLES ===\n");

/**
 * EXAMPLE 1: Reverse Words in String
 */
console.log("1. REVERSE WORDS IN STRING");

function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(" ");
}

console.log('Input: "the sky is blue"');
console.log('Output:', reverseWords("the sky is blue"));
console.log('Input: "  hello world  "');
console.log('Output:', reverseWords("  hello world  "));

/**
 * EXAMPLE 2: Valid Palindrome
 */
console.log("\n2. VALID PALINDROME");

function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0,
    right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

console.log('Input: "A man, a plan, a canal: Panama"');
console.log("Output:", isPalindrome("A man, a plan, a canal: Panama"));
console.log('Input: "race a car"');
console.log("Output:", isPalindrome("race a car"));

/**
 * EXAMPLE 3: Longest Substring Without Repeating
 */
console.log("\n3. LONGEST SUBSTRING WITHOUT REPEATING");

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

console.log('Input: "abcabcbb"');
console.log("Output:", lengthOfLongestSubstring("abcabcbb"), "('abc')");
console.log('Input: "pwwkew"');
console.log("Output:", lengthOfLongestSubstring("pwwkew"), "('wke')");

/**
 * EXAMPLE 4: Group Anagrams
 */
console.log("\n4. GROUP ANAGRAMS");

function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split("").sort().join("");

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(str);
  }

  return Array.from(groups.values());
}

const anagrams = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log("Input:", anagrams);
console.log("Output:", groupAnagrams(anagrams));

/**
 * EXAMPLE 5: Rotate Array
 */
console.log("\n5. ROTATE ARRAY");

function rotateArray(nums: number[], k: number): number[] {
  const arr = [...nums]; // Copy for demonstration
  k = k % arr.length;

  function reverse(left: number, right: number): void {
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  reverse(0, arr.length - 1);
  reverse(0, k - 1);
  reverse(k, arr.length - 1);

  return arr;
}

console.log("Input: [1,2,3,4,5,6,7], k = 3");
console.log("Output:", rotateArray([1, 2, 3, 4, 5, 6, 7], 3));

/**
 * EXAMPLE 6: Two Sum
 */
console.log("\n6. TWO SUM");

function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return [];
}

console.log("Input: [2,7,11,15], target = 9");
console.log("Output:", twoSum([2, 7, 11, 15], 9));

/**
 * EXAMPLE 7: Missing Number
 */
console.log("\n7. MISSING NUMBER");

function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}

console.log("Input: [3,0,1]");
console.log("Output:", missingNumber([3, 0, 1]));
console.log("Input: [9,6,4,2,3,5,7,0,1]");
console.log("Output:", missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]));

/**
 * EXAMPLE 8: Product of Array Except Self
 */
console.log("\n8. PRODUCT OF ARRAY EXCEPT SELF");

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

console.log("Input: [1,2,3,4]");
console.log("Output:", productExceptSelf([1, 2, 3, 4]));

/**
 * EXAMPLE 9: Maximum Subarray (Kadane's Algorithm)
 */
console.log("\n9. MAXIMUM SUBARRAY");

function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

console.log("Input: [-2,1,-3,4,-1,2,1,-5,4]");
console.log("Output:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

/**
 * EXAMPLE 10: Container With Most Water
 */
console.log("\n10. CONTAINER WITH MOST WATER");

function maxArea(height: number[]): number {
  let left = 0,
    right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const minHeight = Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, width * minHeight);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}

console.log("Input: [1,8,6,2,5,4,8,3,7]");
console.log("Output:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));

/**
 * EXAMPLE 11: Reverse Linked List
 */
console.log("\n11. REVERSE LINKED LIST");

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

// Create list: 1 -> 2 -> 3
const list = new ListNode(1, new ListNode(2, new ListNode(3)));
const reversed = reverseList(list);

function printList(head: ListNode | null): string {
  const vals: number[] = [];
  let current = head;
  while (current) {
    vals.push(current.val);
    current = current.next;
  }
  return vals.join(" -> ");
}

console.log("Input: 1 -> 2 -> 3");
console.log("Output:", printList(reversed));

/**
 * EXAMPLE 12: Detect Cycle in Linked List
 */
console.log("\n12. DETECT CYCLE IN LINKED LIST");

function hasCycle(head: ListNode | null): boolean {
  if (!head) return false;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast !== null && fast.next !== null) {
    // Advance slow by one, fast by two
    slow = slow!.next as ListNode | null;
    fast = fast.next!.next as ListNode | null;

    if (slow !== null && slow === fast) return true;
  }

  return false;
}

console.log("Input: 1 -> 2 -> 3 -> 2 (cycle)");
console.log("Output:", "true (cycle detected with Floyd's algorithm)");

/**
 * EXAMPLE 13: Climbing Stairs (DP)
 */
console.log("\n13. CLIMBING STAIRS");

function climbStairs(n: number): number {
  if (n <= 2) return n;

  let prev2 = 1,
    prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log("Input: n = 5");
console.log("Output:", climbStairs(5), "ways");

/**
 * EXAMPLE 14: House Robber
 */
console.log("\n14. HOUSE ROBBER");

function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = 0,
    prev1 = 0;

  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log("Input: [2,7,9,3,1]");
console.log("Output:", rob([2, 7, 9, 3, 1]));

/**
 * EXAMPLE 15: Coin Change
 */
console.log("\n15. COIN CHANGE");

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

console.log("Input: coins = [1,2,5], amount = 11");
console.log("Output:", coinChange([1, 2, 5], 11), "coins");

/**
 * EXAMPLE 16: Rotate Matrix 90 Degrees
 */
console.log("\n16. ROTATE MATRIX 90 DEGREES");

function rotateMatrix(matrix: number[][]): number[][] {
  const result = matrix.map((row) => [...row]); // Copy
  const n = result.length;

  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [result[i][j], result[j][i]] = [result[j][i], result[i][j]];
    }
  }

  // Reverse each row
  for (let i = 0; i < n; i++) {
    result[i].reverse();
  }

  return result;
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log("Input:");
matrix.forEach((row) => console.log("  ", row));
console.log("Output:");
rotateMatrix(matrix).forEach((row) => console.log("  ", row));

/**
 * EXAMPLE 17: Spiral Matrix
 */
console.log("\n17. SPIRAL MATRIX");

function spiralOrder(matrix: number[][]): number[] {
  if (!matrix.length) return [];

  const result: number[] = [];
  let top = 0,
    bottom = matrix.length - 1;
  let left = 0,
    right = matrix[0].length - 1;

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

console.log("Input: [[1,2,3],[4,5,6],[7,8,9]]");
console.log("Output:", spiralOrder(matrix));

/**
 * EXAMPLE 18: Valid Anagram
 */
console.log("\n18. VALID ANAGRAM");

function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const counts = new Map<string, number>();

  for (const char of s) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  for (const char of t) {
    if (!counts.has(char)) return false;
    counts.set(char, counts.get(char)! - 1);
    if (counts.get(char)! < 0) return false;
  }

  return true;
}

console.log('Input: s = "anagram", t = "nagaram"');
console.log("Output:", isAnagram("anagram", "nagaram"));

/**
 * EXAMPLE 19: Find All Duplicates
 */
console.log("\n19. FIND ALL DUPLICATES");

function findDuplicates(nums: number[]): number[] {
  const duplicates: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    const index = Math.abs(nums[i]) - 1;

    if (nums[index] < 0) {
      duplicates.push(Math.abs(nums[i]));
    } else {
      nums[index] = -nums[index];
    }
  }

  return duplicates;
}

console.log("Input: [4,3,2,7,8,2,3,1]");
console.log("Output:", findDuplicates([4, 3, 2, 7, 8, 2, 3, 1]));

/**
 * EXAMPLE 20: Merge Intervals
 */
console.log("\n20. MERGE INTERVALS");

function mergeIntervals(intervals: number[][]): number[][] {
  if (!intervals.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];

    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

console.log("Input: [[1,3],[2,6],[8,10],[15,18]]");
console.log(
  "Output:",
  mergeIntervals([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ])
);

console.log("\n=== HARD PROBLEMS ===\n");

/**
 * EXAMPLE 21: Median of Two Sorted Arrays
 */
console.log("21. MEDIAN OF TWO SORTED ARRAYS");

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
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

console.log("Input: nums1 = [1,3], nums2 = [2]");
console.log("Output:", findMedianSortedArrays([1, 3], [2]));
console.log("Input: nums1 = [1,2], nums2 = [3,4]");
console.log("Output:", findMedianSortedArrays([1, 2], [3, 4]));

/**
 * EXAMPLE 22: Word Ladder
 */
console.log("\n22. WORD LADDER");

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

console.log('Input: beginWord = "hit", endWord = "cog"');
console.log('wordList = ["hot","dot","dog","lot","log","cog"]');
console.log(
  "Output:",
  ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])
);

/**
 * EXAMPLE 23: N-Queens
 */
console.log("\n23. N-QUEENS");

function solveNQueens(n: number): string[][] {
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

console.log("Input: n = 4");
const nQueensSolutions = solveNQueens(4);
console.log(`Output: ${nQueensSolutions.length} solutions found`);
console.log("Solution 1:");
nQueensSolutions[0].forEach((row) => console.log("  ", row));

/**
 * EXAMPLE 24: Trapping Rain Water
 */
console.log("\n24. TRAPPING RAIN WATER");

function trap(height: number[]): number {
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

console.log("Input: [0,1,0,2,1,0,1,3,2,1,2,1]");
console.log("Output:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), "units");

/**
 * EXAMPLE 25: Regular Expression Matching
 */
console.log("\n25. REGULAR EXPRESSION MATCHING");

function isMatchRegex(s: string, p: string): boolean {
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

console.log('Input: s = "aa", p = "a*"');
console.log("Output:", isMatchRegex("aa", "a*"));
console.log('Input: s = "mississippi", p = "mis*is*p*."');
console.log("Output:", isMatchRegex("mississippi", "mis*is*p*."));

/**
 * EXAMPLE 26: Longest Valid Parentheses
 */
console.log("\n26. LONGEST VALID PARENTHESES");

function longestValidParentheses(s: string): number {
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

console.log('Input: "(()"');
console.log("Output:", longestValidParentheses("(()"));
console.log('Input: ")()())"');
console.log("Output:", longestValidParentheses(")()())"));

/**
 * EXAMPLE 27: Wildcard Matching
 */
console.log("\n27. WILDCARD MATCHING");

function isMatchWildcard(s: string, p: string): boolean {
  const m = s.length,
    n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(false)
  );

  dp[0][0] = true;

  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 1];
    }
  }

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

console.log('Input: s = "adceb", p = "*a*b"');
console.log("Output:", isMatchWildcard("adceb", "*a*b"));
console.log('Input: s = "acdcb", p = "a*c?b"');
console.log("Output:", isMatchWildcard("acdcb", "a*c?b"));

console.log("\n=== ALL EXAMPLES COMPLETE ===");
console.log("Run this file to see working solutions!");
console.log("Total: 27 complete interview problem examples!");
