# Track D Scorecard: Full Stack Leadership

## Round 1: Code Review (45 min)

| Issue Found | Description | Max | Your Score |
|-------------|-------------|-----|------------|
| SQL injection (3 locations) | Parameterized queries required | 2 | |
| Missing auth check | userId authorization | 1 | |
| PII in logs | Sensitive data exposure | 1 | |
| Unbounded cache / memory leak | No TTL or size limit | 1 | |
| N+1 query | Batch query required | 1 | |
| Blocking third-party call | Email in critical path | 1 | |
| Path traversal | User-supplied filename | 1 | |
| Sensitive data in admin report | SSN/creditCard fields exposed | 1 | |
| Bonus: no error handling | Missing try/catch / async error handler | 1 |  |

**Round 1 Max: 10** | **Your Score: ___/10**

Pass threshold: ≥7/10

---

## Round 2: Architecture (60 min)

| Criterion | Description | Max | Your Score |
|-----------|-------------|-----|------------|
| Clear recommendation | Made a specific call, not a hedge | 2 | |
| Strangler Fig applied correctly | Incremental, not big-bang | 2 | |
| Domain decomposition reasoning | Sensible order with rationale | 2 | |
| Data migration strategy | Dual-write, CDC, sequence | 2 | |
| Risk articulation | Named ≥3 specific risks | 1 | |
| Success criteria | Measurable "done" definition | 1 | |

**Round 2 Max: 10** | **Your Score: ___/10**

Pass threshold: ≥7/10

---

## Round 3: Leadership / ADR (30 min)

| Criterion | Description | Max | Your Score |
|-----------|-------------|-----|------------|
| Unambiguous decision stated upfront | Should be readable in first 2 lines | 2 | |
| Context accurately frames the problem | Constraints, forces, prior state | 2 | |
| Alternatives evaluated with tradeoffs | Not just "pros/cons" listing | 2 | |
| Positive + negative consequences | Both sides addressed | 2 | |
| Escalation / consultation noted | Shows leadership judgment | 1 | |
| Review date or trigger included | Shows long-term thinking | 1 | |

**Round 3 Max: 10** | **Your Score: ___/10**

Pass threshold: ≥7/10

---

## Summary

| Round | Score | Pass? |
|-------|-------|-------|
| Round 1: Code Review | /10 | |
| Round 2: Architecture | /10 | |
| Round 3: Leadership   | /10 | |
| **Average** | **/10** | |

**Track D Pass**: Average ≥7.5, no round below 6.

**Interpretation:**
- 9-10 average: Exceptional — principal-level communication and judgment
- 8-8.9: Strong — ready for principal interviews
- 7-7.9: Adequate — needs one more pass with more depth
- <7 any round: Focus area — return to the corresponding lesson and redo
