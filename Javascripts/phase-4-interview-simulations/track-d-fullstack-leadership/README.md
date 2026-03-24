# Track D: Full Stack Leadership Interview Simulation

## Simulation Format

| Round | Type | Time | Description |
|-------|------|------|-------------|
| 1 | Code Review | 45 min | Find bugs, security issues, anti-patterns in a real-world Node.js handler |
| 2 | Architecture | 60 min | Propose a monolith-to-microservices migration |
| 3 | Leadership | 30 min | Write an ADR for a technical decision under ambiguity |

**Total simulation time: ~2.5 hours**

## Round Files

### Round 1: Code Review
- [prompt.md](code-review-round/prompt.md) — Instructions and scoring rubric
- [starter/code-under-review.js](code-review-round/starter/code-under-review.js) — Code to review
- [solution/review-findings.md](code-review-round/solution/review-findings.md) — 8+ issue list (reference)
- [solution/fixed.js](code-review-round/solution/fixed.js) — Corrected code

### Round 2: Architecture
- [prompt.md](architecture-round/prompt.md) — Monolith migration scenario
- [solution/sample-answer.md](architecture-round/solution/sample-answer.md) — Strangler Fig reference answer

### Round 3: Leadership (ADR)
- [prompt.md](leadership-round/prompt.md) — REST vs GraphQL decision
- [solution/sample-adr.md](leadership-round/solution/sample-adr.md) — Reference ADR

## Scorecard

See [scorecard.md](scorecard.md) for evaluation rubric.

## Who This Track Tests

Track D targets the **principal/staff engineer bar**, specifically:

- **Code quality judgment**: Do you catch subtle security issues and understand why they matter?
- **Architectural reasoning**: Can you apply known patterns (Strangler Fig, Saga, CQRS) to real ambiguous situations?
- **Technical leadership**: Can you write a clear, defensible decision record that a team can align on?
- **Communication under pressure**: Can you produce structured written output within time constraints?
