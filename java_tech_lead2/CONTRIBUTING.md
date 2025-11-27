# Contributing Guide

<!-- @copilot:generate -->
Thank you for helping build the Java Tech Lead Interview Course.

## 1. Workflow
1. Fork or feature branch from `main`.
2. Create/update lesson scaffold using `/copilot generate lesson` command or manual template copy.
3. Add content in `LESSON.md` (keep sections + triggers intact).
4. Provide runnable code in `code/starter` & `code/solution`.
5. Add tests under `code/tests` (JUnit 5). Mark edge cases.
6. Run `mvn clean test` before PR.

## 2. Naming Conventions
- Folders: `lesson-XX-kebab-case-topic`
- Java packages: `com.course.module.submodule.lesson`
- Avoid abbreviations except common (DTO, API).

## 3. Quality Checklist
| Item | Required |
|------|----------|
| README.md present | ✅ |
| LESSON.md sections filled | ✅ |
| QUIZ 5–10 questions | ✅ |
| ANSWERS accuracy | ✅ |
| Exercises clear & progressive | ✅ |
| Code compiles | ✅ |
| Tests pass | ✅ |
| No hard-coded secrets | ✅ |
| Uses triggers intact | ✅ |

## 4. Automation Triggers
Retain:
```
<!-- @copilot:lesson-build -->
<!-- @copilot:expand-section core-theory -->
<!-- @copilot:expand-section examples -->
<!-- @copilot:expand-section pitfalls -->
```

## 5. Style Guidelines
- Prefer clarity > brevity
- Add interview relevance notes where helpful
- Explain trade-offs (performance, complexity, maintainability)

## 6. Testing Guidelines
- Use JUnit 5
- Structure: `Given / When / Then` naming
- Include negative tests (invalid input, exceptions)

## 7. License
All contributions under MIT unless otherwise stated.

## 8. Communication
Open issues for:
- Missing lesson scaffolds
- Inaccurate explanations
- Broken examples / tests

## 9. Large Additions
For bulk lesson generation: create draft PR with representative sample (1–2 lessons) before adding 50+ to ease review.

## 10. Security & Sensitive Data
Do not commit credentials. Use environment variables & sample placeholders.

---
*Thanks for contributing!* 
