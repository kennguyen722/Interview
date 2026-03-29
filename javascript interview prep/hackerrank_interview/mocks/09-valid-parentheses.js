'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  const s = input.trim();
  const ok = isValidParentheses(s);
  process.stdout.write((ok ? 'true' : 'false') + '\n');
});

function isValidParentheses(s) {
  const stack = [];
  const pairs = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (pairs.has(ch)) {
      if (stack.length === 0 || stack.pop() !== pairs.get(ch)) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

module.exports = { isValidParentheses };
