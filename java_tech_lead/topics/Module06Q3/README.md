Module 06 — Q3: Measuring performance safely

Question
How to measure performance safely in Java?

Answer
- Use JMH for microbenchmarks, warm-up runs, avoid measuring during cold starts, and measure meaningful percentiles (p95/p99) in system tests.

Example
`Module06Q3.java` demonstrates warm-up then measurement (demo only, not JMH).

Compile & run
```powershell
javac java_tech_lead\topics\Module06Q3\Module06Q3.java
java -cp java_tech_lead\topics\Module06Q3 Module06Q3
```
