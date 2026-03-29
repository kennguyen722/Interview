'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  const lines = input.trim().split(/\r?\n/);
  let idx = 0;
  const rows = Number(lines[idx++]);
  const cols = Number(lines[idx++]);
  const grid = [];

  for (let r = 0; r < rows; r += 1) {
    grid.push((lines[idx++] || '').trim().split(/\s+/));
  }

  const ans = numIslands(grid);
  process.stdout.write(String(ans) + '\n');
});

function numIslands(grid) {
  if (!grid.length || !grid[0].length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === '1') {
        count += 1;
        dfs(r, c);
      }
    }
  }

  return count;
}

module.exports = { numIslands };
