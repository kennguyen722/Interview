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
  const target = Number(lines[2]);
  const result = twoSum(nums, target);
  process.stdout.write(result.join(' ') + '\n');
});

function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    if (!seen.has(nums[i])) {
      seen.set(nums[i], i);
    }
  }
  return [-1, -1];
}

module.exports = { twoSum };
