'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0] || 0);
  const words = [];
  for (let i = 0; i < n; i += 1) {
    words.push((lines[i + 1] || '').trim());
  }

  const groups = groupAnagrams(words);
  const out = [String(groups.length)];
  for (const g of groups) {
    out.push(g.join(' '));
  }
  process.stdout.write(out.join('\n') + '\n');
});

function groupAnagrams(words) {
  const map = new Map();

  for (const word of words) {
    const key = word.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }

  // Deterministic output for interview assertions.
  const groups = Array.from(map.values()).map((group) => group.slice().sort());
  groups.sort((a, b) => a[0].localeCompare(b[0]));
  return groups;
}

module.exports = { groupAnagrams };
