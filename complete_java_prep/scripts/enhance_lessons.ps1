param(
  [string]$Root = "d:\GitHub_Src\Interview\complete_java_prep"
)

$ErrorActionPreference = "Stop"

$planPath = Join-Path $Root "PLAN.md"
$lessonsRoot = Join-Path $Root "lessons"
$moduleProjectsRoot = Join-Path $Root "module-projects"
$codeFence = '```'

if (-not (Test-Path $planPath)) {
  throw "PLAN.md not found: $planPath"
}
if (-not (Test-Path $lessonsRoot)) {
  throw "Lessons folder not found: $lessonsRoot"
}

function Sanitize-Name {
  param([string]$text)
  return (($text.ToLower() -replace "[^a-z0-9]+", "-").Trim('-'))
}

function Get-TermDefinition {
  param([string]$term)

  $defs = @{
    "variable" = "A named memory location that stores a value."
    "primitive" = "A built-in Java value type, such as int, double, or boolean."
    "reference" = "A value that points to an object in memory."
    "operator" = "A symbol that performs computation, such as +, -, ==, or &&."
    "casting" = "Converting a value from one type to another."
    "oop" = "Object-Oriented Programming, a way of modeling systems with objects and behavior."
    "class" = "A blueprint that defines data and behavior for objects."
    "object" = "A runtime instance of a class."
    "encapsulation" = "Bundling state and behavior together while controlling access."
    "inheritance" = "A mechanism where one class reuses behavior from another class."
    "polymorphism" = "One interface, many implementations."
    "abstraction" = "Exposing only essential details while hiding complexity."
    "collection" = "A data structure for storing groups of values."
    "generic" = "A type-safe template for reusable classes and methods."
    "stream" = "A declarative pipeline API for processing sequences of data."
    "thread" = "A unit of execution within a process."
    "concurrency" = "Handling multiple tasks that progress during overlapping time."
    "http" = "The web protocol used by clients and servers to exchange requests and responses."
    "rest" = "A resource-oriented API style built on HTTP semantics."
    "dto" = "A Data Transfer Object used for API request and response boundaries."
    "spring" = "A Java ecosystem for enterprise application development."
    "spring boot" = "Spring tooling that simplifies setup with auto-configuration."
    "jpa" = "Java Persistence API for mapping Java objects to relational tables."
    "redis" = "An in-memory data store commonly used for caching."
    "mongodb" = "A document-oriented NoSQL database."
    "kafka" = "A distributed event streaming platform."
    "rabbitmq" = "A broker for reliable asynchronous messaging."
    "jwt" = "A signed token format for stateless auth contexts."
    "oauth2" = "A delegated authorization framework."
    "oidc" = "An identity layer built on top of OAuth2."
    "typescript" = "A typed superset of JavaScript."
    "react" = "A component-based UI library for web frontends."
    "docker" = "A container runtime and packaging platform."
    "kubernetes" = "A container orchestration platform for deployment and scaling."
    "cicd" = "Automated build, test, and deployment pipelines."
    "sli" = "A measured service metric for reliability or performance."
    "slo" = "A reliability target for an SLI over a time window."
    "adr" = "Architecture Decision Record documenting a technical decision and trade-offs."
  }

  $key = $term.Trim().ToLower()
  if ($defs.ContainsKey($key)) { return $defs[$key] }
  return "$term is a key concept in this lesson."
}

function Get-LessonSample {
  param($lesson)

  $id = $lesson.LessonId
  $title = $lesson.Title.Replace('"', '\"')

  switch -Regex ($id) {
    '^0\.1$' {
      return @"
import java.util.Map;

public class AnswerApp {
    public static void main(String[] args) {
        Map<String, String> checks = Map.of(
            "java", System.getProperty("java.version"),
            "os", System.getProperty("os.name"),
            "user", System.getProperty("user.name")
        );

        System.out.println("Environment verification for Lesson 0.1");
        checks.forEach((k, v) -> System.out.println(k + ": " + v));
        System.out.println("Status: READY");
    }
}
"@
    }
    '^1\.1$' {
      return @"
import java.util.Scanner;

public class AnswerApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter first number: ");
        double a = scanner.nextDouble();
        System.out.print("Enter operator (+,-,*,/): ");
        String op = scanner.next();
        System.out.print("Enter second number: ");
        double b = scanner.nextDouble();

        double result;
        switch (op) {
            case "+" -> result = a + b;
            case "-" -> result = a - b;
            case "*" -> result = a * b;
            case "/" -> {
                if (b == 0) {
                    System.out.println("Validation error: division by zero");
                    return;
                }
                result = a / b;
            }
            default -> {
                System.out.println("Validation error: unsupported operator");
                return;
            }
        }

        System.out.println("Result: " + result);
    }
}
"@
    }
    '^4\.2$' {
      return @"
// Spring Boot answer snippet for Lesson 4.2 (conceptual placement)
// This file is intentionally plain Java to keep compilation simple in this sample project.

public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("Lesson 4.2 answer focus: REST controller + DTO + validation + global errors");
        System.out.println("Use @RestController, @Valid, and @ControllerAdvice in your Spring app.");
    }
}
"@
    }
    '^8\.3$' {
      return @"
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("Lesson 8.3 answer focus: Kubernetes deployment + service + rolling update");
        System.out.println("Add deployment.yaml, service.yaml, and probes in k8s manifests.");
    }
}
"@
    }
    default {
      return @"
public class AnswerApp {
    public static void main(String[] args) {
        String lessonId = "$id";
        String lessonTitle = "$title";

        System.out.println("Answer sample for lesson " + lessonId + ": " + lessonTitle);
        System.out.println("Step 1: Build minimal working behavior.");
        System.out.println("Step 2: Add validation and edge-case handling.");
        System.out.println("Step 3: Refactor for readability and testability.");
    }
}
"@
    }
  }
}

function Get-ExerciseAnswers {
  param($lesson)

  $topicLine = if ($lesson.Topics.Count -gt 0) { ($lesson.Topics -join "; ") } else { "core lesson topics" }

  return @"
# Exercise Answers - Lesson $($lesson.LessonId): $($lesson.Title)

## Warm-Up Answers
1. Key terms:
- Explain each new term in one sentence and provide one short practical example.
- Tie each term to where it appears in your code.
2. Input -> Process -> Output map:
- Input: learner-provided values or request data.
- Process: logic for $topicLine.
- Output: $($lesson.Output).
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
${codeFence}java
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
${codeFence}
"@
}

function Get-DetailedLecture {
  param($lesson)

  $topicLine = if ($lesson.Topics.Count -gt 0) { ($lesson.Topics -join "; ") } else { "Core concepts" }

  $rawTerms = @()
  foreach ($t in $lesson.Topics) {
    $parts = $t -split "[,/()]| and "
    foreach ($p in $parts) {
      $term = $p.Trim()
      if ($term.Length -ge 3) { $rawTerms += $term }
    }
  }
  $terms = $rawTerms | Select-Object -Unique | Select-Object -First 10
  if ($terms.Count -eq 0) { $terms = @("Core concept") }

  $termLines = @()
  foreach ($term in $terms) {
    $termLines += "- **$term**: $(Get-TermDefinition $term)"
  }

  return @"
# Detailed Lecture Notes - Lesson $($lesson.LessonId): $($lesson.Title)

## Lesson Context
- Module: $($lesson.ModuleName)
- Primary topics: $topicLine
- Target output: $($lesson.Output)
- Pace: Slow and incremental, with validation after each step

## Learning Objectives
1. Understand all core terms before coding.
2. Build one working path from input to output.
3. Add validation and error handling.
4. Refactor for readability and maintainability.
5. Explain the solution as if teaching a beginner.

## First-Time Terms and Definitions
$($termLines -join "`n")

## Slow-Paced Teaching Flow
1. Concept brief (what and why)
- Explain the problem in plain language.
- Identify inputs, transformations, and outputs.
2. Minimal implementation
- Implement the smallest working solution.
- Run immediately and inspect output.
3. Validation layer
- Add constraints and handle invalid states.
- Re-run and verify behavior with edge cases.
4. Professional improvement
- Extract methods, clarify names, remove duplication.
- Add comments only where logic is non-obvious.
5. Reflection
- Summarize trade-offs and next improvements.

## Annotated Demonstration
${codeFence}java
public class LessonDemo {
    public static void main(String[] args) {
        // Step 1: Start from explicit input values
        String raw = "lesson-input";

        // Step 2: Validate early to keep behavior safe
        if (raw == null || raw.isBlank()) {
            System.out.println("Invalid input");
            return;
        }

        // Step 3: Apply core lesson transformation
        String result = raw.trim().toUpperCase();

        // Step 4: Produce deterministic output
        System.out.println("Output: " + result);
    }
}
${codeFence}

## Concept Diagram
${codeFence}mermaid
flowchart LR
  A[Read Requirements] --> B[Define Terms]
  B --> C[Build Minimal Code]
  C --> D[Add Validation]
  D --> E[Refactor]
  E --> F[Verify Output]
${codeFence}

## Practice Checklist
- [ ] I can explain each term without notes.
- [ ] I ran the demo code and changed one behavior.
- [ ] I added one validation case and tested it.
- [ ] I can explain how this lesson supports full-stack development.
"@
}

$lines = Get-Content -Path $planPath
$currentModuleNo = ""
$currentModuleName = ""
$lessons = @()

for ($i = 0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]

  if ($line -match "^## Module\s+([0-9]+)\.\s+(.+)$") {
    $currentModuleNo = $matches[1]
    $currentModuleName = $matches[2]
    continue
  }

  if ($line -match "^### Lesson\s+([0-9]+\.[0-9]+)\s+-\s+(.+)$") {
    $lessonId = $matches[1]
    $lessonTitle = $matches[2].Trim()
    $topics = @()
    $output = ""

    for ($j = $i + 1; $j -lt $lines.Count; $j++) {
      $next = $lines[$j]
      if ($next -match "^### Lesson\s+" -or $next -match "^## Module\s+" -or $next -match "^---") {
        break
      }
      if ($next -match "^-\s+Output:\s+(.+)$") {
        $output = $matches[1].Trim()
      } elseif ($next -match "^-\s+(.+)$") {
        $topics += $matches[1].Trim()
      }
    }

    $lessons += [PSCustomObject]@{
      ModuleNo = $currentModuleNo
      ModuleName = $currentModuleName
      LessonId = $lessonId
      Title = $lessonTitle
      Topics = $topics
      Output = $output
    }
  }
}

$answerIndex = @()
$answerIndex += "# Lesson Answer Key Index"
$answerIndex += ""
$answerIndex += "Each lesson includes answer code samples and exercise answers."
$answerIndex += ""

foreach ($lesson in $lessons) {
  $slug = "lesson-$($lesson.LessonId)-$(Sanitize-Name $lesson.Title)"
  $lessonDir = Join-Path $lessonsRoot $slug
  if (-not (Test-Path $lessonDir)) {
    New-Item -ItemType Directory -Path $lessonDir | Out-Null
  }

  $sampleDir = Join-Path $lessonDir "sample-project"
  $srcDir = Join-Path $sampleDir "src\main\java"
  $answersDir = Join-Path $sampleDir "answers"
  New-Item -ItemType Directory -Force -Path $srcDir, $answersDir | Out-Null

  Set-Content -Path (Join-Path $lessonDir "lecture-notes.md") -Value (Get-DetailedLecture $lesson) -Encoding UTF8
  Set-Content -Path (Join-Path $lessonDir "exercises-answers.md") -Value (Get-ExerciseAnswers $lesson) -Encoding UTF8

  $lessonAnswerCode = @"
# Answer Code Sample - Lesson $($lesson.LessonId): $($lesson.Title)

## Purpose
Provide a direct answer implementation reference for this lesson.

## Java Answer
${codeFence}java
$(Get-LessonSample $lesson)
${codeFence}
"@
  Set-Content -Path (Join-Path $lessonDir "answer-code-sample.md") -Value $lessonAnswerCode -Encoding UTF8

  Set-Content -Path (Join-Path $srcDir "AnswerApp.java") -Value (Get-LessonSample $lesson) -Encoding UTF8

  $rubric = @"
# Rubric - Lesson $($lesson.LessonId): $($lesson.Title)

## Scoring (100 points)
- Concept understanding: 25
- Correct implementation: 25
- Validation and robustness: 20
- Code quality and readability: 15
- Explanation and reflection: 15

## Pass Threshold
- Minimum passing score: 75

## Excellence Criteria
- Handles edge cases cleanly
- Uses clear naming and modular logic
- Demonstrates professional trade-off reasoning
"@
  Set-Content -Path (Join-Path $lessonDir "rubric.md") -Value $rubric -Encoding UTF8

  $answersSnippet = @"
# Additional Answer Snippets - Lesson $($lesson.LessonId)

## Exercise A - Reference Pattern
${codeFence}java
String input = "value";
if (input == null || input.isBlank()) {
    throw new IllegalArgumentException("input must not be blank");
}
System.out.println(input.trim());
${codeFence}

## Exercise B - Refactor Pattern
${codeFence}java
private static String normalize(String value) {
    return value == null ? "" : value.trim().toLowerCase();
}
${codeFence}
"@
  Set-Content -Path (Join-Path $answersDir "exercise-snippets.md") -Value $answersSnippet -Encoding UTF8

  $answerIndex += "- Lesson $($lesson.LessonId): [Answers](./$slug/exercises-answers.md) | [Code](./$slug/answer-code-sample.md)"
}

Set-Content -Path (Join-Path $lessonsRoot "ANSWER-KEY-INDEX.md") -Value ($answerIndex -join "`r`n") -Encoding UTF8

$moduleGroups = $lessons | Group-Object ModuleNo | Sort-Object Name
New-Item -ItemType Directory -Force -Path $moduleProjectsRoot | Out-Null

$moduleIndex = @()
$moduleIndex += "# Module Projects"
$moduleIndex += ""
$moduleIndex += "Progressive module projects that integrate lessons into full-stack outcomes."
$moduleIndex += ""

foreach ($group in $moduleGroups) {
  $moduleNo = $group.Name
  $moduleName = ($group.Group | Select-Object -First 1).ModuleName
  $moduleSlug = "module-$moduleNo-$(Sanitize-Name $moduleName)"
  $moduleDir = Join-Path $moduleProjectsRoot $moduleSlug
  $solutionDir = Join-Path $moduleDir "solution"
  New-Item -ItemType Directory -Force -Path $moduleDir, $solutionDir | Out-Null

  $moduleReadme = @"
# Module Project - Module ${moduleNo}: $moduleName

## Goal
Integrate all module lessons into one practical deliverable.

## Scope
- Build an increment based on module competencies.
- Add tests, documentation, and deployment notes where relevant.
- Prepare a short design rationale.

## Milestones
1. Foundation implementation
2. Validation and reliability improvements
3. Observability and operational readiness
4. Review and retrospective

## Deliverables
- Source code
- README with runbook
- Architecture diagram
- Test evidence

## Diagram
${codeFence}mermaid
flowchart LR
  A[Requirements] --> B[Design]
  B --> C[Implementation]
  C --> D[Testing]
  D --> E[Release]
${codeFence}
"@
  Set-Content -Path (Join-Path $moduleDir "README.md") -Value $moduleReadme -Encoding UTF8

  $solutionCode = @"
public class Module${moduleNo}Project {
    public static void main(String[] args) {
        System.out.println("Module $moduleNo project solution baseline");
        System.out.println("Focus: $moduleName");
    }
}
"@
  Set-Content -Path (Join-Path $solutionDir "Module${moduleNo}Project.java") -Value $solutionCode -Encoding UTF8

  $moduleRubric = @"
# Module Rubric - Module $moduleNo

## Criteria
- Feature completeness: 30
- Correctness and reliability: 25
- Code quality: 20
- Test evidence: 15
- Documentation quality: 10
"@
  Set-Content -Path (Join-Path $moduleDir "RUBRIC.md") -Value $moduleRubric -Encoding UTF8

  $moduleIndex += "- [Module $moduleNo - $moduleName](./$moduleSlug/README.md)"
}

Set-Content -Path (Join-Path $moduleProjectsRoot "README.md") -Value ($moduleIndex -join "`r`n") -Encoding UTF8

$globalRubrics = @"
# Global Assessment Guide

## Lesson-Level
- Use each lesson rubric.md
- Passing threshold: 75/100

## Module-Level
- Use each module project RUBRIC.md
- Require complete deliverables for pass

## Program-Level Completion
- All lessons complete
- All module projects complete
- Capstone presentation complete
"@
Set-Content -Path (Join-Path $Root "ASSESSMENT_GUIDE.md") -Value $globalRubrics -Encoding UTF8

Write-Host "Enhanced lessons: $($lessons.Count)"
Write-Host "Module projects: $($moduleGroups.Count)"
