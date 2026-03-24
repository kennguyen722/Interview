# Capstone 2: Scalable Order Workflow

## Problem Statement

Build a distributed order processing system using the Saga pattern to coordinate across Order, Payment, Inventory, and Shipping services.

## Requirements

- **Saga orchestration**: The order saga drives sequential steps and can compensate on failure
- **Compensation logic**: If shipping fails, undo inventory reservation and payment charge
- **Outbox pattern**: Events are staged transactionally and flushed to the event bus; prevents event loss on partial failure
- **Idempotent consumers**: Processing the same event twice must be a no-op
- **Status tracking**: Every order and saga step must be queryable

## Technical Constraints

- Service implementations are in-memory mocks (no real HTTP calls)
- No external dependencies
- Must run with `node solution/index.js`

## Interview Focus Areas

1. **Saga vs 2PC** — explain why distributed transactions (2PC) are avoided in microservices
2. **Choreography vs orchestration** — what are the tradeoffs?
3. **Compensation** — if step 3 fails, how do you ensure step 1 and step 2 are safely undone?
4. **Outbox pattern** — why not just publish events directly during the saga step?
5. **Idempotent consumers** — what happens if an event is delivered twice?
6. **Partial failure** — what if the compensation itself fails?

## Saga Steps

```
1. processPayment  → paymentId
2. reserveInventory → reservationId
3. scheduleShipping → shipmentId
→ emit order.completed

If ANY step fails:
→ cancelShipping (if step 3 ran)
→ releaseInventory (if step 2 ran)
→ refundPayment (if step 1 ran)
→ emit order.cancelled
```

## Deliverables

See `solution/index.js` for the complete reference implementation.
