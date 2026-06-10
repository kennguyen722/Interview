# Exercise Answers - Lesson 10.3: Code Review Mastery

## Warm-Up Answers
1. Key terms:
- Explain each new term in one sentence and provide one short practical example.
- Tie each term to where it appears in your code.
2. Input -> Process -> Output map:
- Input: learner-provided values or request data.
- Process: logic for Reviewing for correctness, maintainability, security; Feedback quality and collaboration style.
- Output: Peer review simulation.
3. Common mistake:
- Typical issue: implementing too much at once.
- Fix: build one small behavior, run it, then continue.

## Guided Practice Answers
1. Run baseline:
- Execute sample-project and confirm output prints lesson context.
2. Change behavior:
- Add one new condition branch and verify output changes.
3. Add validation:
- Validate null/empty/invalid input before processing.

## Challenge Answers
1. Extension feature:
- Add one production-like enhancement relevant to this lesson.
2. Test plan:
- Normal case
- Boundary case
- Invalid input
- Null/empty path
- Performance/safety case
3. Refactor:
- Extract one method to reduce complexity and improve readability.

## Complete Answer Code Sample
```java
public class ExerciseAnswerSample {
    public static void main(String[] args) {
        String input = "sample";

        if (input == null || input.isBlank()) {
            System.out.println("Validation failed");
            return;
        }

        String output = "Processed: " + input.toUpperCase();
        System.out.println(output);
    }
}
```
