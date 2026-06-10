# Module 0 Solution - Foundations and Setup

Production baseline for lessons 0.1 through 0.3.

## Coverage

- 0.1 Developer Environment Setup
  - Validates required runtime values from environment and properties.
- 0.2 Build Tools and Project Lifecycle
  - Maven project with unit tests and deterministic build output.
- 0.3 SDLC and Professional Workflow
  - Build report generator to formalize setup checks and handoff artifacts.

## Run

```bash
mvn test
mvn -q exec:java -Dexec.mainClass=com.interview.module0.FoundationApp
```
