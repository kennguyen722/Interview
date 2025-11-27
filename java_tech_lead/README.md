Java Tech Lead Interview Prep — Topics Layout

This repository contains a set of interview topics organized into per-question folders under `topics/`.

How it's organized
- `CURRICULUM.md` — study path and links to topics
- `modules/` — original module summaries
- `examples/` — initial examples (kept for reference)
- `topics/ModuleXXQY/` — combined folder per question containing:
  - `README.md` — question, detailed answer, explanation, how to configure/compile/run
  - `ModuleXXQY.java` — Java example demonstrating the concept

Compile & run all topic examples (PowerShell)

Compile every example under `topics/`:

```powershell
cd d:\GitHub_Src\Interview
javac java_tech_lead\topics\*\*.java
```

Run a specific topic (example: Module01Q1):

```powershell
java -cp java_tech_lead\topics\Module01Q1 Module01Q1
```

Notes
- Each topic folder is self-contained and includes instructions to compile/run from the project root.
- If you'd like a Gradle/Maven build or a launcher to run chosen topics interactively, I can add one.
