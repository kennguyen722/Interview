Module 04 — Q2: High availability & failover patterns

Question
How to design for high availability and failover?

Answer (summary)
- Use redundancy, health checks, leader election for stateful components, automated failover, graceful degradation, idempotency, and retries.

Example
`Module04Q2.java` — retry with backoff pattern.

Compile & run
```powershell
javac java_tech_lead\topics\Module04Q2\Module04Q2.java
java -cp java_tech_lead\topics\Module04Q2 Module04Q2
```
