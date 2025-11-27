Module 03 — Q2: Diagnosing memory leaks

Question
How do you approach diagnosing a memory leak in Java?

Answer
Reproduce, capture heap dump, analyze with MAT/VisualVM/jmap, look for large retained sets and unexpected GC roots (static caches, listeners), and fix strong references.

Example
`Module03Q2.java` shows a simple static-list leak pattern to observe heap growth.

Compile & run
```powershell
javac java_tech_lead\topics\Module03Q2\Module03Q2.java
java -cp java_tech_lead\topics\Module03Q2 Module03Q2
```
