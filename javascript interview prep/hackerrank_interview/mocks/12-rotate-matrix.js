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
  const matrix = [];
  for (let i = 0; i < n; i += 1) {
    matrix.push((lines[i + 1] || '').trim().split(/\s+/).map(Number));
  }

  rotateMatrix(matrix);
  const out = matrix.map((row) => row.join(' ')).join('\n');
  process.stdout.write(out + '\n');
});

function rotateMatrix(matrix) {
  const n = matrix.length;

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  for (let i = 0; i < n; i += 1) {
    matrix[i].reverse();
  }
}

module.exports = { rotateMatrix };
