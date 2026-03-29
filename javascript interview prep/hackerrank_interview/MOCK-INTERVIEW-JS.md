# JavaScript Mock Interview Pack (HackerRank Style)

This pack gives you 16 software engineer style coding questions with runnable solutions.

## How to practice like a real mock

1. Pick 2 questions for a 70-minute session.
2. Spend 5 minutes on clarifying questions and constraints.
3. Spend 25 minutes coding each question.
4. Spend 10 minutes for tests and complexity explanation.
5. Explain trade-offs out loud after each solution.

## Set B (additional mocks)

- Q9 Valid Parentheses (`mocks/09-valid-parentheses.js`)
- Q10 Group Anagrams (`mocks/10-group-anagrams.js`)
- Q11 Kth Largest Element (`mocks/11-kth-largest-element.js`)
- Q12 Rotate Matrix (`mocks/12-rotate-matrix.js`)
- Q13 Word Break (`mocks/13-word-break.js`)
- Q14 Number of Islands (`mocks/14-number-of-islands.js`)
- Q15 Meeting Rooms II (`mocks/15-meeting-rooms-ii.js`)
- Q16 Search Suggestions Prefix (`mocks/16-search-suggestions-prefix.js`)

## Question 1: Two Sum

- File: `mocks/01-two-sum.js`
- Difficulty: Easy
- Skills: Hash map, arrays

Problem:
Given an integer array and a target value, return indices of two numbers such that they add up to target.

Input:
- line 1: n
- line 2: n space-separated integers
- line 3: target

Output:
- two indices separated by space, or `-1 -1`

Sample input:
```
4
2 7 11 15
9
```

Sample output:
```
0 1
```

Solution idea:
Use a hash map from value to index while scanning. For each value `x`, check if `target - x` was seen.

Complexity:
- Time: O(n)
- Space: O(n)

## Question 2: Longest Unique Substring

- File: `mocks/02-longest-unique-substring.js`
- Difficulty: Medium
- Skills: Sliding window

Problem:
Return the length of the longest substring with all unique characters.

Input:
- line 1: string `s`

Output:
- max length

Sample input:
```
abcabcbb
```

Sample output:
```
3
```

Solution idea:
Use a sliding window and map of last seen index to move left pointer when duplicates appear.

Complexity:
- Time: O(n)
- Space: O(k), k = charset size

## Question 3: Product of Array Except Self

- File: `mocks/03-product-except-self.js`
- Difficulty: Medium
- Skills: Prefix/suffix products

Problem:
Return an array where each element is the product of all other elements.

Input:
- line 1: n
- line 2: n space-separated integers

Output:
- n space-separated integers

Sample input:
```
4
1 2 3 4
```

Sample output:
```
24 12 8 6
```

Solution idea:
First pass stores prefix products, second pass multiplies suffix products.

Complexity:
- Time: O(n)
- Space: O(1) extra (excluding output)

## Question 4: Merge Intervals

- File: `mocks/04-merge-intervals.js`
- Difficulty: Medium
- Skills: Sorting, interval sweep

Problem:
Merge overlapping intervals.

Input:
- line 1: n
- next n lines: `start end`

Output:
- line 1: merged count
- next lines: merged intervals

Sample input:
```
4
1 3
2 6
8 10
15 18
```

Sample output:
```
3
1 6
8 10
15 18
```

Solution idea:
Sort by start, then merge into output list if overlap exists.

Complexity:
- Time: O(n log n)
- Space: O(n)

## Question 5: Top K Frequent Elements

- File: `mocks/05-top-k-frequent.js`
- Difficulty: Medium
- Skills: Frequency counting, sorting

Problem:
Return top `k` most frequent numbers. Break ties by smaller number first.

Input:
- line 1: n
- line 2: n space-separated integers
- line 3: k

Output:
- k numbers separated by spaces

Sample input:
```
6
1 1 1 2 2 3
2
```

Sample output:
```
1 2
```

Solution idea:
Count frequencies in map, sort pairs by frequency descending and value ascending.

Complexity:
- Time: O(n log n)
- Space: O(n)

## Question 6: Minimum Window Substring

- File: `mocks/06-min-window-substring.js`
- Difficulty: Hard
- Skills: Sliding window with counts

Problem:
Return the smallest substring of `s` containing all chars of `t` (with multiplicity). If none, print `-1`.

Input:
- line 1: s
- line 2: t

Output:
- min window string or `-1`

Sample input:
```
ADOBECODEBANC
ABC
```

Sample output:
```
BANC
```

Solution idea:
Track needed counts, expand right until all needed chars are satisfied, then shrink from left.

Complexity:
- Time: O(|s| + |t|)
- Space: O(k)

## Question 7: Task Scheduler With Cooldown

- File: `mocks/07-task-scheduler-cooldown.js`
- Difficulty: Medium
- Skills: Greedy counting

Problem:
Given tasks and cooldown `n`, compute minimum CPU intervals to finish all tasks.

Input:
- line 1: number of tasks
- line 2: tasks separated by spaces
- line 3: cooldown

Output:
- minimum intervals

Sample input:
```
6
A A A B B B
2
```

Sample output:
```
8
```

Solution idea:
Use the bucket formula from the most frequent task count.

Complexity:
- Time: O(n)
- Space: O(k)

## Question 8: LRU Cache Simulator

- File: `mocks/08-lru-cache-simulator.js`
- Difficulty: Hard
- Skills: Design, hash map order semantics

Problem:
Simulate an LRU cache supporting `PUT key value` and `GET key`.

Input:
- line 1: capacity
- line 2: q operations
- next q lines: commands

Output:
- print value for each GET (or -1)

Sample input:
```
2
6
PUT a 1
PUT b 2
GET a
PUT c 3
GET b
GET c
```

Sample output:
```
1
-1
3
```

Solution idea:
Use JavaScript `Map` insertion order. Refresh order on `GET` and `PUT` update. Evict first key when capacity exceeded.

Complexity:
- Time: O(1) average for GET/PUT
- Space: O(capacity)

## Run commands

From `hackerrank_interview` folder:

```powershell
# Q1
"4`n2 7 11 15`n9" | node .\mocks\01-two-sum.js

# Q6
"ADOBECODEBANC`nABC" | node .\mocks\06-min-window-substring.js

# Q8
"2`n6`nPUT a 1`nPUT b 2`nGET a`nPUT c 3`nGET b`nGET c" | node .\mocks\08-lru-cache-simulator.js
```
