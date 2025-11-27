Module 05 — Q3: Microservices pitfalls & bulkhead pattern

Question
What are common pitfalls in microservices and how to apply bulkhead pattern?

Answer
- Pitfalls: over-splitting, distributed transaction complexity, lack of observability, shared DB coupling, insufficient automation.
- Bulkhead: isolate resources (thread pools, connection pools) per component to avoid cascading failures.

Example
`Module05Q3.java` sketches a small fixed-thread-pool bulkhead-like pattern.

Compile & run
```powershell
javac java_tech_lead\topics\Module05Q3\Module05Q3.java
java -cp java_tech_lead\topics\Module05Q3 Module05Q3
```
