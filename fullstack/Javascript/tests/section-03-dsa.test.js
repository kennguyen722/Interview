const test = require('node:test');
const assert = require('node:assert/strict');

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

test('twoSum returns pair indices', () => {
  assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
  assert.deepEqual(twoSum([3, 3], 6), [0, 1]);
  assert.deepEqual(twoSum([], 6), []);
});

test('lengthOfLongestSubstring returns expected lengths', () => {
  assert.equal(lengthOfLongestSubstring('abcabcbb'), 3);
  assert.equal(lengthOfLongestSubstring('bbbbb'), 1);
  assert.equal(lengthOfLongestSubstring(''), 0);
});

test('mergeIntervals merges overlapping ranges', () => {
  assert.deepEqual(
    mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]),
    [[1, 6], [8, 10], [15, 18]]
  );
  assert.deepEqual(mergeIntervals([[1, 4], [4, 5]]), [[1, 5]]);
});

test('maxSlidingWindow computes rolling maximums', () => {
  assert.deepEqual(
    maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3),
    [3, 3, 5, 5, 6, 7]
  );
  assert.deepEqual(maxSlidingWindow([1], 1), [1]);
  assert.deepEqual(maxSlidingWindow([9, 8, 7], 2), [9, 8]);
});
