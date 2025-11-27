Module 02 — Q3: Safe publication of mutable objects

Question
How do you safely publish mutable objects to other threads?

Answer
Use immutability, final fields, volatile references, synchronized blocks, `AtomicReference`, or concurrent data structures. Prefer immutable objects and well-defined publication patterns.

Example: `Module02Q3.java` demonstrates using `AtomicReference` for safe publication.

Compile & run
```powershell
javac java_tech_lead\topics\Module02Q3\Module02Q3.java
java -cp java_tech_lead\topics\Module02Q3 Module02Q3
```
