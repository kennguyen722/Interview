# Module 10 Solution - Professional Engineering and Leadership

Production-grade baseline for lessons 10.1 through 10.4.

## Lesson Coverage

- 10.1 ADRs
  - End-to-end ADR lifecycle API with status transitions and ownership.
- 10.2 Technical Communication
  - Structured stakeholder brief generation from technical updates.
- 10.3 Code Review Mastery
  - Review quality gate endpoint with risk scoring and mandatory checks.
- 10.4 Mentoring and Team Practices
  - Mentoring plan API with goals, actions, and follow-up cadence.

## Run

```bash
mvn spring-boot:run
```

## API Endpoints

- `POST /api/v1/adrs` create ADR
- `PATCH /api/v1/adrs/{adrId}/status` change ADR status
- `POST /api/v1/reviews/evaluate` evaluate review quality
- `POST /api/v1/communication/brief` generate stakeholder brief
- `POST /api/v1/mentoring/plans` create mentoring plan

## Why This Baseline

This project models leadership artifacts as production APIs so teams can automate engineering governance, communication quality, and coaching routines.
