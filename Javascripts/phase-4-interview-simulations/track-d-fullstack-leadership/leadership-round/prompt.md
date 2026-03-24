# Track D — Leadership Round: Architecture Decision Record (ADR)

## Setup

- Time limit: 30 minutes
- Format: Written ADR document
- Target: Demonstrate technical leadership and decision-making under ambiguity

## Context

You are the principal engineer for a growing fintech startup. The product team wants to add a **new "Financial Dashboard"** feature that aggregates data from multiple backend services (accounts, transactions, budgets, investments). This will be the primary data endpoint for both the web app and the mobile app.

The team is debating two approaches:
1. **REST API**: Individual endpoints per resource, client assembles the page
2. **GraphQL API**: Single endpoint, client specifies exactly what it needs

You must **write an ADR** (Architecture Decision Record) documenting your decision. You WILL be asked to defend it.

## Your Task

Using `starter/template.md` as a starting point, write a complete ADR that includes:
1. **Status**: Decided / Proposed / Deprecated / Superseded
2. **Context**: What problem are we solving? What are the constraints?
3. **Decision**: What did you decide? Be specific.
4. **Rationale**: Why this option? What alternatives were evaluated?
5. **Consequences**: What becomes easier? What becomes harder?
6. **Tradeoffs accepted**: What are you consciously giving up?

## Scoring

| Area | Points |
|------|--------|
| Clear, unambiguous decision | 2 |
| Context accurately captures constraints | 2 |
| Alternatives considered with specific tradeoffs | 2 |
| Consequences (positive + negative) | 2 |
| Would you escalate or consult anyone? | 2 |

See `solution/sample-adr.md` for a strong answer.
