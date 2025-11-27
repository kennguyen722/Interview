# Course Generation Blueprint

<!-- @copilot:generate -->
<!-- @copilot:expand -->
<!-- @copilot:lesson-auto -->

This file mirrors the prompt specification from `java_tech_lead2.md` instructing automation to scaffold missing lessons.

## Automation Triggers
```
# @copilot:generate
# @copilot:expand
# @copilot:lesson-auto
# @copilot:challenge-generate
```

## Standard Lesson Structure
```
lesson-XX-topic/
  README.md
  LESSON.md
  QUIZ.md
  ANSWERS.md
  EXERCISES.md
  code/
    starter/
    solution/
    tests/
```

Retain these section triggers inside `LESSON.md`:
```
<!-- @copilot:lesson-build -->
<!-- @copilot:expand-section core-theory -->
<!-- @copilot:expand-section examples -->
<!-- @copilot:expand-section pitfalls -->
```

## Slash Commands (Reference)
- `/copilot generate lesson 01-java 01-basics JDK-JRE-JVM`
- `/copilot expand lesson`
- `/copilot audit repo`
- `/copilot fix repo`
- `/copilot build spring-service UserService`

## Notes
Some earlier manually authored lessons exist; duplication may occur. Prefer new structure for consistency while keeping legacy content for reference.

---
*Blueprint file for automation.*
