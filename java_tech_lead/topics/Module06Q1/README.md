Module 06 — Q1: Finding JVM CPU hotspots

Question
How do you find and fix a JVM CPU hotspot?

Answer (summary)
- Reproduce load, use profilers (async-profiler, Java Flight Recorder, VisualVM), inspect flame graphs, optimize algorithmic complexity, reduce locking or add caching.

Example
`Module06Q1.java` simulates a heavy loop and shows a micro-optimization.

Compile & run
```powershell
javac java_tech_lead\topics\Module06Q1\Module06Q1.java
java -cp java_tech_lead\topics\Module06Q1 Module06Q1
```
