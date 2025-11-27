Module 05 — Q1: Migrating a monolith to microservices

Question
How to migrate a monolith to microservices safely?

Answer (summary)
- Identify bounded contexts and use the strangler pattern to incrementally replace parts of the monolith.
- Ensure API contracts, test coverage, observability, and rollback plans.

Example
`Module05Q1.java` — adapter-style pattern to keep calling code unchanged while swapping implementations.

Compile & run
```powershell
javac java_tech_lead\topics\Module05Q1\Module05Q1.java
java -cp java_tech_lead\topics\Module05Q1 Module05Q1
```
