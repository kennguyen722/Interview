/*
 * 1. twoSum - finds two indices in an array whose values sum to a target value,
 *    returning the pair of indices if found or an empty array if no such pair exists.
 */

function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}

/*
 * 2. maxSlidingWindow - computes the maximum value in each sliding window of
 *    size k over an array of numbers, returning an array of the maximums for
 *    each window position.
 */

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

module.exports = { twoSum, maxSlidingWindow };
