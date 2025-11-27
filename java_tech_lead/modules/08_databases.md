Module 8 — Databases & Transactions

Q1: How do you choose between SQL and NoSQL for a service?
Answer: Choose based on data model, consistency, query patterns, and operational needs. Use SQL for relational integrity and complex queries; NoSQL for flexible schema, high write/read scale, or specific access patterns.

Example: `examples/Module08Q1.java` sketches a data-access interface.

Q2: Explain transaction isolation levels and anomalies.
Answer: Read uncommitted, read committed, repeatable read, serializable. Anomalies include dirty reads, non-repeatable reads, and phantom reads. Choose isolation by balancing correctness and concurrency.

Example: `examples/Module08Q2.java` demonstrates a simple retry-on-conflict loop.

Q3: How to handle schema changes in distributed systems?
Answer: Backward/forward-compatible changes: add nullable columns, maintain versioned consumers, use feature flags and migration scripts, and perform rolling upgrades.

Example: `examples/Module08Q3.java` shows a schema-evolution comment and simple check.
