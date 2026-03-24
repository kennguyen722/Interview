# Section 11: System Design Crossover for Full Stack Engineers (Full Detail)

## Problem 1: Design Notification Platform (Email/SMS/In-app)
### Problem statement
Design a system delivering reliable multi-channel notifications for 10M users.
### Difficulty
Hard
### Interview expectations
- Requirements, capacity estimates, architecture, failure handling.
### Clarifying questions a strong candidate should ask
- Delivery guarantees and latency targets?
- Priority classes and retry policies?
### Brute-force approach
Synchronous send inside request path.
### Optimized approach
Queue-based async pipeline with idempotency, retry, DLQ.
### Time and space complexity
Design-level analysis.
### Clean JavaScript solution
```javascript
function buildNotificationJob({ userId, channels, templateId, idempotencyKey }) {
	return {
		id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
		userId,
		channels,
		templateId,
		idempotencyKey,
		attempts: 0,
		status: 'queued',
	};
}

function nextRetryDelayMs(attempt) {
	return Math.min(60000, 1000 * (2 ** attempt));
}
```

Explanation: an explicit job model with idempotency and retry scheduling is the core coding primitive behind reliable notification pipelines.
### Alternative solutions when useful
Event-driven choreography by channel.
### Edge cases
Provider outage and duplicate delivery risk.
### Test cases
Load and failure simulation via game-day scenarios.
### Follow-up questions
How to implement per-tenant rate limits?
### Real-world production relevance
Common platform service in SaaS products.

---

## Problem 2: Design Order Workflow with Compensation
### Problem statement
Build checkout flow across cart, payment, inventory, and shipping services.
### Difficulty
Hard
### Interview expectations
- Saga design with compensation paths.
### Clarifying questions a strong candidate should ask
- Atomicity expectation across services?
### Brute-force approach
Distributed transaction across all services.
### Optimized approach
Saga orchestration + outbox + idempotent handlers.
### Time and space complexity
Design-level analysis.
### Clean JavaScript solution
```javascript
const saga = {
	reserveInventory: {
		next: 'chargePayment',
		compensate: 'releaseInventory',
	},
	chargePayment: {
		next: 'createShipment',
		compensate: 'refundPayment',
	},
	createShipment: {
		next: 'complete',
		compensate: 'cancelShipment',
	},
};

function sagaStep(stepName) {
	return saga[stepName] || { next: null, compensate: null };
}
```

Explanation: modeling the saga as data makes failure compensation explicit and easier to test than embedding implicit branching logic.
### Alternative solutions when useful
Event choreography when central orchestrator is bottleneck.
### Edge cases
Payment success but inventory release race.
### Test cases
Failure injection for each saga step.
### Follow-up questions
How to recover from orchestrator restart?
### Real-world production relevance
Core commerce reliability problem.

---

## Problem 3: Real-time Dashboard Aggregation
### Problem statement
Serve dashboard combining 6 downstream services with p95 < 400ms.
### Difficulty
Hard
### Interview expectations
- Fan-out strategy, caching, partial fallback, observability.
### Clarifying questions a strong candidate should ask
- Freshness tolerance per widget?
### Brute-force approach
Sequential dependency calls.
### Optimized approach
Parallel fan-out with per-widget timeout and stale cache fallback.
### Time and space complexity
Design-level analysis.
### Clean JavaScript solution
```javascript
async function fetchWidget(name, call, timeoutMs) {
	try {
		const value = await Promise.race([
			call(),
			new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
		]);
		return { name, value, error: null };
	} catch (err) {
		return { name, value: null, error: err.message };
	}
}

async function composeDashboard(widgets) {
	const results = await Promise.all(widgets.map((w) => fetchWidget(w.name, w.call, w.timeoutMs || 150)));
	return {
		data: Object.fromEntries(results.map((r) => [r.name, r.value])),
		errors: results.filter((r) => r.error).map((r) => ({ widget: r.name, reason: r.error })),
	};
}
```

Explanation: per-widget timeouts and partial aggregation provide predictable p95 behavior while preserving degraded but usable responses.
### Alternative solutions when useful
Precomputed materialized views for heavy widgets.
### Edge cases
One widget repeatedly times out.
### Test cases
Latency budget tests under dependency degradation.
### Follow-up questions
How to choose cache TTL per widget criticality?
### Real-world production relevance
Frequent full-stack interview scenario.

---

## Problem 4: Migration from Monolith to Services
### Problem statement
Design phased migration minimizing risk and downtime.
### Difficulty
Principal-level
### Interview expectations
- Incremental strategy and rollback path.
### Clarifying questions a strong candidate should ask
- Domain boundaries and team ownership?
### Brute-force approach
Big-bang rewrite.
### Optimized approach
Strangler pattern with branch-by-abstraction and dual-read validation.
### Time and space complexity
Program-level.
### Clean JavaScript solution
```javascript
function routeCapability(capability, flags) {
	const newServiceEnabled = Boolean(flags[`service.${capability}.enabled`]);
	if (newServiceEnabled) {
		return { target: 'new-service', mode: 'primary' };
	}
	return { target: 'monolith', mode: 'fallback' };
}
```

Explanation: strangler migration requires explicit capability routing so rollouts are reversible per domain area.
### Alternative solutions when useful
Modular monolith as intermediate stage.
### Edge cases
Data divergence between old and new paths.
### Test cases
Shadow traffic comparison during migration.
### Follow-up questions
How to measure migration success objectively?
### Real-world production relevance
Common principal-level architecture challenge.

---

## Problem 5: Multi-tenant SaaS Architecture
### Problem statement
Design tenant isolation, noisy-neighbor protection, and compliance controls.
### Difficulty
Principal-level
### Interview expectations
- Isolation model tradeoffs.
### Clarifying questions a strong candidate should ask
- Compliance constraints by tenant tier?
### Brute-force approach
Single shared everything.
### Optimized approach
Tiered isolation: shared for small tenants, dedicated for regulated/large tenants.
### Time and space complexity
N/A.
### Clean JavaScript solution
```javascript
function tenantPolicy(tenant) {
	if (tenant.tier === 'regulated' || tenant.monthlySpend > 50000) {
		return {
			dataPlane: 'dedicated',
			qpsLimit: 3000,
			backupPolicy: 'hourly',
		};
	}

	return {
		dataPlane: 'shared',
		qpsLimit: 300,
		backupPolicy: 'daily',
	};
}
```

Explanation: tiered policies encode isolation and noisy-neighbor limits directly from business/compliance constraints.
### Alternative solutions when useful
Cell-based architecture.
### Edge cases
Cross-tenant cache leakage.
### Test cases
Isolation validation and access-control penetration tests.
### Follow-up questions
How to migrate tenant from shared to dedicated safely?
### Real-world production relevance
Key platform design decision in SaaS.

---

## Problem 6: Capacity Estimation and Bottleneck Analysis
### Problem statement
Estimate throughput/storage for new feature and identify first bottleneck.
### Difficulty
Hard
### Interview expectations
- Quick, explicit assumptions and sanity checks.
### Clarifying questions a strong candidate should ask
- DAU, request mix, payload size, retention?
### Brute-force approach
No estimation; guess infrastructure size.
### Optimized approach
Back-of-envelope model then validate with load testing.
### Time and space complexity
N/A.
### Clean JavaScript solution
```javascript
function estimateQps({ dau, requestsPerUserPerDay, activeHoursPerDay = 12 }) {
	const activeSeconds = activeHoursPerDay * 3600;
	return (dau * requestsPerUserPerDay) / activeSeconds;
}

function estimateStorageGbPerDay({ eventsPerDay, avgEventBytes }) {
	return (eventsPerDay * avgEventBytes) / (1024 ** 3);
}
```

Explanation: interview-caliber capacity planning should use explicit formulas so assumptions can be challenged and updated as telemetry arrives.
### Alternative solutions when useful
Model p95 and p99 separately.
### Edge cases
Traffic spikes and seasonality.
### Test cases
Compare model predictions to benchmark data.
### Follow-up questions
How to update model after launch telemetry?
### Real-world production relevance
Expected in senior/principal design interviews.

---

## Section 11 Exit Criteria
- You can run a full-stack system design interview with clear tradeoffs, failure handling, and migration strategy.
