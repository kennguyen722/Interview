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
  const ans = productExceptSelf(nums);
  process.stdout.write(ans.join(' ') + '\n');
});

function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i += 1) {
    out[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i -= 1) {
    out[i] *= suffix;
    suffix *= nums[i];
  }

  return out;
}

module.exports = { productExceptSelf };
