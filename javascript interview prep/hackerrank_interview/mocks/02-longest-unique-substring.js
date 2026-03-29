'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  const s = input.trim();
  const ans = lengthOfLongestUniqueSubstring(s);
  process.stdout.write(String(ans) + '\n');
});

function lengthOfLongestUniqueSubstring(s) {
  const lastIndex = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (lastIndex.has(ch) && lastIndex.get(ch) >= left) {
      left = lastIndex.get(ch) + 1;
    }
    lastIndex.set(ch, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}

module.exports = { lengthOfLongestUniqueSubstring };
