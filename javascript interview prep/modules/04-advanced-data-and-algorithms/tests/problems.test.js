const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../solution/problems');

test('module-04 problems coverage', () => {
  assert.deepEqual(P.twoSum([2, 7], 9), [0, 1]);
  assert.equal(P.longestUniqueSubstring('abcabcbb'), 3);
  assert.deepEqual(P.mergeIntervals([[1, 3], [2, 4]]), [[1, 4]]);
  assert.deepEqual(P.topKFrequent(['a', 'a', 'b'], 1), ['a']);
  assert.equal(P.numberOfIslands([['1', '0'], ['0', '1']]), 2);
  assert.equal(P.courseSchedule(2, [[1, 0]]), true);
  assert.deepEqual(P.slidingWindowMaximum([1, 3, -1, -3, 5], 3), [3, 3, 5]);
  assert.equal(P.minimumWindowSubstring('ADOBECODEBANC', 'ABC'), 'BANC');
  assert.equal(P.graphShortestPath({ a: [['b', 2]], b: [['c', 3]], c: [] }, 'a', 'c'), 5);
  assert.equal(P.detectCycleDirectedGraph(2, [[0, 1], [1, 0]]), true);
  assert.deepEqual(P.runningMedian([1, 2, 3]), [1, 1.5, 2]);
  assert.equal(P.consistentHashingRing(['m', 't'], 'n'), 't');
  assert.equal(P.reconciliationDiffEngine([{ id: 1, v: 1 }], [{ id: 1, v: 2 }]).changed.length, 1);
  assert.equal(P.batchCompactionAlgorithm([{ id: 1, v: 1 }, { id: 1, v: 2 }])[0].v, 2);
  assert.equal(P.capacityAwareBatchingStrategy([{ weight: 2 }, { weight: 3 }], 3).length, 2);
});
