# JavaScript Coding Interview Mastery (Novice to Advanced)

This track is a complete interview preparation path focused on real-world JavaScript engineering, not only algorithm drills.

## Outcomes

By the end of this path, you will be able to:
- Solve core JavaScript coding questions with clean, explainable solutions.
- Handle browser and Node.js event-driven problems confidently.
- Design production-grade services with good architecture and quality controls.
- Explain scalable application design, microservice trade-offs, and reliability patterns.
- Optimize performance with measurable improvements and clear reasoning.
- Pass practical coding rounds, system design rounds, and behavioral engineering discussions.

## Learning Structure

- [phase-1-foundations/README.md](phase-1-foundations/README.md): language fundamentals + problem-solving baseline
- [phase-2-professional-coding/README.md](phase-2-professional-coding/README.md): production coding, events, async, APIs, testing
- [phase-2-professional-coding/real-world-exercises.md](phase-2-professional-coding/real-world-exercises.md): hands-on event/API/reliability coding drills
- [phase-3-architecture-and-scale/README.md](phase-3-architecture-and-scale/README.md): architecture, scale, microservices, reliability, performance
- [phase-3-architecture-and-scale/system-design-playbook.md](phase-3-architecture-and-scale/system-design-playbook.md): interview structure for scalable system design
- [phase-4-interview-simulations/README.md](phase-4-interview-simulations/README.md): mock interviews and communication practice (Tracks A/B/C/D)
- [phase-4-interview-simulations/mock-questions.md](phase-4-interview-simulations/mock-questions.md): coding, design, debugging, and behavioral mock prompts
- [phase-5-principal-fullstack/README.md](phase-5-principal-fullstack/README.md): **principal/staff-level** — TypeScript patterns, React architecture, full-stack, database, auth, observability
- [problem-bank/README.md](problem-bank/README.md): curated real-world coding prompts (Sections A–G)
- [capstones/README.md](capstones/README.md): end-to-end projects with production constraints
- [study-plan-16-weeks.md](study-plan-16-weeks.md): week-by-week execution plan
- [assets/interview-scorecard.md](assets/interview-scorecard.md): structured self-assessment rubric
- [assets/principal-interview-guide.md](assets/principal-interview-guide.md): principal/staff interview strategy
- [assets/code-review-rubric.md](assets/code-review-rubric.md): code review scoring guide
- [assets/behavioral-principal.md](assets/behavioral-principal.md): STAR behavioral question bank for principal roles

## Quick Start

1. Start with [phase-1-foundations/README.md](phase-1-foundations/README.md) and complete one module every week.
2. Solve 3 problems per week from [problem-bank/README.md](problem-bank/README.md) under a timer.
3. From week 5 onward, complete one exercise from [phase-2-professional-coding/real-world-exercises.md](phase-2-professional-coding/real-world-exercises.md) every week.
4. From week 9 onward, answer one design question using [phase-3-architecture-and-scale/system-design-playbook.md](phase-3-architecture-and-scale/system-design-playbook.md).
5. Track progress after each mock using [assets/interview-scorecard.md](assets/interview-scorecard.md).

## Starter and Solution Code

Each major module now includes:
- `starter/`: incomplete tasks for practice
- `solution/`: complete reference implementation
- `lesson.md`: goals and assignment context

Run any module directly with Node, for example:

```powershell
node phase-1-foundations/module-01-core-runtime/solution/index.js
```

## Suggested Timeline (20 Weeks)

- Weeks 1–4: Phase 1 (Foundations)
- Weeks 5–8: Phase 2 (Professional Coding)
- Weeks 9–13: Phase 3 (Architecture & Scale)
- Weeks 14–16: Phase 4 (Interview Simulations: Tracks A/B/C/D)
- Weeks 17–20: Phase 5 (Principal/Staff — TypeScript, React, Full Stack, Auth, Observability)

If you are full-time preparing, compress to 10–12 weeks by doing 2 modules per week.

## Study Method

For each module:
1. Read concepts and write your own short notes.
2. Implement exercises without AI help for 45-60 minutes.
3. Refactor for readability, complexity, and edge cases.
4. Add tests and explain trade-offs out loud.
5. Do one timed interview simulation.

## Interview Readiness Checklist

You are interview-ready when you can:
- Solve medium-level coding tasks in 25-35 minutes.
- Explain time and space complexity correctly.
- Use async patterns safely (timeouts, retries, cancellation, backpressure).
- Design event-driven components without memory leaks or race conditions.
- Propose scalable architecture with clear failure handling and observability.
- Discuss microservice boundaries, consistency model, and deployment strategy.
- Defend performance decisions with metrics, not assumptions.

## Deliverables You Should Build During This Track

- Event-driven task scheduler (browser + Node variant)
- Rate-limited notification dispatcher
- Scalable URL shortener API
- Distributed order workflow (microservices + event bus)
- Reliability toolkit (retry, circuit breaker, idempotency, dead letter handling)
- Performance benchmark suite with profiling report
