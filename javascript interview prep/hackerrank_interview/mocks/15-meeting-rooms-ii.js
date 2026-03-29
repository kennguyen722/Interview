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
  const intervals = [];
  for (let i = 0; i < n; i += 1) {
    const [s, e] = (lines[i + 1] || '').trim().split(/\s+/).map(Number);
    intervals.push([s, e]);
  }

  const ans = minMeetingRooms(intervals);
  process.stdout.write(String(ans) + '\n');
});

function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let used = 0;
  let endPtr = 0;
  let maxUsed = 0;

  for (let i = 0; i < starts.length; i += 1) {
    while (endPtr < ends.length && starts[i] >= ends[endPtr]) {
      used -= 1;
      endPtr += 1;
    }
    used += 1;
    maxUsed = Math.max(maxUsed, used);
  }

  return maxUsed;
}

module.exports = { minMeetingRooms };
