param(
  [string]$Root = "d:\GitHub_Src\Interview\complete_java_prep"
)

$ErrorActionPreference = "Stop"
$codeFence = '```'

$planPath = Join-Path $Root "PLAN.md"
$lessonsRoot = Join-Path $Root "lessons"

if (-not (Test-Path $planPath)) {
  throw "PLAN.md not found at $planPath"
}

if (-not (Test-Path $lessonsRoot)) {
  New-Item -Path $lessonsRoot -ItemType Directory | Out-Null
}

function Get-TermDefinition {
  param([string]$term)

  $defs = @{
    "JDK" = "Java Development Kit, the full toolset used to build and run Java applications."
    "JRE" = "Java Runtime Environment, the runtime needed to execute Java programs."
    "JVM" = "Java Virtual Machine, the engine that runs Java bytecode on any platform."
    "Maven" = "A Java build and dependency management tool using pom.xml."
    "Gradle" = "A build automation tool that uses a flexible DSL for project configuration."
    "OOP" = "Object-Oriented Programming, a style that models software using objects and their behavior."
    "Encapsulation" = "Keeping data and rules together, and controlling access through methods."
    "Polymorphism" = "Using one interface with many implementations."
    "Abstraction" = "Hiding unnecessary details and exposing only what callers need."
    "Inheritance" = "Creating a new class from an existing class to reuse behavior."
    "Collections" = "Java data structures like List, Set, and Map for storing groups of values."
    "Generics" = "A Java feature that adds compile-time type safety to reusable code."
    "Stream" = "A Java API for declarative data processing pipelines."
    "Thread" = "A lightweight execution path inside a process."
    "Concurrency" = "Designing software where multiple tasks make progress during the same time window."
    "HTTP" = "Hypertext Transfer Protocol, the request/response protocol of the web."
    "REST" = "An architectural style for API design using HTTP resources and methods."
    "DTO" = "Data Transfer Object, a model used to exchange data across boundaries."
    "Spring" = "A Java framework ecosystem for building enterprise applications."
    "Spring Boot" = "A Spring module that simplifies app setup and production-ready defaults."
    "JPA" = "Java Persistence API, a standard for mapping Java objects to relational tables."
    "Flyway" = "A database migration tool that tracks and applies schema changes incrementally."
    "Redis" = "An in-memory key-value data store commonly used for caching."
    "MongoDB" = "A document-oriented NoSQL database."
    "Kafka" = "A distributed event streaming platform for high-throughput messaging."
    "JWT" = "JSON Web Token, a signed token format used for stateless authentication."
    "OAuth2" = "An authorization framework that delegates access to protected resources."
    "OIDC" = "OpenID Connect, an identity layer built on top of OAuth2."
    "TypeScript" = "A typed superset of JavaScript that improves maintainability and tooling."
    "React" = "A component-based JavaScript library for building user interfaces."
    "Docker" = "A platform for packaging software into portable containers."
    "Kubernetes" = "A container orchestration platform for deploying and scaling services."
    "CI/CD" = "Continuous Integration and Continuous Delivery/Deployment pipelines for automated quality and releases."
    "Prometheus" = "A metrics collection and alerting system."
    "Grafana" = "A dashboarding tool for visualizing metrics and operational data."
    "OpenTelemetry" = "A standard for collecting traces, metrics, and logs for observability."
    "Microservices" = "An architecture style where applications are split into small independently deployable services."
    "Saga" = "A distributed transaction pattern using local transactions plus compensating actions."
    "Outbox" = "A reliability pattern to publish events atomically with database state changes."
    "ADR" = "Architecture Decision Record, a document that captures technical decisions and trade-offs."
    "SLO" = "Service Level Objective, a target reliability metric over a time window."
    "SLI" = "Service Level Indicator, a measured signal of service performance or reliability."
  }

  if ($defs.ContainsKey($term)) {
    return $defs[$term]
  }

  return "$term is a key concept in this lesson. You will define it through examples and guided practice."
}

function Sanitize-Name {
  param([string]$text)
  $s = $text -replace "[^a-zA-Z0-9\-\s]", "" -replace "\s+", "-"
  return $s.Trim('-').ToLower()
}

$lines = Get-Content -Path $planPath
$moduleName = ""
$lessons = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  if ($line -match "^## Module\s+([0-9]+)\.\s+(.+)$") {
    $moduleName = "Module $($matches[1]) - $($matches[2])"
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
      Module = $moduleName
      LessonId = $lessonId
      Title = $lessonTitle
      Topics = $topics
      Output = $output
    }
  }
}

$seedNotes = @{
  "0.1" = @"
## Slow-Paced Lecture Flow
1. Start with vocabulary: JDK, JRE, JVM, terminal, IDE, PATH.
2. Explain why tools matter before writing code.
3. Install Java and verify with java -version and javac -version.
4. Install IDE and create your first project.
5. Run one Java file from terminal and from IDE.

## Key Diagram
${codeFence}mermaid
flowchart LR
  A[Install JDK] --> B[Set PATH]
  B --> C[Install IDE]
  C --> D[Create Project]
  D --> E[Compile and Run]
${codeFence}
"@
  "1.1" = @"
## Slow-Paced Lecture Flow
1. Define variable, type, literal, primitive, reference.
2. Practice declaration and assignment.
3. Show arithmetic and comparison operators.
4. Introduce casting with safe and unsafe examples.
5. Build calculator with input validation.

## Key Diagram
${codeFence}mermaid
flowchart TD
  A[Read Input] --> B[Validate]
  B --> C{Operator}
  C -->|+| D[Add]
  C -->|-| E[Subtract]
  C -->|*| F[Multiply]
  C -->|/| G[Divide]
  D --> H[Print Result]
  E --> H
  F --> H
  G --> H
${codeFence}
"@
  "4.2" = @"
## Slow-Paced Lecture Flow
1. Define resource, endpoint, HTTP method, status code, DTO.
2. Build controller and DTOs.
3. Add validation annotations and global exception handling.
4. Add pagination and filtering.
5. Verify API behavior with test cases and sample requests.

## Key Diagram
${codeFence}mermaid
sequenceDiagram
  participant C as Client
  participant A as API Controller
  participant S as Service
  participant R as Repository
  C->>A: POST /api/resources
  A->>S: validate + map DTO
  S->>R: save entity
  R-->>S: saved entity
  S-->>A: response DTO
  A-->>C: 201 Created
${codeFence}
"@
  "8.3" = @"
## Slow-Paced Lecture Flow
1. Define cluster, node, pod, deployment, service, ingress.
2. Deploy one app with deployment.yaml.
3. Expose with service.yaml.
4. Add readiness and liveness probes.
5. Perform rolling update and rollback.

## Key Diagram
${codeFence}mermaid
graph TD
  U[User] --> I[Ingress]
  I --> S[Service]
  S --> P1[Pod 1]
  S --> P2[Pod 2]
  S --> P3[Pod 3]
${codeFence}
"@
}

function Build-LectureNotes {
  param($lesson)

  $topicLine = if ($lesson.Topics.Count -gt 0) { ($lesson.Topics -join "; ") } else { "Core concepts of this lesson" }
  $terms = @()
  foreach ($t in $lesson.Topics) {
    $chunks = $t -split "[,/()]| and "
    foreach ($c in $chunks) {
      $trim = $c.Trim()
      if ($trim.Length -ge 3 -and $trim -match "^[A-Za-z0-9\+\#\-\s]+$") {
        if (-not ($terms -contains $trim)) {
          $terms += $trim
        }
      }
    }
  }
  $terms = $terms | Select-Object -First 8

  $defs = @()
  foreach ($term in $terms) {
    $defs += "- **$term**: $(Get-TermDefinition -term $term)"
  }
  if ($defs.Count -eq 0) {
    $defs += "- **Core concept**: A foundational idea in this lesson that you will apply through examples."
  }

  $seed = ""
  if ($seedNotes.ContainsKey($lesson.LessonId)) {
    $seed = $seedNotes[$lesson.LessonId]
  } else {
    $seed = @"
## Slow-Paced Lecture Flow
1. Start by defining each important term before writing code.
2. Walk through one small example from input to output.
3. Explain why the example works and where beginners get stuck.
4. Extend the example with one practical variation.
5. Summarize decision points and trade-offs.

## Key Diagram
${codeFence}mermaid
flowchart LR
  A[Concept] --> B[Guided Example]
  B --> C[Practice]
  C --> D[Reflection]
${codeFence}
"@
  }

  $sampleCode = @"
${codeFence}java
/**
 * Lesson $($lesson.LessonId) sample starter.
 * Replace TODO blocks during guided practice.
 */
public class LessonSample {
    public static void main(String[] args) {
        String lesson = "$($lesson.Title)";
        System.out.println("Running lesson: " + lesson);

        // TODO: Add lesson-specific logic step by step.
        // Keep each change small and verify output after every step.
    }
}
${codeFence}
"@

  return @"
# Lesson $($lesson.LessonId) Lecture Notes: $($lesson.Title)

## Context
- Module: $($lesson.Module)
- Lesson focus: $topicLine
- Expected output: $($lesson.Output)

## Learning Objectives
- Understand the main ideas in this lesson in plain language.
- Practice each concept through incremental coding steps.
- Build confidence by validating results at every step.
- Produce the expected lesson output with clean, readable code.

## Terms You Meet First in This Lesson
$($defs -join "`n")

$seed

## Guided Code Walkthrough
Start with this minimal file, run it, then add behavior one small step at a time.

$sampleCode

## Professional Notes
- Prefer clear naming over clever shortcuts.
- Validate assumptions with small tests or quick manual checks.
- Keep commits small so each change is easy to review.

## Checkpoint Questions
1. Can you explain each term in your own words?
2. Can you run the sample and change one behavior safely?
3. Can you describe one real-world use case of this lesson?
"@
}

function Build-Exercises {
  param($lesson)

  return @"
# Lesson $($lesson.LessonId) Exercises: $($lesson.Title)

## Warm-Up (Easy)
1. Rewrite the guided example with your own variable names.
2. Add one additional input and print a formatted result.
3. Document one common mistake and how to avoid it.

## Core Practice (Medium)
1. Implement the main lesson output: **$($lesson.Output)**.
2. Add validation for at least two edge cases.
3. Refactor one part for readability and explain why it is better.

## Challenge (Advanced)
1. Extend the solution with one extra feature relevant to this lesson.
2. Add tests or verification steps for the extension.
3. Write a short engineering note about trade-offs you made.

## Submission Checklist
- [ ] Code compiles/runs
- [ ] Edge cases covered
- [ ] Output demonstrated
- [ ] Reflection written
"@
}

function Build-Glossary {
  param($lesson)

  $rows = @()
  $rows += "| Term | Definition |"
  $rows += "|---|---|"

  $candidate = @()
  foreach ($t in $lesson.Topics) {
    $parts = $t -split "[,/()]| and "
    foreach ($p in $parts) {
      $pt = $p.Trim()
      if ($pt.Length -ge 3) {
        $candidate += $pt
      }
    }
  }
  $candidate = $candidate | Select-Object -Unique | Select-Object -First 12

  foreach ($c in $candidate) {
    $rows += "| $c | $(Get-TermDefinition -term $c) |"
  }

  if ($candidate.Count -eq 0) {
    $rows += "| Lesson Concept | Foundational concept of this lesson. |"
  }

  return @"
# Glossary: Lesson $($lesson.LessonId) - $($lesson.Title)

$($rows -join "`n")
"@
}

function Build-SampleReadme {
  param($lesson)

  return @"
# Sample Project: Lesson $($lesson.LessonId)

## Goal
Build a working mini project for **$($lesson.Title)**.

## Suggested Structure
- `src/main/java/App.java`
- `src/test/java/AppTest.java` (when tests apply)
- `README.md`

## Steps
1. Implement the baseline behavior from lecture notes.
2. Add one validation scenario.
3. Add one extension feature.
4. Record before/after behavior in notes.

## Acceptance
- Program runs end to end.
- Key concept from this lesson is visible in code.
- Output aligns with: **$($lesson.Output)**.
"@
}

function Build-SampleCode {
  param($lesson)

  $className = "Lesson" + ($lesson.LessonId -replace "\.", "_") + "App"

  return @"
public class $className {
    public static void main(String[] args) {
        System.out.println("Lesson $($lesson.LessonId): $($lesson.Title)");
        // Step 1: Add baseline implementation.
        // Step 2: Add validation and edge-case handling.
        // Step 3: Refactor for readability.
    }
}
"@
}

function Build-Checklist {
  param($lesson)

  return @"
# Checklist: Lesson $($lesson.LessonId)

## Before Starting
- [ ] Read lecture notes fully
- [ ] Identify unknown terms
- [ ] Prepare local environment

## During Practice
- [ ] Complete guided walkthrough
- [ ] Run code after each small change
- [ ] Complete warm-up and core exercises

## Before Marking Complete
- [ ] Finish challenge exercise
- [ ] Update glossary with your own examples
- [ ] Commit your sample project changes
- [ ] Reflect on what was hardest and why
"@
}

function Build-Index {
  param($lesson, [string]$relativeFolder)

  return @"
# Lesson $($lesson.LessonId): $($lesson.Title)

## Contents
- [Lecture Notes](lecture-notes.md)
- [Exercises](exercises.md)
- [Glossary](glossary.md)
- [Checklist](checklist.md)
- [Sample Project](sample-project/README.md)

## Outcome
$($lesson.Output)

## Quick Start
1. Read lecture-notes.md slowly and define each new term.
2. Complete exercises.md in order.
3. Build and run sample-project.
4. Use checklist.md to close the lesson.
"@
}

foreach ($lesson in $lessons) {
  $slug = "lesson-$($lesson.LessonId)-$(Sanitize-Name -text $lesson.Title)"
  $lessonDir = Join-Path $lessonsRoot $slug
  $sampleDir = Join-Path $lessonDir "sample-project"
  $srcMain = Join-Path $sampleDir "src\main\java"

  New-Item -Path $srcMain -ItemType Directory -Force | Out-Null

  Set-Content -Path (Join-Path $lessonDir "README.md") -Value (Build-Index -lesson $lesson -relativeFolder $slug) -Encoding UTF8
  Set-Content -Path (Join-Path $lessonDir "lecture-notes.md") -Value (Build-LectureNotes -lesson $lesson) -Encoding UTF8
  Set-Content -Path (Join-Path $lessonDir "exercises.md") -Value (Build-Exercises -lesson $lesson) -Encoding UTF8
  Set-Content -Path (Join-Path $lessonDir "glossary.md") -Value (Build-Glossary -lesson $lesson) -Encoding UTF8
  Set-Content -Path (Join-Path $lessonDir "checklist.md") -Value (Build-Checklist -lesson $lesson) -Encoding UTF8
  Set-Content -Path (Join-Path $sampleDir "README.md") -Value (Build-SampleReadme -lesson $lesson) -Encoding UTF8
  Set-Content -Path (Join-Path $srcMain "App.java") -Value (Build-SampleCode -lesson $lesson) -Encoding UTF8
}

$courseIndex = @()
$courseIndex += "# Java Tech Stack Detailed Lessons"
$courseIndex += ""
$courseIndex += "Generated from PLAN.md with structured lesson assets for each lesson."
$courseIndex += ""
$courseIndex += "## Lesson Packages"
foreach ($lesson in $lessons) {
  $slug = "lesson-$($lesson.LessonId)-$(Sanitize-Name -text $lesson.Title)"
  $courseIndex += "- [$($lesson.LessonId) - $($lesson.Title)](lessons/$slug/README.md)"
}

Set-Content -Path (Join-Path $Root "COURSE_LESSONS.md") -Value ($courseIndex -join "`n") -Encoding UTF8

Write-Host "Generated $($lessons.Count) lesson folders under $lessonsRoot"
