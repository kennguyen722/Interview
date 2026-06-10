# Module 11 Solution - Capstone and Interview Readiness

Production-grade baseline for lessons 11.1 through 11.5.

## Lesson Coverage

- 11.1 Capstone Planning
  - Milestone-driven capstone plan API with ownership and risks.
- 11.2 Build Sprint 1
  - Sprint update endpoint that tracks progress and blockers.
- 11.3 Build Sprint 2
  - Delivery health scoring for execution quality.
- 11.4 Build Sprint 3
  - Release readiness report with unresolved-risk checks.
- 11.5 Interview and Portfolio Package
  - Portfolio package generator with STAR stories and architecture highlights.

## Run

```bash
mvn spring-boot:run
```

## Key Endpoints

- `POST /api/v1/capstone/plans`
- `POST /api/v1/capstone/sprints/{planId}/updates`
- `GET /api/v1/capstone/sprints/{planId}/health`
- `GET /api/v1/capstone/releases/{planId}/readiness`
- `POST /api/v1/interview/package`

## Design Notes

This baseline treats capstone delivery and interview readiness as first-class operational workflows so engineering execution and career outcomes are measurable.
