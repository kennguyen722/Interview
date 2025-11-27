Module 01 — Q3: Java Memory Model basics (`volatile`, `final`)

Question
Explain basics of the Java Memory Model and the semantics of `volatile` and `final`.

Answer (concise)
- The Java Memory Model (JMM) defines visibility and ordering between threads.
- `volatile` ensures reads/writes go to main memory and provides a happens-before relation for that variable.
- `final` fields have special semantics: if an object is constructed properly and the constructor finishes, other threads will see the correctly constructed final fields (assuming proper publication).

Example
- `Module01Q3.java` shows `volatile` usage to publish a value from writer to reader.

How to compile & run
From repo root:

```powershell
javac java_tech_lead\topics\Module01Q3\Module01Q3.java
java -cp java_tech_lead\topics\Module01Q3 Module01Q3
```

Notes
- `volatile` does not make compound actions atomic (use `Atomic*` or synchronized for that).
