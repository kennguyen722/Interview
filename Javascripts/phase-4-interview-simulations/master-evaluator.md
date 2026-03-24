# Master Evaluator (All Tracks)

Use this sheet to aggregate all mock interview results into a single readiness score.

## Scoring Inputs

- Track A overall average: `A`
- Track B overall average: `B`
- Track C overall average: `C`

Recommended weighted final score:

$$
Final = (0.30 \times A) + (0.30 \times B) + (0.40 \times C)
$$

Reason: Track C emphasizes architecture and distributed-system reasoning expected in advanced interviews.

## Session Log

| Session | Track | Coding | Debugging | Design | Round Average | Notes |
|---|---|---:|---:|---:|---:|---|
| 1 | A |  |  |  |  |  |
| 2 | B |  |  |  |  |  |
| 3 | C |  |  |  |  |  |
| 4 | A |  |  |  |  |  |
| 5 | B |  |  |  |  |  |
| 6 | C |  |  |  |  |  |
| 7 | A |  |  |  |  |  |
| 8 | B |  |  |  |  |  |
| 9 | C |  |  |  |  |  |

## Worked Example (Sample Run)

| Session | Track | Coding | Debugging | Design | Round Average | Notes |
|---|---|---:|---:|---:|---:|---|
| 1 | A | 7.8 | 7.2 | 7.9 | 7.63 | Missed one stale-response edge case |
| 2 | B | 8.1 | 7.6 | 8.0 | 7.90 | Good idempotency, weak retry explanation |
| 3 | C | 7.4 | 7.3 | 8.0 | 7.57 | Architecture decent, event ordering answer shallow |
| 4 | A | 8.4 | 8.0 | 8.2 | 8.20 | Strong improvement on event lifecycle |
| 5 | B | 8.5 | 8.1 | 8.4 | 8.33 | Better failure-mode coverage |
| 6 | C | 8.0 | 7.8 | 8.5 | 8.10 | Better compensation strategy |
| 7 | A | 8.6 | 8.2 | 8.4 | 8.40 | Consistent and clean reasoning |
| 8 | B | 8.7 | 8.3 | 8.6 | 8.53 | Excellent observability discussion |
| 9 | C | 8.4 | 8.0 | 8.9 | 8.43 | Strong architecture and trade-offs |

Sample track totals from the worked example:
- A sessions: 7.63, 8.20, 8.40 -> A = 8.08
- B sessions: 7.90, 8.33, 8.53 -> B = 8.25
- C sessions: 7.57, 8.10, 8.43 -> C = 8.03

Weighted final score from the worked example:

$$
Final = (0.30 \times 8.08) + (0.30 \times 8.25) + (0.40 \times 8.03) = 8.11
$$

Interpretation for this sample:
- Final score 8.11 means close, but below advanced target 8.3.
- Priority focus should be Track C debugging and event ordering explanations.

## Track Summary

| Track | Session Averages | Track Overall |
|---|---|---:|
| A |  |  |
| B |  |  |
| C |  |  |

## Final Readiness

- Final weighted score: `________`
- Weakest area: `________`
- Strongest area: `________`

## Promotion Thresholds

- Ready for advanced interview loop: Final >= 8.3 and no track below 7.5.
- Ready for top-tier interview loop: Final >= 8.8 and no track below 8.0.
- Hold and remediate: Any track below 7.0.

## Remediation Plan Template

1. Lowest-scoring skill:
2. Drill to run this week:
3. Target score next session:
4. Evidence of improvement:
