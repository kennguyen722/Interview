Module 04 — Q1: Scalable URL shortener (design)

Question
How do you design a scalable URL shortener?

Answer (summary)
- Provide create and resolve APIs, generate short unique IDs (base62, DB sequence, or hash + collision handling), cache resolves at the edge, partition storage, and rate-limit to prevent abuse.

Example
`Module04Q1.java` — a tiny in-memory shortener prototype.

Compile & run
```powershell
javac java_tech_lead\topics\Module04Q1\Module04Q1.java
java -cp java_tech_lead\topics\Module04Q1 Module04Q1
```
