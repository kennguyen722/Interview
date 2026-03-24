# Section 12: Principal-Level Engineering Judgment and Leadership Interviews (Full Detail)

## Problem 1: Write an ADR for API Strategy
### Problem statement
Write ADR choosing REST vs GraphQL for internal/external clients.
### Difficulty
Principal-level
### Interview expectations
- Balanced alternatives, explicit tradeoffs, decision consequences.
### Clarifying questions a strong candidate should ask
- Client diversity and latency requirements?
### Brute-force approach
Pick preference with no structured rationale.
### Optimized approach
ADR format: context, options, decision, consequences, review date.
### Time and space complexity
Not applicable (architecture decision exercise).
### Clean JavaScript solution
```javascript
function buildAdr({ title, context, options, decision, consequences }) {
	return {
		title,
		status: 'accepted',
		context,
		options,
		decision,
		consequences,
		reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
	};
}
```

Explanation: turning ADR structure into a strict schema ensures decisions are reviewable, comparable, and revisitable on schedule.
### Alternative solutions when useful
Hybrid approach: REST core + GraphQL gateway.
### Edge cases
Team skill mismatch and tooling immaturity.
### Test cases
Architecture review acceptance with clear rollback plan.
### Follow-up questions
When should ADR be revisited?
### Real-world production relevance
Core principal responsibility.

---

## Problem 2: Code Review as Quality Multiplier
### Problem statement
Given risky PR, provide findings prioritized by severity and production impact.
### Difficulty
Principal-level
### Interview expectations
- Security/correctness/performance/maintainability balance.
### Clarifying questions a strong candidate should ask
- Business criticality and release deadline?
### Brute-force approach
Style-only feedback.
### Optimized approach
Severity-ranked findings with remediation guidance.
### Time and space complexity
Not applicable (review prioritization exercise).
### Clean JavaScript solution
```javascript
function prioritizeFindings(findings) {
	const weight = {
		security: 5,
		correctness: 4,
		performance: 3,
		maintainability: 2,
		observability: 1,
	};

	return findings
		.slice()
		.sort((a, b) => (weight[b.category] || 0) - (weight[a.category] || 0));
}
```

Explanation: codifying severity ordering keeps reviews focused on production risk rather than style noise.
### Alternative solutions when useful
Pair-review for high-risk modules.
### Edge cases
Hidden coupling outside changed files.
### Test cases
Post-review defect escape rate decreases.
### Follow-up questions
How to teach quality bar without blocking velocity?
### Real-world production relevance
Defines engineering culture and defect prevention.

---

## Problem 3: Incident Leadership Scenario
### Problem statement
Lead sev-1 outage affecting checkout for 20% of users.
### Difficulty
Principal-level
### Interview expectations
- Command structure, communication cadence, mitigation-first mindset.
### Clarifying questions a strong candidate should ask
- Current blast radius and rollback readiness?
### Brute-force approach
Simultaneous random fixes without coordinator.
### Optimized approach
Incident commander model with clear owners and timeline.
### Time and space complexity
Not applicable (incident operations exercise).
### Clean JavaScript solution
```javascript
function incidentPlan(incidentId) {
	return [
		{ incidentId, phase: 'stabilize', owner: 'incident-commander' },
		{ incidentId, phase: 'diagnose', owner: 'service-lead' },
		{ incidentId, phase: 'mitigate', owner: 'oncall-engineer' },
		{ incidentId, phase: 'recover', owner: 'release-manager' },
		{ incidentId, phase: 'postmortem', owner: 'tech-lead' },
	];
}
```

Explanation: explicit phase ownership removes ambiguity during high-pressure incidents and improves MTTR.
### Alternative solutions when useful
Feature-flag kill switch and traffic shedding.
### Edge cases
Conflicting hypotheses between teams.
### Test cases
Run quarterly game-day with measurable MTTR goals.
### Follow-up questions
How to convert postmortem actions into sustained prevention?
### Real-world production relevance
Principal interview staple.

---

## Problem 4: Influence Without Authority
### Problem statement
Drive adoption of reliability standards across teams you do not manage.
### Difficulty
Principal-level
### Interview expectations
- Stakeholder mapping and persuasion with data.
### Clarifying questions a strong candidate should ask
- Team incentives and competing roadmaps?
### Brute-force approach
Top-down mandate without buy-in.
### Optimized approach
Pilot, demonstrate value, codify standards, scale through champions.
### Time and space complexity
Not applicable (organizational rollout exercise).
### Clean JavaScript solution
```javascript
function influenceRolloutPlan() {
	return [
		{ phase: 'pilot', successMetric: 'p99 improved by >=15%' },
		{ phase: 'publish-results', successMetric: 'cross-team review completed' },
		{ phase: 'template-standard', successMetric: 'standard merged' },
		{ phase: 'org-adoption', successMetric: '>=70% services onboarded' },
	];
}
```

Explanation: influence without authority works best when adoption milestones are measurable and shared publicly.
### Alternative solutions when useful
Platform tooling enforcing defaults.
### Edge cases
Local optimizations conflicting with global standards.
### Test cases
Adoption and reliability KPI improvement across teams.
### Follow-up questions
How to handle resistant but high-performing teams?
### Real-world production relevance
Core multiplier behavior.

---

## Problem 5: Build-vs-Buy Decision Framework
### Problem statement
Choose internal build or vendor solution for workflow orchestration.
### Difficulty
Principal-level
### Interview expectations
- Multi-year cost, lock-in, speed, compliance, operability analysis.
### Clarifying questions a strong candidate should ask
- Time-to-market pressure and compliance constraints?
### Brute-force approach
Choose cheapest short-term option.
### Optimized approach
Weighted decision matrix with explicit assumptions.
### Time and space complexity
Not applicable (decision framework exercise).
### Clean JavaScript solution
```javascript
const criteria = ['cost', 'timeToMarket', 'control', 'compliance', 'operability'];
```
Explanation: explicit criteria arrays anchor build-vs-buy conversations to shared decision dimensions instead of personal preference.
### Alternative solutions when useful
Buy now, build strategic components later.
### Edge cases
Vendor roadmap divergence.
### Test cases
Post-decision KPI review after 2 quarters.
### Follow-up questions
What exit strategy mitigates lock-in risk?
### Real-world production relevance
Frequent staff/principal decision domain.

---

## Problem 6: Senior to Principal Growth Plan
### Problem statement
Define growth rubric and coaching plan for senior engineers moving to principal scope.
### Difficulty
Principal-level
### Interview expectations
- Competency model and measurable progression.
### Clarifying questions a strong candidate should ask
- Current gaps by dimension (technical depth, breadth, influence)?
### Brute-force approach
Generic mentorship with no metrics.
### Optimized approach
Targeted goals, project assignments, review loops, and sponsorship.
### Time and space complexity
Not applicable (growth planning exercise).
### Clean JavaScript solution
```javascript
function principalReadinessScore(input) {
	const weights = {
		systemOwnership: 0.3,
		reliabilityPosture: 0.25,
		crossTeamInfluence: 0.25,
		mentoringImpact: 0.2,
	};

	return (
		input.systemOwnership * weights.systemOwnership +
		input.reliabilityPosture * weights.reliabilityPosture +
		input.crossTeamInfluence * weights.crossTeamInfluence +
		input.mentoringImpact * weights.mentoringImpact
	);
}
```

Explanation: a weighted rubric makes growth planning concrete and helps calibrate promotion readiness consistently.
### Alternative solutions when useful
Principal shadow program and rotation.
### Edge cases
High performer with narrow specialization.
### Test cases
Promotion-ready signals appear in 2-3 review cycles.
### Follow-up questions
How to avoid burnout in high-visibility leadership tracks?
### Real-world production relevance
Principal engineers are expected to develop future leaders.

---

## Section 12 Exit Criteria
- You can demonstrate principal-level judgment, influence, and organizational impact with concrete frameworks and examples.
