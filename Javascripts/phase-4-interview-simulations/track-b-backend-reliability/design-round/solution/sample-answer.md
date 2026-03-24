# Track B Design Round Sample Answer

## API Contract and Idempotency
- Require Idempotency-Key per create-payment request.
- Persist request fingerprint and response payload for safe replay.
- Return previous success for duplicate retries.

## Failure Modes and Retry Policy
- Classify errors into retryable and non-retryable.
- Use bounded retries with exponential backoff and jitter.
- Enforce max request timeout to avoid hanging workers.

## Circuit Breaker and Fallback
- Open breaker on rolling failure threshold.
- In open state, fail fast and queue compensating action.
- Half-open with limited probes before full recovery.

## Observability and SLOs
- Metrics: paymentSuccessRate, paymentLatencyP95, breakerOpenCount.
- Logs with correlation IDs and provider response codes.
- Distributed traces across gateway and provider adapter.

## Data Consistency and Reconciliation
- Store payment intent before provider call.
- Reconciliation worker compares local state with provider records.
- Compensate inconsistent states with refund/retry workflows.
