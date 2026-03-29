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
  const n = Number(lines[1] || 0);
  const dict = [];
  for (let i = 0; i < n; i += 1) {
    dict.push((lines[i + 2] || '').trim());
  }

  const ans = wordBreak(s, dict);
  process.stdout.write((ans ? 'true' : 'false') + '\n');
});

function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (dp[j] && set.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}

module.exports = { wordBreak };
