# Capstone 02: Event-Driven Task Board

Requirements coverage:
- Event bus for task lifecycle events: `createEventBus`, `createTaskBoard().on`
- In-memory persistence with snapshots: `snapshot`, `restore`
- Input validation and error taxonomy: `ValidationError`, `NotFoundError`
- Logging with correlation IDs: `logger` callback receives `correlationId`

Run tests:
- `node --test capstones/02-event-driven-task-board/tests/capstone-02.test.js`
