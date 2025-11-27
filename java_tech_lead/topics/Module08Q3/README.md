Module 08 — Q3: Schema changes in distributed systems

Question
How to handle schema changes in distributed systems?

Answer
- Make schema changes backward/forward compatible: add nullable columns, use feature flags, perform rolling upgrades, and maintain versioned consumers.

Example
`Module08Q3.java` shows adding a new nullable field without breaking readers.

Compile & run
```powershell
javac java_tech_lead\topics\Module08Q3\Module08Q3.java
java -cp java_tech_lead\topics\Module08Q3 Module08Q3
```
