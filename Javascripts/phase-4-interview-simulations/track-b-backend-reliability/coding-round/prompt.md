# Track B Coding Round: Idempotent Payment Handler

## Scenario
Clients retry payment submissions after network timeouts, causing duplicate processing.

## Requirements
- Support Idempotency-Key header.
- Return same result for duplicate key.
- Validate amount/currency.
- Simulate external provider call.

## Task
Complete starter/index.js.

## Timebox
45 minutes
