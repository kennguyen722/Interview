# Phase 4: Interview Simulations (Senior Readiness)

Goal: Convert technical knowledge into confident interview performance.

## Simulation Format

Each simulation has 3 rounds:
1. Coding (45 minutes)
2. System design (45-60 minutes)
3. Debugging and production incident review (30 minutes)

## Simulation Tracks

### Track A: Frontend + Events + Performance
- Build interactive event-heavy module
- Fix memory leak caused by stale listeners
- Optimize rendering and input responsiveness

### Track B: Backend + APIs + Reliability
- Implement resilient API workflow with idempotency
- Handle partial failures in dependent services
- Add retry policy and observability hooks

### Track C: Architecture + Scale + Microservices
- Break down a monolith into bounded services
- Define event contracts and versioning strategy
- Design rollback and failure-recovery plan

### Track D: Full Stack Leadership (Principal Level)
- Code review: identify 8+ critical issues in a real Node.js API
- Architecture critique: plan a monolith-to-microservices migration
- Leadership: write an ADR defending a technical decision

## Track Folders

- [track-a-frontend-events/coding-round/prompt.md](track-a-frontend-events/coding-round/prompt.md)
- [track-a-frontend-events/debugging-round/prompt.md](track-a-frontend-events/debugging-round/prompt.md)
- [track-a-frontend-events/design-round/starter/template.md](track-a-frontend-events/design-round/starter/template.md)
- [track-a-frontend-events/scorecard.md](track-a-frontend-events/scorecard.md)
- [track-b-backend-reliability/coding-round/prompt.md](track-b-backend-reliability/coding-round/prompt.md)
- [track-b-backend-reliability/debugging-round/prompt.md](track-b-backend-reliability/debugging-round/prompt.md)
- [track-b-backend-reliability/design-round/starter/template.md](track-b-backend-reliability/design-round/starter/template.md)
- [track-b-backend-reliability/scorecard.md](track-b-backend-reliability/scorecard.md)
- [track-c-architecture-microservices/coding-round/prompt.md](track-c-architecture-microservices/coding-round/prompt.md)
- [track-c-architecture-microservices/debugging-round/prompt.md](track-c-architecture-microservices/debugging-round/prompt.md)
- [track-c-architecture-microservices/design-round/starter/template.md](track-c-architecture-microservices/design-round/starter/template.md)
- [track-c-architecture-microservices/scorecard.md](track-c-architecture-microservices/scorecard.md)
- **[track-d-fullstack-leadership/README.md](track-d-fullstack-leadership/README.md)** ← Principal level
- [track-d-fullstack-leadership/code-review-round/prompt.md](track-d-fullstack-leadership/code-review-round/prompt.md)
- [track-d-fullstack-leadership/architecture-round/prompt.md](track-d-fullstack-leadership/architecture-round/prompt.md)
- [track-d-fullstack-leadership/leadership-round/prompt.md](track-d-fullstack-leadership/leadership-round/prompt.md)
- [track-d-fullstack-leadership/scorecard.md](track-d-fullstack-leadership/scorecard.md)
- [weekly-mock-schedule.md](weekly-mock-schedule.md)
- [master-evaluator.md](master-evaluator.md)

## How To Run

From [Javascripts](../README.md), run solution scripts directly:

```powershell
node phase-4-interview-simulations/track-a-frontend-events/coding-round/solution/index.js
node phase-4-interview-simulations/track-b-backend-reliability/coding-round/solution/index.js
node phase-4-interview-simulations/track-c-architecture-microservices/coding-round/solution/index.js
```

## Communication Framework During Interviews

Use this response structure for every question:
1. Clarify requirements and constraints.
2. Propose baseline solution quickly.
3. Discuss complexity and trade-offs.
4. Address reliability and edge cases.
5. Explain how to test and monitor in production.

## Final Readiness Rubric

You are ready when you consistently:
- Finish medium/hard coding rounds with clean structure and tests.
- Discuss architecture choices with context-specific trade-offs.
- Include reliability, observability, and scalability in design answers.
- Communicate clearly and adjust based on interviewer feedback.
