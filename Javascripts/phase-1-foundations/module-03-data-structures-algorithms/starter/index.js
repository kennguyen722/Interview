'use strict';

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    // TODO
    throw new Error('Not implemented');
  }

  put(key, value) {
    // TODO
    throw new Error('Not implemented');
  }
}

function topKFrequent(items, k) {
  // TODO
  throw new Error('Not implemented');
}

function maxSubarraySumK(nums, k) {
  // TODO: fixed-size sliding window
  throw new Error('Not implemented');
}

module.exports = {
  LRUCache,
  topKFrequent,
  maxSubarraySumK
};

if (require.main === module) {
  console.log('Module 03 starter loaded. Complete TODOs in this file.');
}
