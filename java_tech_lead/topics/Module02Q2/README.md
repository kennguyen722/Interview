Module 02 — Q2: ExecutorService and thread pools

Question
Explain `ExecutorService` and thread pools.

Answer
`ExecutorService` separates task submission from execution. Use fixed, cached, or scheduled thread pools based on workload. Always shut down executors gracefully and handle rejected submissions.

Example: `Module02Q2.java` — simple fixed thread pool usage.

Compile & run
```powershell
javac java_tech_lead\topics\Module02Q2\Module02Q2.java
java -cp java_tech_lead\topics\Module02Q2 Module02Q2
```
