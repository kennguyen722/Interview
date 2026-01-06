# Lesson 28: Interview Strategies & Problem-Solving Patterns

## Objective
Master techniques for solving coding interview problems efficiently. Learn patterns that appear frequently, strategies for approaching unknowns, and how to communicate your thinking clearly.

## Topics Covered

### 1. The Interview Problem-Solving Framework

**Step 1: Clarify & Understand (2-3 minutes)**
```
Questions to ask:
- What are the constraints? (size limits, time limits)
- What input formats are possible?
- What edge cases should I consider?
- Can I modify the input?
- What's the expected output format?
```

**Step 2: Discuss Approach (2-3 minutes)**
```
- Explain your initial thoughts
- Discuss time/space tradeoffs
- Mention multiple approaches if applicable
- Get interviewer feedback
```

**Step 3: Code & Explain (10-15 minutes)**
```
- Write clean, readable code
- Explain your logic as you code
- Ask if you're on the right track
- Don't rush
```

**Step 4: Test & Optimize (5 minutes)**
```
- Test with given examples
- Test edge cases
- Discuss optimization opportunities
- Refactor if time permits
```

### 2. Common Interview Patterns

#### Pattern 1: Two Pointers
```typescript
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

// Time: O(n), Space: O(1)
```

#### Pattern 2: Sliding Window
```typescript
// Problem: Find longest substring without repeating characters
function longestSubstringWithoutRepeating(s: string): number {
  const charIndex = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (charIndex.has(char)) {
      left = Math.max(left, charIndex.get(char)! + 1);
    }

    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Time: O(n), Space: O(min(n, 26))
```

#### Pattern 3: Binary Search
```typescript
// Problem: Find target in rotated sorted array
function searchRotated(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    // Determine which half is sorted
    if (arr[left] <= arr[mid]) {
      // Left half is sorted
      if (target >= arr[left] && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (target > arr[mid] && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

// Time: O(log n), Space: O(1)
```

#### Pattern 4: DFS/BFS Tree Traversal
```typescript
// Problem: Level-order traversal
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

// Time: O(n), Space: O(n)
```

#### Pattern 5: Dynamic Programming
```typescript
// Problem: Maximum sum of non-adjacent elements
function maxSumNonAdjacent(arr: number[]): number {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];

  const dp = new Array(arr.length);
  dp[0] = arr[0];
  dp[1] = Math.max(arr[0], arr[1]);

  for (let i = 2; i < arr.length; i++) {
    dp[i] = Math.max(arr[i] + dp[i - 2], dp[i - 1]);
  }

  return dp[arr.length - 1];
}

// Time: O(n), Space: O(n) [can optimize to O(1)]
```

#### Pattern 6: Backtracking
```typescript
// Problem: Generate all permutations
function permute(arr: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(current: number[], remaining: number[]) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      const next = remaining.filter((_, idx) => idx !== i);
      backtrack(current, next);
      current.pop();
    }
  }

  backtrack([], arr);
  return result;
}

// Time: O(n!), Space: O(n)
```

### 3. What Interviewers Are Looking For

**Technical Skills (50%)**
- Correctness: Does the solution work?
- Efficiency: Is it optimal?
- Code Quality: Is it clean and readable?
- Problem-Solving: Can you think through edge cases?

**Communication (30%)**
- Clarity: Can you explain your approach?
- Listening: Do you respond to hints?
- Asking Questions: Do you clarify requirements?
- Collaboration: Do you think out loud?

**Attitude (20%)**
- Confidence: Do you believe in your solution?
- Humility: Can you acknowledge mistakes?
- Growth Mindset: Do you iterate and improve?
- Enthusiasm: Do you care about the problem?

### 4. Common Interview Mistakes

```typescript
// ❌ MISTAKE 1: Writing code without thinking
function solve(arr: number[]) {
  // Starts coding immediately without understanding problem
  return arr.map(...); // May not be correct
}

// ✅ SOLUTION: Explain approach first
function solve(arr: number[]): number {
  // First, let me understand: we need to find X
  // My approach: use two pointers because array is sorted
  // This gives us O(n) time, O(1) space
  
  let left = 0, right = arr.length - 1;
  // ... implementation
}
```

```typescript
// ❌ MISTAKE 2: Not testing edge cases
function findMax(arr: number[]): number {
  return Math.max(...arr); // Fails for empty array
}

// ✅ SOLUTION: Discuss and test edge cases
function findMax(arr: number[]): number {
  if (arr.length === 0) throw new Error("Array cannot be empty");
  
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// Test: empty array, single element, duplicates, negative numbers
```

```typescript
// ❌ MISTAKE 3: Getting stuck and giving up
function solve() {
  // Gets stuck, doesn't ask for hints
  // Stays quiet
  // Eventually gives up
}

// ✅ SOLUTION: Ask for help when stuck
function solve() {
  // "I'm thinking about using X approach, but I'm stuck on Y.
  // Can you give me a hint?"
  // "Should I be considering Z as a constraint?"
}
```

### 5. Interview Communication Template

**Opening**
```
"Let me make sure I understand the problem:
- Input: [describe]
- Output: [describe]
- Constraints: [list]
- Edge cases: [mention]

Is this correct?"
```

**Approach Discussion**
```
"My approach is to:
1. [Step 1]: This handles [aspect]
2. [Step 2]: This optimizes [aspect]

This gives us O(n) time complexity and O(n) space.

Does this sound good, or would you like me to consider a different approach?"
```

**During Coding**
```
"I'm implementing [part of solution] here.
The idea is to [explain logic].
This handles [specific case]."
```

**Before Finishing**
```
"Let me test this with the given example:
- Input: [example]
- Expected: [expected output]
- My solution: [trace through]

That matches! Let me also test an edge case:
- Edge case: [describe]
- Result: [trace through]

I think this is correct. Would you like me to optimize it further?"
```

### 6. Types of Interview Problems by Difficulty

**Easy (5-10 min)**
- Two sum variants
- Remove duplicates
- Reverse array/string
- Palindrome check
- FizzBuzz variants

**Medium (15-20 min)**
- Binary search variants
- LCS/LIS
- Tree/Graph traversal
- Linked list operations
- Stack/Queue problems

**Hard (30-45 min)**
- Complex DP
- Graph algorithms (Dijkstra, A*)
- Advanced tree problems
- System design lite
- Combination of patterns

## Learning Outcomes
- Solve coding problems systematically
- Recognize common patterns
- Communicate clearly during interviews
- Manage time effectively
- Handle stress and uncertainty

## Resources
- [LeetCode](https://leetcode.com/)
- [Interview Bit](https://www.interviewbit.com/)
- [CodeSignal](https://codesignal.com/)
- [Cracking the Coding Interview](https://www.crackingthecodinginterview.com/)
