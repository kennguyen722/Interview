'use strict';

class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error('capacity must be >= 1');
    }
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }
}

function topKFrequent(items, k) {
  const freq = new Map();
  for (const item of items) {
    freq.set(item, (freq.get(item) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([item]) => item);
}

function maxSubarraySumK(nums, k) {
  if (k < 1 || k > nums.length) {
    throw new Error('invalid window size');
  }

  let windowSum = 0;
  for (let i = 0; i < k; i += 1) {
    windowSum += nums[i];
  }

  let best = windowSum;
  for (let right = k; right < nums.length; right += 1) {
    windowSum += nums[right] - nums[right - k];
    if (windowSum > best) {
      best = windowSum;
    }
  }
  return best;
}

module.exports = {
  LRUCache,
  topKFrequent,
  maxSubarraySumK
};

if (require.main === module) {
  const cache = new LRUCache(2);
  cache.put('a', 1);
  cache.put('b', 2);
  cache.get('a');
  cache.put('c', 3);
  console.log('b evicted:', cache.get('b') === -1);
}
