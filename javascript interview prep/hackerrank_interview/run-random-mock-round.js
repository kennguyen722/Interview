'use strict';

const path = require('node:path');

const catalog = [
  { id: 'Q1', file: 'mocks/01-two-sum.js', title: 'Two Sum', level: 'easy' },
  { id: 'Q2', file: 'mocks/02-longest-unique-substring.js', title: 'Longest Unique Substring', level: 'medium' },
  { id: 'Q3', file: 'mocks/03-product-except-self.js', title: 'Product Except Self', level: 'medium' },
  { id: 'Q4', file: 'mocks/04-merge-intervals.js', title: 'Merge Intervals', level: 'medium' },
  { id: 'Q5', file: 'mocks/05-top-k-frequent.js', title: 'Top K Frequent', level: 'medium' },
  { id: 'Q6', file: 'mocks/06-min-window-substring.js', title: 'Min Window Substring', level: 'hard' },
  { id: 'Q7', file: 'mocks/07-task-scheduler-cooldown.js', title: 'Task Scheduler Cooldown', level: 'medium' },
  { id: 'Q8', file: 'mocks/08-lru-cache-simulator.js', title: 'LRU Cache Simulator', level: 'hard' },
  { id: 'Q9', file: 'mocks/09-valid-parentheses.js', title: 'Valid Parentheses', level: 'easy' },
  { id: 'Q10', file: 'mocks/10-group-anagrams.js', title: 'Group Anagrams', level: 'medium' },
  { id: 'Q11', file: 'mocks/11-kth-largest-element.js', title: 'Kth Largest Element', level: 'medium' },
  { id: 'Q12', file: 'mocks/12-rotate-matrix.js', title: 'Rotate Matrix', level: 'medium' },
  { id: 'Q13', file: 'mocks/13-word-break.js', title: 'Word Break', level: 'hard' },
  { id: 'Q14', file: 'mocks/14-number-of-islands.js', title: 'Number of Islands', level: 'medium' },
  { id: 'Q15', file: 'mocks/15-meeting-rooms-ii.js', title: 'Meeting Rooms II', level: 'hard' },
  { id: 'Q16', file: 'mocks/16-search-suggestions-prefix.js', title: 'Search Suggestions Prefix', level: 'hard' },
];

const args = process.argv.slice(2);
const countArg = Number(readArg(args, '--count') || '2');
const minutesArg = Number(readArg(args, '--minutes') || '70');
const count = Math.max(1, Math.min(countArg, catalog.length));

const selected = pickRandom(catalog, count);

console.log('JavaScript Mock Round');
console.log(`Total questions: ${count}`);
console.log(`Time budget: ${minutesArg} minutes`);
console.log('');
console.log('Questions:');

selected.forEach((q, idx) => {
  console.log(`${idx + 1}. ${q.id} ${q.title} [${q.level}]`);
  console.log(`   File: ${q.file}`);
  console.log(`   Run: node ${q.file}`);
});

console.log('');
console.log('Tip: open the file first, then run with stdin from RUN-MOCKS.md examples.');

function readArg(argsList, key) {
  const idx = argsList.indexOf(key);
  if (idx === -1 || idx === argsList.length - 1) return null;
  return argsList[idx + 1];
}

function pickRandom(items, countValue) {
  const pool = items.slice();
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, countValue);
}

module.exports = { pickRandom };
