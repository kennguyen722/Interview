'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const ROOT = __dirname;

const mocks = [
  {
    id: 'Q1',
    name: 'Two Sum',
    file: 'mocks/01-two-sum.js',
    input: '4\n2 7 11 15\n9\n',
    expected: '0 1',
  },
  {
    id: 'Q2',
    name: 'Longest Unique Substring',
    file: 'mocks/02-longest-unique-substring.js',
    input: 'abcabcbb\n',
    expected: '3',
  },
  {
    id: 'Q3',
    name: 'Product Except Self',
    file: 'mocks/03-product-except-self.js',
    input: '4\n1 2 3 4\n',
    expected: '24 12 8 6',
  },
  {
    id: 'Q4',
    name: 'Merge Intervals',
    file: 'mocks/04-merge-intervals.js',
    input: '4\n1 3\n2 6\n8 10\n15 18\n',
    expected: '3\n1 6\n8 10\n15 18',
  },
  {
    id: 'Q5',
    name: 'Top K Frequent',
    file: 'mocks/05-top-k-frequent.js',
    input: '6\n1 1 1 2 2 3\n2\n',
    expected: '1 2',
  },
  {
    id: 'Q6',
    name: 'Min Window Substring',
    file: 'mocks/06-min-window-substring.js',
    input: 'ADOBECODEBANC\nABC\n',
    expected: 'BANC',
  },
  {
    id: 'Q7',
    name: 'Task Scheduler Cooldown',
    file: 'mocks/07-task-scheduler-cooldown.js',
    input: '6\nA A A B B B\n2\n',
    expected: '8',
  },
  {
    id: 'Q8',
    name: 'LRU Cache Simulator',
    file: 'mocks/08-lru-cache-simulator.js',
    input: '2\n6\nPUT a 1\nPUT b 2\nGET a\nPUT c 3\nGET b\nGET c\n',
    expected: '1\n-1\n3',
  },
  {
    id: 'Q9',
    name: 'Valid Parentheses',
    file: 'mocks/09-valid-parentheses.js',
    input: '()[]{}\n',
    expected: 'true',
  },
  {
    id: 'Q10',
    name: 'Group Anagrams',
    file: 'mocks/10-group-anagrams.js',
    input: '6\neat\ntea\ntan\nate\nnat\nbat\n',
    expected: '3\nate eat tea\nbat\nnat tan',
  },
  {
    id: 'Q11',
    name: 'Kth Largest Element',
    file: 'mocks/11-kth-largest-element.js',
    input: '6\n3 2 1 5 6 4\n2\n',
    expected: '5',
  },
  {
    id: 'Q12',
    name: 'Rotate Matrix',
    file: 'mocks/12-rotate-matrix.js',
    input: '3\n1 2 3\n4 5 6\n7 8 9\n',
    expected: '7 4 1\n8 5 2\n9 6 3',
  },
  {
    id: 'Q13',
    name: 'Word Break',
    file: 'mocks/13-word-break.js',
    input: 'leetcode\n2\nleet\ncode\n',
    expected: 'true',
  },
  {
    id: 'Q14',
    name: 'Number of Islands',
    file: 'mocks/14-number-of-islands.js',
    input: '4\n5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\n',
    expected: '3',
  },
  {
    id: 'Q15',
    name: 'Meeting Rooms II',
    file: 'mocks/15-meeting-rooms-ii.js',
    input: '3\n0 30\n5 10\n15 20\n',
    expected: '2',
  },
  {
    id: 'Q16',
    name: 'Search Suggestions Prefix',
    file: 'mocks/16-search-suggestions-prefix.js',
    input: '5\nmobile\nmouse\nmoneypot\nmonitor\nmousepad\nmouse\n',
    expected: '5\nmobile moneypot monitor\nmobile moneypot monitor\nmouse mousepad\nmouse mousepad\nmouse mousepad',
  },
];

let passCount = 0;

for (const mock of mocks) {
  const filePath = path.join(ROOT, mock.file);
  const run = spawnSync(process.execPath, [filePath], {
    input: mock.input,
    encoding: 'utf8',
  });

  const stdout = (run.stdout || '').trim();
  const stderr = (run.stderr || '').trim();
  const ok = run.status === 0 && stdout === mock.expected;

  if (ok) {
    passCount += 1;
    console.log(`[PASS] ${mock.id} ${mock.name}`);
  } else {
    console.log(`[FAIL] ${mock.id} ${mock.name}`);
    console.log('Expected:');
    console.log(mock.expected);
    console.log('Actual:');
    console.log(stdout || '<empty>');
    if (stderr) {
      console.log('Stderr:');
      console.log(stderr);
    }
  }
}

console.log(`\nSummary: ${passCount}/${mocks.length} passed`);

if (passCount !== mocks.length) {
  process.exit(1);
}
