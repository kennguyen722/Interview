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
  const ans = kthLargest(nums, k);
  process.stdout.write(String(ans) + '\n');
});

function kthLargest(nums, k) {
  const target = nums.length - k;
  return quickSelect(nums.slice(), 0, nums.length - 1, target);
}

function quickSelect(arr, left, right, targetIdx) {
  while (left <= right) {
    const pivotIdx = partition(arr, left, right);
    if (pivotIdx === targetIdx) return arr[pivotIdx];
    if (pivotIdx < targetIdx) left = pivotIdx + 1;
    else right = pivotIdx - 1;
  }
  return -1;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let store = left;
  for (let i = left; i < right; i += 1) {
    if (arr[i] <= pivot) {
      [arr[i], arr[store]] = [arr[store], arr[i]];
      store += 1;
    }
  }
  [arr[store], arr[right]] = [arr[right], arr[store]];
  return store;
}

module.exports = { kthLargest };
