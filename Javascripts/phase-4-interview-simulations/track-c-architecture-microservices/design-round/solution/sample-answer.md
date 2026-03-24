# Track C Design Round Sample Answer

## Service Boundaries and Ownership
- Order: owns order lifecycle state.
- Payment: owns authorization/capture/refund state.
- Inventory: owns stock reservations.
- Shipping: owns shipment creation and dispatch.

## Event Contract and Versioning
- Events include eventId, occurredAt, aggregateId, version.
- Use schema registry with backward-compatible evolution.
- Add new optional fields before deprecating old fields.

## Consistency and Compensation
- Use saga choreography for distributed workflow.
- If payment fails after reservation, emit reservation.release.
- If shipping fails after payment capture, trigger refund workflow.

## Failure Handling and Replay
- Outbox pattern for reliable event publishing.
- Idempotent consumers keyed by eventId.
- Dead-letter queue with replay tooling and poison-message isolation.

## Observability and Operations
- Metrics: sagaCompletionRate, compensationRate, queueLag.
- Tracing across all services with shared correlationId.
- Runbooks for replay, rollback, and partial outage handling.
