# Track C Debugging Round: Event Ordering Bug

## Scenario
Shipping is triggered before payment authorization for the same order under burst traffic.

## Task
- Inspect starter/buggy.js.
- Identify ordering race.
- Fix by sequencing events per aggregate key.

## Timebox
30 minutes
