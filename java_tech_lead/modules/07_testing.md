Module 7 — Testing & Quality

Q1: How do you design testable code?
Answer: Keep small, single-responsibility classes; use dependency injection; prefer interfaces for collaborators; avoid static state; write deterministic behavior and seam points for test harnesses.

Example: `examples/Module07Q1.java` shows a function with injected dependency.

Q2: What are types of tests you should lead in a team?
Answer: Unit tests, integration tests, component tests, contract tests, performance tests, and end-to-end tests. Define a testing pyramid and automation strategy.

Example: `examples/Module07Q2.java` sketches a fake dependency for unit testing.

Q3: How to introduce test automation in a team without slowing delivery?
Answer: Start with fast unit tests, use CI gating for critical branches, flaky-test tracking, parallel test execution, and incremental rollout of integration tests.

Example: `examples/Module07Q3.java` shows a basic assertion-style check.
