# ADR-0012: Financial Dashboard API — GraphQL over REST

## Status

**Decided** — Approved 2026-03-24

## Context

The product team is building a Financial Dashboard that requires aggregated data from 5+ backend services (accounts, transactions, budgets, investments, notifications). The dashboard must serve both the web application and the iOS/Android mobile apps.

Key constraints:
- Web app shows 12 widgets per page, each needing different data subsets
- Mobile app shows 4 widgets with a simplified data shape (bandwidth-sensitive)
- Backend services are owned by different teams with independent deployment schedules
- Current REST endpoints are designed around server-resource structure, not client UI needs
- Average page load in pilot testing requires 6-8 sequential REST calls (high waterfall latency)

We evaluated two primary approaches: a pure REST API (possibly with a dedicated BFF) and a GraphQL API.

## Decision

**We will adopt GraphQL for the Financial Dashboard API**, implemented as a standalone GraphQL gateway that aggregates the existing internal REST/gRPC services.

This is NOT a replacement for existing REST APIs used by other consumers. GraphQL is introduced only for this client-facing aggregation use case.

## Rationale

### Why GraphQL wins for this use case

| Factor | REST (+BFF) | GraphQL |
|--------|-------------|---------|
| Client data fetching flexibility | Poor — BFF must be updated for every new widget | Strong — client declares its own data shape |
| Over-fetching (sending too much data to mobile) | High — BFF returns a fixed shape | None — mobile requests only its 4 fields |
| Under-fetching (multiple round trips) | 6-8 round trips today | 1 query per page load |
| Schema introspection & discoverability | No | Yes (GraphiQL, code-gen) |
| Batching via DataLoader (N+1 prevention) | Manual per BFF endpoint | Built-in pattern |
| Versioning burden | High — v1, v2 proliferation | Low — additive schema evolution |

### Why not REST + BFF

A BFF (Backend for Frontend) pattern solves the same problem for a single client shape. However, with both web and mobile having meaningfully different data requirements, we would need either:
- Two BFFs (web-bff, mobile-bff) — adds operational complexity, or
- One BFF that accepts query parameters to control shape — which is GraphQL, just without the tooling

### Why not full GraphQL everywhere

Most of our internal service-to-service communication is already REST/gRPC and works well. Migrating existing stable APIs introduces unnecessary risk. GraphQL is adopted surgically for the client-facing aggregation layer only.

## Consequences

### Positive
- Single request from client → significantly reduced page load latency
- Mobile app can request a slim payload without a new API version or BFF change
- Frontend teams gain full autonomy over which fields they request; no backend change needed for UI experimentation
- DataLoader pattern eliminates N+1 queries across aggregated services
- GraphQL schema serves as a living contract between frontend and backend

### Negative
- GraphQL is new to most of the team → requires enablement time (estimated 2 weeks)
- Query complexity and depth attacks require a query cost limit / query depth limit (must implement)
- Caching is harder: REST has simple URL-based CDN caching; GraphQL POST requests don't cache at CDN level → must cache at resolver level
- Error handling semantics differ: GraphQL returns 200 with partial errors, which requires client-side handling discipline

## Tradeoffs Accepted

- We accept the learning curve in exchange for long-term frontend flexibility
- We accept CDN-level caching loss in exchange for resolver-level caching (Redis keys by query hash)
- We accept more sophisticated error handling in exchange for fewer round trips

## Escalation & Consultation

Before finalizing:
- Reviewed with frontend leads (web + mobile) — confirmed they prefer declarative data fetching
- Reviewed with security team — agreed on: query depth limit = 5, query cost limit = 100, rate limiting per user
- Did NOT require CTO escalation; within principal engineer authority per our decision framework

## Review Date

Re-evaluate in 6 months. If resolver count exceeds 200 or query complexity management becomes a bottleneck, consider federation (Apollo Federation or GraphQL Mesh).
