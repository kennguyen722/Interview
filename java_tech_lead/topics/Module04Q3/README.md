Module 04 — Q3: Consistency vs availability trade-offs

Question
How do you approach trade-offs between consistency and availability?

Answer
Use CAP reasoning: decide which operations need strong consistency and which can be eventually consistent. Use leader-based ordering, quorum writes, or CRDTs depending on the requirements.

Example
`Module04Q3.java` — simple version-based reconciliation example.

Compile & run
```powershell
javac java_tech_lead\topics\Module04Q3\Module04Q3.java
java -cp java_tech_lead\topics\Module04Q3 Module04Q3
```
