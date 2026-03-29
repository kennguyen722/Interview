# Capstone 04: Enterprise Workflow Platform Slice

Requirements coverage:
- Saga orchestration with compensation: `runSaga`
- Outbox with replay safety: `replayOutbox`
- Multi-tenant isolation: per-tenant stores in `createWorkflowPlatform`
- SLO dashboard and incident runbook: `getSloDashboard`, `getIncidentRunbook`

Run tests:
- `node --test capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js`
