Module 06 — Q2: Latency vs Throughput trade-offs

Question
What are trade-offs between latency and throughput?

Answer
- Batching and asynchronous processing increase throughput at the cost of added latency; parallelism and pipelining can increase both but may complicate backpressure handling.

Example
`Module06Q2.java` compares naive vs batched processing.

Compile & run
```powershell
javac java_tech_lead\topics\Module06Q2\Module06Q2.java
java -cp java_tech_lead\topics\Module06Q2 Module06Q2
```
