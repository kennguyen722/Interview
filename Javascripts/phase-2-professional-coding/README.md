# Phase 2: Professional Coding (Junior -> Mid)

Goal: Build production-quality JavaScript and solve real-world coding problems.

## Module 5: Event Handling and Real-World Frontend Flows

Focus:
- DOM events: capture, bubble, delegation
- Event-driven UI architecture
- Preventing memory leaks with listener cleanup
- Throttle/debounce and responsiveness

Practice tasks:
- Infinite scroll with cancellable fetch requests
- Form autosave with debounce + retry
- Keyboard event manager with shortcut registry

Interview-style problems:
- Build a reusable event bus for UI modules
- Diagnose a bug caused by duplicate listeners

## Module 6: Node.js APIs and Backend Engineering Basics

Focus:
- REST API design and endpoint contracts
- Validation, sanitization, and error boundaries
- Logging and correlation IDs
- Idempotency for write operations

Practice tasks:
- Build a notes API with idempotent create endpoint
- Implement centralized error middleware
- Add request tracing IDs and structured logs

Interview-style problems:
- Design robust `POST /payments` with duplicate-submission protection

## Module 7: Testing, Quality, and Maintainability

Focus:
- Unit, integration, and contract tests
- Mocking external services safely
- Linting, formatting, and static analysis
- Refactoring legacy code under tests

Practice tasks:
- Add tests for async race conditions
- Write integration tests for failure paths
- Refactor a large function into testable units

Interview-style problems:
- Improve a flaky test suite under CI constraints

## Module 8: Security and Defensive Coding

Focus:
- Input validation and output encoding
- Common API vulnerabilities (injection, broken auth)
- Secret handling and environment config
- Rate limiting and abuse protection

Practice tasks:
- Add request schema validation middleware
- Build simple role-based authorization guards
- Add per-client rate limiting with fallback behavior

Interview-style problems:
- Review a vulnerable code snippet and patch it

## Exit Criteria

- You can implement production-ready API handlers with tests.
- You can reason about event handling bugs and memory leaks.
- You can discuss trade-offs among maintainability, velocity, and risk.

## Module Folders

- [module-05-events-ui](module-05-events-ui)
- [module-06-node-api](module-06-node-api)
- [module-07-testing-quality](module-07-testing-quality)
- [module-08-security-defensive](module-08-security-defensive)
