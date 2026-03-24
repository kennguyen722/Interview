# Section 3: Data Structures and Algorithms in JavaScript (Full Detail)

This section is interview-focused and tuned for senior/principal expectations: correctness, complexity, tradeoffs, and clean implementation.

## Problem 1: Two Sum

### Problem statement
Given an array of integers and a target, return indices of two numbers whose sum equals the target.

### Difficulty
Easy-Medium

### Interview expectations
- Explain why hash map beats nested loops.
- Return correct indices, not values.

### Clarifying questions a strong candidate should ask
- Is there exactly one valid pair?
- Can elements repeat?
- Can negative numbers appear?

### Brute-force approach
- Nested loops test all pairs.

### Optimized approach
- One pass with Map of seen value -> index.

### Time and space complexity
- Brute force: time O(n^2), space O(1)
- Optimized: time O(n), space O(n)

### Clean JavaScript solution
```javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

### Alternative solutions when useful
- Sort + two pointers if index positions are not required.

### Edge cases
- Empty array.
- No valid pair.
- Duplicate values.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
assert.deepEqual(twoSum([3, 3], 6), [0, 1]);
assert.deepEqual(twoSum([], 6), []);
```

### Follow-up questions
- Return all unique pairs.
- Streaming version for infinite input.

### Real-world production relevance
- Fundamental pattern behind join-like lookups and anti-fraud pair detection rules.

---

## Problem 2: Longest Substring Without Repeating Characters

### Problem statement
Return the length of the longest substring with all unique characters.

### Difficulty
Medium

### Interview expectations
- Use sliding window with character index map.
- Avoid rebuilding substrings repeatedly.

### Clarifying questions a strong candidate should ask
- ASCII only or full Unicode?
- Need length only or actual substring?

### Brute-force approach
- Check every substring with set.

### Optimized approach
- Sliding window with left pointer jump.

### Time and space complexity
- Brute force: time O(n^3), space O(n)
- Optimized: time O(n), space O(min(n, alphabet))

### Clean JavaScript solution
```javascript
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (last.has(ch)) {
      left = Math.max(left, last.get(ch) + 1);
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

### Alternative solutions when useful
- Fixed-size array for ASCII for lower constant factors.

### Edge cases
- Empty string.
- All same chars.
- Large Unicode grapheme clusters.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.equal(lengthOfLongestSubstring('abcabcbb'), 3);
assert.equal(lengthOfLongestSubstring('bbbbb'), 1);
assert.equal(lengthOfLongestSubstring(''), 0);
```

### Follow-up questions
- Return the substring itself.
- Handle grapheme clusters correctly.

### Real-world production relevance
- Session token scanning, UI validation windows, and stream analytics.

---

## Problem 3: Merge Intervals

### Problem statement
Given intervals, merge overlapping ranges.

### Difficulty
Medium

### Interview expectations
- Sort first, then linear merge.
- Correct boundary handling.

### Clarifying questions a strong candidate should ask
- Are touching intervals like [1,4] and [4,5] considered overlapping?
- Is input already sorted?

### Brute-force approach
- Compare each interval with all others repeatedly.

### Optimized approach
- Sort by start, merge greedily.

### Time and space complexity
- Time O(n log n), space O(n)

### Clean JavaScript solution
```javascript
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals.slice();

  const arr = intervals.slice().sort((a, b) => a[0] - b[0]);
  const merged = [arr[0].slice()];

  for (let i = 1; i < arr.length; i += 1) {
    const current = arr[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current.slice());
    }
  }

  return merged;
}
```

### Alternative solutions when useful
- Sweep-line for weighted interval events.

### Edge cases
- Empty list.
- Single interval.
- Fully nested intervals.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.deepEqual(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]), [[1,6],[8,10],[15,18]]);
assert.deepEqual(mergeIntervals([[1,4],[4,5]]), [[1,5]]);
```

### Follow-up questions
- Insert interval into existing merged list.
- Track source IDs merged into each interval.

### Real-world production relevance
- Calendar engines, booking windows, and rate-card segment consolidation.

---

## Problem 4: Top K Frequent Elements

### Problem statement
Return the k most frequent elements.

### Difficulty
Medium

### Interview expectations
- Frequency map baseline.
- Discuss heap vs bucket tradeoffs.

### Clarifying questions a strong candidate should ask
- Any order requirement for result?
- Range constraints for values?

### Brute-force approach
- Count then sort all keys by frequency.

### Optimized approach
- Bucket by frequency for linear time.

### Time and space complexity
- Sort approach: time O(n log n), space O(n)
- Bucket approach: time O(n), space O(n)

### Clean JavaScript solution
```javascript
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq.entries()) {
    buckets[count].push(num);
  }

  const out = [];
  for (let c = buckets.length - 1; c >= 0 && out.length < k; c -= 1) {
    for (const num of buckets[c]) {
      out.push(num);
      if (out.length === k) break;
    }
  }
  return out;
}
```

### Alternative solutions when useful
- Min-heap of size k for streaming input.

### Edge cases
- k equals unique count.
- Negative numbers.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.deepEqual(topKFrequent([1,1,1,2,2,3], 2).sort(), [1,2]);
```

### Follow-up questions
- Online version with continuous updates.

### Real-world production relevance
- Trending topics, top error codes, high-cardinality metric summaries.

---

## Problem 5: LRU Cache in O(1)

### Problem statement
Implement an LRU cache with O(1) get/put.

### Difficulty
Hard

### Interview expectations
- Combine Map + doubly linked list correctly.
- Handle recency updates and eviction.

### Clarifying questions a strong candidate should ask
- Capacity bounds?
- Return convention on miss?

### Brute-force approach
- Array recency management.

### Optimized approach
- Hash map + linked list.

### Time and space complexity
- Time O(1) average get/put, space O(capacity)

### Clean JavaScript solution
```javascript
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(null, null);
    this.tail = new Node(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _moveFront(node) {
    this._remove(node);
    this._addFront(node);
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this._moveFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._moveFront(node);
      return;
    }

    const node = new Node(key, value);
    this.map.set(key, node);
    this._addFront(node);

    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}
```

Explanation: the map gives O(1) node lookup, while the doubly linked list gives O(1) recency updates and eviction.

### Alternative solutions when useful
- JavaScript Map insertion-order trick for interview speed.

### Edge cases
- Capacity 1.
- Update existing key.

### Test cases
- Same test pattern as Section 1 LRU problem.

### Follow-up questions
- Add TTL and stale-while-revalidate.

### Real-world production relevance
- API/data cache core primitive.

---

## Problem 6: Number of Islands

### Problem statement
Given a binary grid, count connected components of land.

### Difficulty
Medium

### Interview expectations
- DFS/BFS traversal.
- Mark visited efficiently.

### Clarifying questions a strong candidate should ask
- 4-directional or 8-directional adjacency?
- Can grid be mutated?

### Brute-force approach
- Repeated full scans per island candidate.

### Optimized approach
- Single pass; launch DFS/BFS when new land found.

### Time and space complexity
- Time O(R*C), space O(R*C) worst case recursion/queue.

### Clean JavaScript solution
```javascript
function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === '1') {
        count += 1;
        dfs(r, c);
      }
    }
  }

  return count;
}
```

### Alternative solutions when useful
- Union-Find for dynamic island additions.

### Edge cases
- Empty grid.
- All water/all land.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.equal(numIslands([
  ['1','1','0'],
  ['0','1','0'],
  ['1','0','1'],
]), 3);
```

### Follow-up questions
- Count largest island area.
- Dynamic updates (add/remove land).

### Real-world production relevance
- Cluster detection, image segmentation, and graph component analysis.

---

## Problem 7: Course Schedule (Topological Sort)

### Problem statement
Determine if all courses can be finished given prerequisite pairs.

### Difficulty
Medium-Hard

### Interview expectations
- Detect cycles via indegree/Kahn or DFS colors.
- Explain DAG requirement.

### Clarifying questions a strong candidate should ask
- Input size bounds?
- Need ordering or boolean only?

### Brute-force approach
- Naive repeated dependency scanning.

### Optimized approach
- Build graph + indegree; process queue.

### Time and space complexity
- Time O(V+E), space O(V+E)

### Clean JavaScript solution
```javascript
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course] += 1;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i += 1) {
    if (indegree[i] === 0) queue.push(i);
  }

  let processed = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    processed += 1;
    for (const nei of graph[node]) {
      indegree[nei] -= 1;
      if (indegree[nei] === 0) queue.push(nei);
    }
  }

  return processed === numCourses;
}
```

### Alternative solutions when useful
- DFS recursion with three-color cycle detection.

### Edge cases
- Self dependency.
- Disconnected graph.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.equal(canFinish(2, [[1,0]]), true);
assert.equal(canFinish(2, [[1,0],[0,1]]), false);
```

### Follow-up questions
- Return one valid ordering.
- Return lexicographically smallest ordering.

### Real-world production relevance
- Build systems, package managers, workflow DAG schedulers.

---

## Problem 8: Sliding Window Maximum

### Problem statement
Given array and window size k, return max for each window.

### Difficulty
Hard

### Interview expectations
- Monotonic deque pattern.
- O(n) reasoning.

### Clarifying questions a strong candidate should ask
- k constraints.
- Duplicate values behavior.

### Brute-force approach
- Compute max in each window directly.

### Optimized approach
- Maintain deque of indices with decreasing values.

### Time and space complexity
- Brute force O(n*k)
- Optimized O(n) time, O(k) space

### Clean JavaScript solution
```javascript
function maxSlidingWindow(nums, k) {
  if (k <= 0) return [];
  const deque = [];
  const out = [];

  for (let i = 0; i < nums.length; i += 1) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }

  return out;
}
```

### Alternative solutions when useful
- Segment tree for dynamic updates.

### Edge cases
- k=1.
- k equals array length.
- Strictly decreasing array.

### Test cases
```javascript
import assert from 'node:assert/strict';
assert.deepEqual(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3), [3,3,5,5,6,7]);
```

### Follow-up questions
- Sliding window minimum.
- Median in sliding window.

### Real-world production relevance
- Real-time monitoring, rolling analytics, stream risk detection.

---

## Section 3 Mock Interview Drill

1. Solve Problems 2, 7, and 8 in 60 minutes with complexity explanation.
2. Re-implement Problem 5 from memory and narrate pointer operations.
3. Compare heap vs bucket approaches for Problem 4 under streaming load.

## Section 3 Exit Criteria

- You can identify pattern class (window/graph/heap/topo) quickly.
- You can implement cleanly under time pressure with edge-case safety.
- You can explain practical tradeoffs, not only big-O.
