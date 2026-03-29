'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  const lines = input.trim().split(/\r?\n/);
  const s = lines[0] || '';
  const t = lines[1] || '';
  const ans = minWindowSubstring(s, t);
  process.stdout.write((ans.length > 0 ? ans : '-1') + '\n');
});

function minWindowSubstring(s, t) {
  if (!s || !t || t.length > s.length) return '';

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  const have = new Map();
  let formed = 0;
  const required = need.size;

  let left = 0;
  let bestLen = Infinity;
  let bestStart = 0;

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    have.set(ch, (have.get(ch) || 0) + 1);

    if (need.has(ch) && have.get(ch) === need.get(ch)) {
      formed += 1;
    }

    while (formed === required && left <= right) {
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bestStart = left;
      }

      const drop = s[left];
      have.set(drop, have.get(drop) - 1);
      if (need.has(drop) && have.get(drop) < need.get(drop)) {
        formed -= 1;
      }
      left += 1;
    }
  }

  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}

module.exports = { minWindowSubstring };
