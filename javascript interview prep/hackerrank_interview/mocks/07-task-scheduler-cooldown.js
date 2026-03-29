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
  const tasks = (lines[1] || '').trim().split(/\s+/).slice(0, n);
  const cooldown = Number(lines[2]);
  const ans = leastIntervals(tasks, cooldown);
  process.stdout.write(String(ans) + '\n');
});

function leastIntervals(tasks, cooldown) {
  if (tasks.length === 0) return 0;
  if (cooldown === 0) return tasks.length;

  const freq = new Map();
  for (const task of tasks) {
    freq.set(task, (freq.get(task) || 0) + 1);
  }

  let maxCount = 0;
  for (const count of freq.values()) {
    maxCount = Math.max(maxCount, count);
  }

  let maxCountTaskKinds = 0;
  for (const count of freq.values()) {
    if (count === maxCount) maxCountTaskKinds += 1;
  }

  const slots = (maxCount - 1) * (cooldown + 1) + maxCountTaskKinds;
  return Math.max(tasks.length, slots);
}

module.exports = { leastIntervals };
