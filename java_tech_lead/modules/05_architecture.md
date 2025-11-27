Module 5 — Architecture & Microservices

Q1: How to migrate a monolith to microservices safely?
Answer: Identify bounded contexts, establish API contracts, introduce strangler pattern, ensure observability, create cutover and rollback plans, start with read-only decompositions.

Example: `examples/Module05Q1.java` shows a tiny adapter pattern example.

Q2: How do you design APIs for change over time?
Answer: Use versioning, backward compatibility, feature flags, and consumer-driven contracts. Prefer additive changes and design for default behavior.

Example: `examples/Module05Q2.java` demonstrates a versioned handler dispatch.

Q3: What are common pitfalls in microservices?
Answer: Over-splitting, distributed transactions complexity, lack of observability, tight coupling via shared DB schema, and insufficient automation for deployment and testing.

Example: `examples/Module05Q3.java` outlines a bulkhead pattern skeleton.
