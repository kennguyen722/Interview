# Run JavaScript HackerRank Mocks

This guide shows how to run each mock question and how to run all mocks in one shot.

## Prerequisites

- Node.js 18+
- PowerShell terminal

## Go to folder

```powershell
Set-Location "d:\GitHub_Src\Interview\javascript interview prep\hackerrank_interview"
```

## Run all mocks at once

```powershell
node .\run-all-mocks.js
```

Or from repo root:

```powershell
npm run mock:hr:all
```

You should see PASS/FAIL per question and a summary.

## Generate a timed random mock round

From repo root:

```powershell
npm run mock:hr:round
```

For 3 questions in a 90-minute session:

```powershell
npm run mock:hr:round:3
```

Or custom values:

```powershell
node .\run-random-mock-round.js --count 4 --minutes 120
```

## Run one mock at a time (stdin style)

### Q1 Two Sum

```powershell
"4`n2 7 11 15`n9" | node .\mocks\01-two-sum.js
```

### Q2 Longest Unique Substring

```powershell
"abcabcbb" | node .\mocks\02-longest-unique-substring.js
```

### Q3 Product Except Self

```powershell
"4`n1 2 3 4" | node .\mocks\03-product-except-self.js
```

### Q4 Merge Intervals

```powershell
"4`n1 3`n2 6`n8 10`n15 18" | node .\mocks\04-merge-intervals.js
```

### Q5 Top K Frequent

```powershell
"6`n1 1 1 2 2 3`n2" | node .\mocks\05-top-k-frequent.js
```

### Q6 Min Window Substring

```powershell
"ADOBECODEBANC`nABC" | node .\mocks\06-min-window-substring.js
```

### Q7 Task Scheduler Cooldown

```powershell
"6`nA A A B B B`n2" | node .\mocks\07-task-scheduler-cooldown.js
```

### Q8 LRU Cache Simulator

```powershell
"2`n6`nPUT a 1`nPUT b 2`nGET a`nPUT c 3`nGET b`nGET c" | node .\mocks\08-lru-cache-simulator.js
```

### Q9 Valid Parentheses

```powershell
"()[]{}" | node .\mocks\09-valid-parentheses.js
```

### Q10 Group Anagrams

```powershell
"6`neat`ntea`ntan`nate`nnat`nbat" | node .\mocks\10-group-anagrams.js
```

### Q11 Kth Largest Element

```powershell
"6`n3 2 1 5 6 4`n2" | node .\mocks\11-kth-largest-element.js
```

### Q12 Rotate Matrix

```powershell
"3`n1 2 3`n4 5 6`n7 8 9" | node .\mocks\12-rotate-matrix.js
```

### Q13 Word Break

```powershell
"leetcode`n2`nleet`ncode" | node .\mocks\13-word-break.js
```

### Q14 Number of Islands

```powershell
"4`n5`n1 1 0 0 0`n1 1 0 0 0`n0 0 1 0 0`n0 0 0 1 1" | node .\mocks\14-number-of-islands.js
```

### Q15 Meeting Rooms II

```powershell
"3`n0 30`n5 10`n15 20" | node .\mocks\15-meeting-rooms-ii.js
```

### Q16 Search Suggestions Prefix

```powershell
"5`nmobile`nmouse`nmoneypot`nmonitor`nmousepad`nmouse" | node .\mocks\16-search-suggestions-prefix.js
```

## Important note

These mock files are stdin-based like HackerRank. Running with plain arguments (for example `node .\mocks\01-two-sum.js 10 20`) will not work unless the script explicitly supports argument mode.
