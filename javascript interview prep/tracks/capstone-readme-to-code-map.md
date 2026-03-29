# Capstone README to Code Map

This document maps each capstone requirement in [capstones/capstone-projects.md](../capstones/capstone-projects.md) to concrete code and tests.

## Capstone 01: Business Rules Engine

| Requirement | Function(s) | Starter | Solution | Tests |
|---|---|---|---|---|
| Parse rules from config | parseRules | [capstones/01-business-rules-engine/starter/index.js](../capstones/01-business-rules-engine/starter/index.js) | [capstones/01-business-rules-engine/solution/index.js](../capstones/01-business-rules-engine/solution/index.js) | [capstones/01-business-rules-engine/tests/capstone-01.test.js](../capstones/01-business-rules-engine/tests/capstone-01.test.js) |
| Validate rule schemas | validateRuleSchemas, RuleSchemaError | [capstones/01-business-rules-engine/starter/index.js](../capstones/01-business-rules-engine/starter/index.js) | [capstones/01-business-rules-engine/solution/index.js](../capstones/01-business-rules-engine/solution/index.js) | [capstones/01-business-rules-engine/tests/capstone-01.test.js](../capstones/01-business-rules-engine/tests/capstone-01.test.js) |
| Deterministic output for same input | validateRuleSchemas, evaluateOrderDiscount | [capstones/01-business-rules-engine/starter/index.js](../capstones/01-business-rules-engine/starter/index.js) | [capstones/01-business-rules-engine/solution/index.js](../capstones/01-business-rules-engine/solution/index.js) | [capstones/01-business-rules-engine/tests/capstone-01.test.js](../capstones/01-business-rules-engine/tests/capstone-01.test.js) |
| Test suite and failure cases | capstone-01 test cases | N/A | N/A | [capstones/01-business-rules-engine/tests/capstone-01.test.js](../capstones/01-business-rules-engine/tests/capstone-01.test.js) |

## Capstone 02: Event-Driven Task Board

| Requirement | Function(s) | Starter | Solution | Tests |
|---|---|---|---|---|
| Event bus for task lifecycle events | createEventBus, appendEvent | [capstones/02-event-driven-task-board/starter/index.js](../capstones/02-event-driven-task-board/starter/index.js) | [capstones/02-event-driven-task-board/solution/index.js](../capstones/02-event-driven-task-board/solution/index.js) | [capstones/02-event-driven-task-board/tests/capstone-02.test.js](../capstones/02-event-driven-task-board/tests/capstone-02.test.js) |
| In-memory persistence with snapshots | createTaskBoard, snapshot, restore | [capstones/02-event-driven-task-board/starter/index.js](../capstones/02-event-driven-task-board/starter/index.js) | [capstones/02-event-driven-task-board/solution/index.js](../capstones/02-event-driven-task-board/solution/index.js) | [capstones/02-event-driven-task-board/tests/capstone-02.test.js](../capstones/02-event-driven-task-board/tests/capstone-02.test.js) |
| Input validation and error taxonomy | ValidationError, NotFoundError, assertCorrelationId, assertTitle | [capstones/02-event-driven-task-board/starter/index.js](../capstones/02-event-driven-task-board/starter/index.js) | [capstones/02-event-driven-task-board/solution/index.js](../capstones/02-event-driven-task-board/solution/index.js) | [capstones/02-event-driven-task-board/tests/capstone-02.test.js](../capstones/02-event-driven-task-board/tests/capstone-02.test.js) |
| Logging with correlation IDs | log, appendEvent | [capstones/02-event-driven-task-board/starter/index.js](../capstones/02-event-driven-task-board/starter/index.js) | [capstones/02-event-driven-task-board/solution/index.js](../capstones/02-event-driven-task-board/solution/index.js) | [capstones/02-event-driven-task-board/tests/capstone-02.test.js](../capstones/02-event-driven-task-board/tests/capstone-02.test.js) |

## Capstone 03: Resilient API Service

| Requirement | Function(s) | Starter | Solution | Tests |
|---|---|---|---|---|
| Idempotent create endpoint | createOrderIdempotent | [capstones/03-resilient-api-service/starter/index.js](../capstones/03-resilient-api-service/starter/index.js) | [capstones/03-resilient-api-service/solution/index.js](../capstones/03-resilient-api-service/solution/index.js) | [capstones/03-resilient-api-service/tests/capstone-03.test.js](../capstones/03-resilient-api-service/tests/capstone-03.test.js) |
| Cursor pagination and filtering | listOrders | [capstones/03-resilient-api-service/starter/index.js](../capstones/03-resilient-api-service/starter/index.js) | [capstones/03-resilient-api-service/solution/index.js](../capstones/03-resilient-api-service/solution/index.js) | [capstones/03-resilient-api-service/tests/capstone-03.test.js](../capstones/03-resilient-api-service/tests/capstone-03.test.js) |
| Timeout, retry, circuit breaker, bulkhead | createResilienceRuntime, simulatePayment | [capstones/03-resilient-api-service/starter/index.js](../capstones/03-resilient-api-service/starter/index.js) | [capstones/03-resilient-api-service/solution/index.js](../capstones/03-resilient-api-service/solution/index.js) | [capstones/03-resilient-api-service/tests/capstone-03.test.js](../capstones/03-resilient-api-service/tests/capstone-03.test.js) |
| Structured logs and metrics hooks | createResilientApiService hooks, runtime log/metric calls | [capstones/03-resilient-api-service/starter/index.js](../capstones/03-resilient-api-service/starter/index.js) | [capstones/03-resilient-api-service/solution/index.js](../capstones/03-resilient-api-service/solution/index.js) | [capstones/03-resilient-api-service/tests/capstone-03.test.js](../capstones/03-resilient-api-service/tests/capstone-03.test.js) |

## Capstone 04: Enterprise Workflow Platform Slice

| Requirement | Function(s) | Starter | Solution | Tests |
|---|---|---|---|---|
| Saga orchestration and compensation | runSaga | [capstones/04-enterprise-workflow-platform-slice/starter/index.js](../capstones/04-enterprise-workflow-platform-slice/starter/index.js) | [capstones/04-enterprise-workflow-platform-slice/solution/index.js](../capstones/04-enterprise-workflow-platform-slice/solution/index.js) | [capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js](../capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js) |
| Outbox and event replay safety | replayOutbox | [capstones/04-enterprise-workflow-platform-slice/starter/index.js](../capstones/04-enterprise-workflow-platform-slice/starter/index.js) | [capstones/04-enterprise-workflow-platform-slice/solution/index.js](../capstones/04-enterprise-workflow-platform-slice/solution/index.js) | [capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js](../capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js) |
| Multi-tenant isolation controls | ensureTenant, addTask, getTask | [capstones/04-enterprise-workflow-platform-slice/starter/index.js](../capstones/04-enterprise-workflow-platform-slice/starter/index.js) | [capstones/04-enterprise-workflow-platform-slice/solution/index.js](../capstones/04-enterprise-workflow-platform-slice/solution/index.js) | [capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js](../capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js) |
| SLO dashboard calculations and incident runbook | getSloDashboard, getIncidentRunbook | [capstones/04-enterprise-workflow-platform-slice/starter/index.js](../capstones/04-enterprise-workflow-platform-slice/starter/index.js) | [capstones/04-enterprise-workflow-platform-slice/solution/index.js](../capstones/04-enterprise-workflow-platform-slice/solution/index.js) | [capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js](../capstones/04-enterprise-workflow-platform-slice/tests/capstone-04.test.js) |
