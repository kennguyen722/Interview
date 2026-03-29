function hashMapSetQueueStackTopic(items) {
  const set = new Set(items);
  const queue = [...items];
  const stack = items.slice().reverse();
  return { unique: set.size, queueHead: queue[0], stackTop: stack[0] };
}

function linkedTreeGraphTopic(tree) {
  return tree?.value ?? null;
}

function slidingWindowTwoPointersHeapTopic(nums, k) {
  if (k <= 0 || k > nums.length) return [];
  const out = [];
  for (let i = 0; i <= nums.length - k; i += 1) out.push(Math.max(...nums.slice(i, i + k)));
  return out;
}

function topoSortCycleDetectionTopic(numNodes, edges) {
  const indeg = Array(numNodes).fill(0); const g = Array.from({ length: numNodes }, () => []);
  for (const [u, v] of edges) { g[u].push(v); indeg[v] += 1; }
  const q = []; indeg.forEach((d, i) => { if (!d) q.push(i); });
  const out = [];
  while (q.length) { const n = q.shift(); out.push(n); for (const nxt of g[n]) { indeg[nxt] -= 1; if (!indeg[nxt]) q.push(nxt); } }
  return { order: out, hasCycle: out.length !== numNodes };
}

function complexityAnalysisTopic(n) {
  return { linear: n, quadratic: n * n, log2: Math.ceil(Math.log2(Math.max(1, n))) };
}

function lruCacheLab(capacity = 2) {
  const map = new Map();
  return {
    get(k) { if (!map.has(k)) return null; const v = map.get(k); map.delete(k); map.set(k, v); return v; },
    put(k, v) { if (map.has(k)) map.delete(k); map.set(k, v); if (map.size > capacity) map.delete(map.keys().next().value); },
  };
}

function logAnomalyDetectorLab(values, threshold) {
  return values.map((v) => ({ value: v, anomaly: v > threshold }));
}

function dependencySchedulerLab(numNodes, edges) {
  return topoSortCycleDetectionTopic(numNodes, edges);
}

function prefixSearchIndexLab(words, prefix) {
  return words.filter((w) => w.startsWith(prefix));
}

function streamingPercentileEstimatorLab(samples, p = 0.95) {
  const sorted = samples.slice().sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * p)] || 0;
}

module.exports = {
  hashMapSetQueueStackTopic,
  linkedTreeGraphTopic,
  slidingWindowTwoPointersHeapTopic,
  topoSortCycleDetectionTopic,
  complexityAnalysisTopic,
  lruCacheLab,
  logAnomalyDetectorLab,
  dependencySchedulerLab,
  prefixSearchIndexLab,
  streamingPercentileEstimatorLab,
};
