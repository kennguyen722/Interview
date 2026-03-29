const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../solution/topics-and-labs');

test('module-04 topics and labs coverage', () => {
  assert.equal(T.hashMapSetQueueStackTopic([1, 1, 2]).unique, 2);
  assert.equal(T.linkedTreeGraphTopic({ value: 3 }), 3);
  assert.deepEqual(T.slidingWindowTwoPointersHeapTopic([1, 3, 2], 2), [3, 3]);
  assert.equal(T.topoSortCycleDetectionTopic(2, [[0, 1]]).hasCycle, false);
  assert.equal(T.complexityAnalysisTopic(4).quadratic, 16);
  const lru = T.lruCacheLab(1); lru.put('a', 1); lru.put('b', 2); assert.equal(lru.get('a'), null);
  assert.equal(T.logAnomalyDetectorLab([1, 5], 3)[1].anomaly, true);
  assert.equal(T.dependencySchedulerLab(2, [[0, 1]]).order.length, 2);
  assert.deepEqual(T.prefixSearchIndexLab(['apple', 'banana'], 'ap'), ['apple']);
  assert.equal(T.streamingPercentileEstimatorLab([1, 2, 3, 4, 5], 0.8), 4);
});
