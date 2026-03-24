# Track B Debugging Round: Retry Storm

## Scenario
A downstream service starts timing out. Your retry wrapper creates request storms and makes outage worse.

## Task
- Inspect starter/buggy.js.
- Identify why retries are unbounded.
- Fix with bounded retries and backoff delay.

## Timebox
30 minutes
