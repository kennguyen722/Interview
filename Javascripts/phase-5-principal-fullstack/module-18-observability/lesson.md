# Module 18: Observability & Production Readiness

## Why This Matters for Principal Interviews

Principal engineers own production systems. Interviewers expect you to:
- Know the difference between logs, metrics, and traces (the three pillars)
- Design structured logging that enables fast incident debugging
- Define SLOs and calculate error budget burn rate
- Build health checks that distinguish liveness from readiness

## Topics

### 1. Structured Logging
Plain text logs are unsearchable at scale. Structured logs are JSON objects with consistent fields:
```json
{ "level": "error", "msg": "Payment failed", "orderId": "o-123", "code": "DECLINED", "duration_ms": 450 }
```
- **Child loggers** inherit parent context (e.g., requestId)
- **Log levels**: trace < debug < info < warn < error < fatal
- **Redaction**: Strip PII fields before writing (never log passwords, tokens, card numbers)

### 2. Metrics: Counters, Gauges, Histograms
- **Counter**: Monotonically increasing (request count, error count)
- **Gauge**: Point-in-time value (memory usage, queue depth)
- **Histogram**: Distribution of values (request latency, response size)
  - Used to compute p50, p95, p99 percentiles

### 3. Distributed Tracing (W3C TraceContext)
Traces correlate work across services. Each operation is a "span" with:
- `traceId` (same across all spans for a request)
- `spanId` (unique per operation)
- `parentSpanId` (parent operation's spanId)
- Propagated via HTTP header: `traceparent: 00-{traceId}-{spanId}-01`

### 4. Health Check Aggregator
Two types of health checks:
- **Liveness**: Is the process alive? (can it restart if no)
- **Readiness**: Is it ready to serve traffic? (depends on DB, cache, upstream)

Returns structured status: `{ status: 'healthy'|'degraded'|'unhealthy', checks: {...} }`

### 5. SLO Tracking & Error Budget
- **SLO (Service Level Objective)**: e.g., 99.9% of requests succeed in <200ms
- **Error budget**: Total allowed failures in a period (0.1% of requests per month)
- **Burn rate**: How fast you're consuming the error budget (1.0 = exactly on target)

### 6. Alert Rule Engine
Rules evaluate incoming metric events against thresholds.
- Supports cooldown to prevent alert flapping
- Multi-condition rules: `latency_p99 > 500ms AND error_rate > 1%`

## The Golden Signals (SRE)

| Signal | What It Measures |
|--------|-----------------|
| Latency | How long requests take |
| Traffic | How many requests per second |
| Errors | Rate of failed requests |
| Saturation | How full your resources are (CPU, queue depth) |

## Interview Drill Questions

- "What is the difference between a metric and a log? When do you use each?"
- "Explain distributed tracing and how you'd debug a slow request across 5 microservices."
- "What is an SLO, SLA, and SLI? How are they related?"
- "How do you calculate error budget burn rate?"
- "Describe a situation where your monitoring failed to catch an incident. What would you add?"
- "Why is p99 latency more important than average latency for user experience?"

## Assignment

Implement each concept in `starter/index.js`. Run with:
```powershell
node phase-5-principal-fullstack/module-18-observability/solution/index.js
```
