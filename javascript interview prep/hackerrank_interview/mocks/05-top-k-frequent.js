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
  const nums = (lines[1] || '').trim().split(/\s+/).slice(0, n).map(Number);
  const k = Number(lines[2]);
  const ans = topKFrequent(nums, k);
  process.stdout.write(ans.join(' ') + '\n');
});

function topKFrequent(nums, k) {
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  const pairs = Array.from(freq.entries());
  pairs.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  return pairs.slice(0, k).map(([value]) => value);
}

module.exports = { topKFrequent };
