'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const intervals = [];
  for (let i = 0; i < n; i += 1) {
    const [s, e] = lines[i + 1].trim().split(/\s+/).map(Number);
    intervals.push([s, e]);
  }
  const merged = mergeIntervals(intervals);
  const out = [String(merged.length)];
  for (const [s, e] of merged) out.push(`${s} ${e}`);
  process.stdout.write(out.join('\n') + '\n');
});

function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const merged = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i += 1) {
    const [s, e] = intervals[i];
    const last = merged[merged.length - 1];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

module.exports = { mergeIntervals };
