const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('twoSum returns indices', () => {
  assert.deepEqual(S.twoSum([2, 7, 11, 15], 9), [0, 1]);
});

test('maxSlidingWindow computes expected max values', () => {
  assert.deepEqual(S.maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
});
