# Track D — Architecture Round

## Setup

- Time limit: 60 minutes
- Format: Design discussion + written answer
- Level: Senior → Principal

## Problem

You are joining a company whose entire e-commerce platform runs as a **Ruby on Rails monolith** with a PostgreSQL database. The system is currently handling **500K requests/day** and the team of 15 engineers is slowing down due to merge conflicts, long test suite times (45 minutes), and deployment coupling.

The CTO has asked you to **propose a migration strategy** to microservices.

## Constraints

- Zero downtime during migration
- Existing PostgreSQL data must be preserved
- Team must continue shipping features during migration
- Budget for 3 engineers over 6 months

## Your Task

Using the template in `starter/template.md`, answer the following:

1. **Should we migrate to microservices?** Make a specific recommendation first. Do not hedge.
2. **Which bounded contexts / domains** would you split first? List them with rationale.
3. **Migration strategy**: Explain the Strangler Fig pattern and how you'd apply it here.
4. **Data decomposition**: How do you break apart the shared PostgreSQL database? What is the sequence?
5. **What risks would you warn the CTO about?** Name at least 3 specific risks.
6. **What does "done" look like?** Define your success criteria.

## Scoring Rubric

| Area | Points |
|------|--------|
| Clear recommendation (not a hedge) | 2 |
| Correct use of Strangler Fig | 2 |
| Sensible domain decomposition | 2 |
| Specific data migration strategy | 2 |
| Risk articulation | 1 |
| Success criteria | 1 |

See `solution/sample-answer.md` for a strong answer.
