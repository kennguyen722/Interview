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
  const products = [];
  for (let i = 0; i < n; i += 1) {
    products.push((lines[i + 1] || '').trim());
  }
  const searchWord = lines[n + 1] || '';

  const ans = suggestedProducts(products, searchWord);
  const out = [String(ans.length)];
  for (const row of ans) {
    out.push(row.join(' '));
  }

  process.stdout.write(out.join('\n') + '\n');
});

function suggestedProducts(products, searchWord) {
  const sorted = products.slice().sort();
  const out = [];
  let prefix = '';

  for (const ch of searchWord) {
    prefix += ch;
    const row = [];
    for (const item of sorted) {
      if (item.startsWith(prefix)) {
        row.push(item);
        if (row.length === 3) break;
      }
    }
    out.push(row);
  }

  return out;
}

module.exports = { suggestedProducts };
