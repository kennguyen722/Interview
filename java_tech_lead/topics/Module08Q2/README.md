Module 08 — Q2: Transaction isolation & optimistic update

Question
Explain transaction isolation levels and show a retry-on-conflict pattern.

Answer
- Isolation levels trade off anomalies vs concurrency. Use optimistic concurrency (version checks) when conflicts are rare; retry on conflict.

Example
`Module08Q2.java` implements a basic optimistic update with a synchronized block.

Compile & run
```powershell
javac java_tech_lead\topics\Module08Q2\Module08Q2.java
java -cp java_tech_lead\topics\Module08Q2 Module08Q2
```
