# Principal / Staff Engineer Interview Guide

## What Interviewers Test at Principal Level

| Dimension | Weight | What They Want to See |
|-----------|--------|-----------------------|
| **Depth** | 30% | You can go 3 levels deep on any topic without hesitation |
| **Breadth** | 20% | You draft cross-system solutions spanning frontend, backend, data |
| **Trade-offs** | 25% | You articulate *why* — not just what — with production constraints in mind |
| **Leadership** | 15% | You design for teams, not just for yourself (ADRs, standards, code review culture) |
| **Communication** | 10% | You tailor to audience; juniors understand you; executives trust you |

---

## Phase 1: Know the Signal Framework

Every interviewer is looking for **positive signals** and watching for **negative signals**.

### Positive Signals

- "I've done this in production with these trade-offs..."
- "Before I code, can I clarify the constraints?"
- "Here's the simple version — then here's where it breaks at scale."
- "I'd write an ADR for this decision so the team is aligned."
- "The observable symptom is X, the root cause is probably Y."

### Negative Signals (avoid these)

- Jumping to implementation before understanding requirements
- Defending a specific technology without acknowledging trade-offs
- Saying "it depends" without finishing the sentence
- Overengineering trivial examples
- Being unable to explain a concept to a non-technical audience

---

## Phase 2: Core Technical Domains

### 1. JavaScript Runtime & Event Loop

**What they ask:** "Explain what happens when `setTimeout(fn, 0)` is called while a Promise is pending."

**What they want:**
- Macro-task queue vs. microtask queue order
- Promise `.then()` callbacks are microtasks (run before the next macro-task)
- `queueMicrotask()` vs `process.nextTick()` in Node.js
- Real consequence: a tight Promise chain can starve I/O callbacks

**Go-deeper prompts:** "How would you detect a starved event loop in production?" → APM tools, `event-loop-lag` metrics, `perf_hooks`.

---

### 2. TypeScript & Type Safety

**What they ask:** "How would you model a discriminated union state machine?"

**What they want:**
- `type State = { status: 'PENDING' } | { status: 'CONFIRMED'; confirmationId: string }`
- Exhaustive narrowing with `never` at the `default` branch
- Branded types for preventing primitive obsession (`type UserId = string & { __brand: 'UserId' }`)
- Conditional types and mapped types for DRY API surface

---

### 3. React Architecture

**What they ask:** "When should you use `useReducer` vs. `useState`? How does React's reconciler decide what to re-render?"

**What they want:**
- `useReducer` for co-located state transitions (not just "when state is complex")
- Reconciler: fiber architecture, work-in-progress tree, commit phase vs. render phase
- Why keys matter: reconciler uses them to preserve identity across list re-renders
- Production concern: concurrent features (Suspense, `startTransition`) vs legacy sync rendering

---

### 4. Full Stack Data Flow

**What they ask:** "Walk me through an SSR page load. What happens on first request vs. client navigation?"

**What they want:**
- Server: render HTML with data, inject `__NEXT_DATA__` / `window.__SSR_DATA__`
- Hydration: React attaches event listeners to server-rendered markup (no repaint)
- Client navigation: React Router / Next.js fetches data, swaps DOM subtree
- Pitfalls: hydration mismatch (server HTML ≠ client render), localStorage not available on server

---

### 5. Database & Data Layer

**What they ask:** "How do you prevent N+1 queries in a GraphQL API?"

**What they want:**
- DataLoader pattern: batch all `.load(id)` calls made in the same tick
- Joins vs. multiple queries: trade-offs for read vs. write-heavy workloads
- Connection pooling: why `maxPoolSize` matters under high concurrency
- Index strategy: B-tree vs. hash for equality, partial indexes, covering indexes

---

### 6. Auth & Identity

**What they ask:** "Explain the OAuth2 Authorization Code flow with PKCE. Why is PKCE necessary?"

**What they want:**
- PKCE prevents authorization code interception on public clients (mobile/SPA)
- `code_verifier` (random), `code_challenge = base64url(SHA256(verifier))`
- Access token short-lived (15 min), refresh token long-lived (rotated on use)
- Token theft detection: if a refresh token is used twice, revoke the entire family (RFC 6819)

---

### 7. Observability

**What they ask:** "Your p99 latency spiked. Walk me through your debugging process."

**What they want:**
- Start with dashboards: error rate + latency + saturation (USE method)
- Correlate with deployments, config changes (change calendar)
- Drill into distributed traces: which service/span is the outlier?
- Check structured logs with the traceId from the slow span
- Hypothesize → validate → fix → monitor (not "restart and hope")

---

### 8. System Design

**What they ask:** "Design a rate limiter for a multi-tenant API."

**What they want:**
- Fixed window vs. sliding window vs. token bucket trade-offs
- Redis for distributed state: `INCR` + `EXPIRE` for fixed window, `sorted sets` for sliding
- Edge case: what happens at the window boundary? (thundering herd)
- Where to enforce: API gateway (consistent), per-service (defense in depth)
- Tenant isolation: per-tenant limits with burst allowance

---

## Phase 3: Behavioral Questions (STAR Format)

### Staff/Principal-Specific Themes

| Theme | Sample Question |
|-------|----------------|
| **Technical Influence** | "Tell me about a time you changed the technical direction of a team without having authority to mandate it." |
| **Architecture Decision** | "Describe an ADR you wrote. What was the most contested decision and how did you get buy-in?" |
| **Code Quality Culture** | "How have you improved code review practices on a team? What worked, what didn't?" |
| **Incident Leadership** | "Tell me about a critical production incident you led the response to." |
| **Mentorship** | "Tell me about a time you elevated a struggling mid-level engineer." |
| **Cross-Team Alignment** | "Describe a time when two teams had conflicting technical approaches. How did you resolve it?" |
| **Build vs. Buy** | "Walk me through a build vs. buy decision you've made. What criteria did you use?" |

### STAR Formula for Technical Roles

```
Situation: Context (team size, system scale, constraints)
Task:       Your specific responsibility
Action:     What YOU did (not "we") — technical + interpersonal
Result:     Quantified outcome + lesson learned
```

**Pro tip:** Always quantify *scale* and *impact*:
- ❌ "We improved performance"
- ✅ "We reduced p99 latency from 2.3s to 180ms for 50k RPM, cutting infrastructure cost by $12k/month"

---

## Phase 4: Code Interview Strategy

### The 4-Step Framework

1. **Clarify** (2 min): Ask about input constraints, edge cases, performance requirements
2. **Approach** (3 min): Talk through your algorithm/design out loud before coding
3. **Implement** (15-20 min): Write clean, readable code with meaningful names
4. **Optimize** (5 min): Discuss time/space complexity, alternative approaches

### What Separates Senior from Principal in Coding Interviews

| Senior Engineer | Principal Engineer |
|----------------|--------------------|
| Correct solution, clean code | Correct + identifies edge cases unprompted |
| Discusses time complexity | Discusses time + space + cache performance |
| Single approach | Multiple approaches with trade-offs articulated |
| Works in isolation | "How would this change if we had 10 concurrent callers?" |
| Handles happy path | Explicitly handles failure modes |

---

## Phase 5: Questions to Ask Your Interviewers

These signal seniority and genuine interest:

1. "What does the architecture decision process look like here? Do you use ADRs?"
2. "What's the biggest technical debt you're actively working to address?"
3. "How do principal engineers typically influence roadmap vs. just executing it?"
4. "What does a great first 90 days look like for someone in this role?"
5. "What's the production incident that still gets talked about at all-hands?"

---

## Prep Schedule (4-Week Sprint)

| Week | Focus |
|------|-------|
| 1 | JavaScript runtime, TypeScript, async patterns (Phase 1-4 modules) |
| 2 | React architecture, full-stack patterns, database layer (Phase 5 modules 13-16) |
| 3 | Auth/identity, observability, system design (Phase 5 modules 17-18) |
| 4 | Capstone implementations, mock interviews (Track A/B/C/D), behavioral STAR stories |
