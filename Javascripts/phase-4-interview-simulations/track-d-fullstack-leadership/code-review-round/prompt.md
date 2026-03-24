# Track D — Code Review Round

## Setup

- Time limit: 45 minutes
- Mode: Open code, no AI assistance
- Target: Identify 6+ issues with clear explanations and correct fixes

## The Task

You are reviewing a pull request for a Node.js e-commerce API. Open `starter/code-under-review.js` and perform a thorough code review.

For each issue you find, document:
1. **What is wrong** — describe the bug or anti-pattern
2. **Why it matters** — security impact, performance impact, reliability risk
3. **How to fix it** — provide corrected code

## Scoring

| Issues Found | Score |
|-------------|-------|
| 8 issues correctly explained | 10/10 |
| 6-7 issues | 8/10 |
| 4-5 issues | 6/10 |
| < 4 issues | 4/10 |

*Issues where the fix is incorrect count as 0.5 points.*

## Categories to Check

Look for issues in these categories:
- **SQL Injection** — unsanitized input in queries
- **Authentication/Authorization** — missing auth checks
- **Sensitive Data Exposure** — PII, credentials in logs or responses
- **Performance** — N+1 queries, blocking operations, unbounded caches
- **Path Traversal** — user-supplied file paths
- **Async/Reliability** — blocking third-party calls in critical path
- **Memory Leaks** — unbounded growth
- **Error Handling** — unhandled promise rejections, no try/catch

## See `solution/review-findings.md` for the complete issue list.
