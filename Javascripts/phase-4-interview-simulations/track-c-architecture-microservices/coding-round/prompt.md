# Track C Coding Round: Idempotent Event Consumer

## Scenario
An Order service receives duplicate events from a message broker during re-delivery.

## Requirements
- Process each event ID only once.
- Preserve processing order per aggregate key.
- Return skipped status for duplicates.

## Task
Complete starter/index.js.

## Timebox
45 minutes
