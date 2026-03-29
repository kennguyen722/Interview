function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}

function longestUniqueSubstring(s) {
  let l = 0; let best = 0; const seen = new Map();
  for (let r = 0; r < s.length; r += 1) {
    if (seen.has(s[r])) l = Math.max(l, seen.get(s[r]) + 1);
    seen.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}

function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0].slice()];
  for (const [s, e] of intervals.slice(1)) {
    const last = out[out.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e); else out.push([s, e]);
  }
  return out;
}

function topKFrequent(items, k) {
  const count = new Map();
  for (const x of items) count.set(x, (count.get(x) || 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([x]) => x);
}

function numberOfIslands(grid) {
  const m = grid.length; const n = m ? grid[0].length : 0;
  let ans = 0;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0'; dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < m; r += 1) for (let c = 0; c < n; c += 1) if (grid[r][c] === '1') { ans += 1; dfs(r, c); }
  return ans;
}

function courseSchedule(numCourses, prerequisites) {
  const indeg = Array(numCourses).fill(0); const g = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) { g[b].push(a); indeg[a] += 1; }
  const q = []; indeg.forEach((v, i) => { if (!v) q.push(i); });
  let seen = 0;
  while (q.length) { const x = q.shift(); seen += 1; for (const y of g[x]) { indeg[y] -= 1; if (!indeg[y]) q.push(y); } }
  return seen === numCourses;
}

function slidingWindowMaximum(nums, k) {
  const dq = []; const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i); if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}

function minimumWindowSubstring(s, t) {
  const need = new Map(); for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let miss = t.length; let l = 0; let best = [0, Infinity];
  for (let r = 0; r < s.length; r += 1) {
    const ch = s[r]; if (need.has(ch)) { if (need.get(ch) > 0) miss -= 1; need.set(ch, need.get(ch) - 1); }
    while (miss === 0) {
      if (r - l < best[1] - best[0]) best = [l, r + 1];
      const left = s[l++]; if (need.has(left)) { need.set(left, need.get(left) + 1); if (need.get(left) > 0) miss += 1; }
    }
  }
  return best[1] === Infinity ? '' : s.slice(best[0], best[1]);
}

function graphShortestPath(graph, start, end) {
  const dist = new Map([[start, 0]]); const q = [[0, start]];
  while (q.length) {
    q.sort((a, b) => a[0] - b[0]);
    const [d, node] = q.shift();
    if (node === end) return d;
    for (const [nxt, w] of graph[node] || []) {
      const nd = d + w;
      if (!dist.has(nxt) || nd < dist.get(nxt)) { dist.set(nxt, nd); q.push([nd, nxt]); }
    }
  }
  return Infinity;
}

function detectCycleDirectedGraph(numNodes, edges) {
  const g = Array.from({ length: numNodes }, () => []);
  for (const [u, v] of edges) g[u].push(v);
  const state = Array(numNodes).fill(0);
  const dfs = (u) => {
    if (state[u] === 1) return true;
    if (state[u] === 2) return false;
    state[u] = 1;
    for (const v of g[u]) if (dfs(v)) return true;
    state[u] = 2;
    return false;
  };
  for (let i = 0; i < numNodes; i += 1) if (dfs(i)) return true;
  return false;
}

function runningMedian(nums) {
  const out = []; const arr = [];
  for (const n of nums) {
    arr.push(n); arr.sort((a, b) => a - b);
    const m = arr.length >> 1;
    out.push(arr.length % 2 ? arr[m] : (arr[m - 1] + arr[m]) / 2);
  }
  return out;
}

function consistentHashingRing(nodes, key) {
  const ring = nodes.slice().sort();
  for (const n of ring) if (key <= n) return n;
  return ring[0] || null;
}

function reconciliationDiffEngine(a, b) {
  const mapA = new Map(a.map((x) => [x.id, x]));
  const mapB = new Map(b.map((x) => [x.id, x]));
  const added = []; const removed = []; const changed = [];
  for (const [id, row] of mapB) {
    if (!mapA.has(id)) added.push(row);
    else if (JSON.stringify(mapA.get(id)) !== JSON.stringify(row)) changed.push({ before: mapA.get(id), after: row });
  }
  for (const [id, row] of mapA) if (!mapB.has(id)) removed.push(row);
  return { added, removed, changed };
}

function batchCompactionAlgorithm(rows) {
  const seen = new Map();
  for (const r of rows) seen.set(r.id, r);
  return [...seen.values()];
}

function capacityAwareBatchingStrategy(items, capacity, weight = (x) => x.weight || 1) {
  const batches = []; let cur = []; let sum = 0;
  for (const item of items) {
    const w = weight(item);
    if (sum + w > capacity && cur.length) { batches.push(cur); cur = []; sum = 0; }
    cur.push(item); sum += w;
  }
  if (cur.length) batches.push(cur);
  return batches;
}

module.exports = {
  twoSum,
  longestUniqueSubstring,
  mergeIntervals,
  topKFrequent,
  numberOfIslands,
  courseSchedule,
  slidingWindowMaximum,
  minimumWindowSubstring,
  graphShortestPath,
  detectCycleDirectedGraph,
  runningMedian,
  consistentHashingRing,
  reconciliationDiffEngine,
  batchCompactionAlgorithm,
  capacityAwareBatchingStrategy,
};
