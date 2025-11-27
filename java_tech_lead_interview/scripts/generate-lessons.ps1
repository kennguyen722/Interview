# Script: generate-lessons.ps1
# Purpose: Auto-generate lesson directory structures and template files per COURSE-OVERVIEW blueprint.
# Usage: Run from repository root with: powershell.exe -ExecutionPolicy Bypass -File .\scripts\generate-lessons.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $root

function New-Lesson {
    param(
        [string]$ModulePath,
        [string]$Submodule,
        [string]$LessonName,
        [int]$Index
    )
    $lessonDirName = ('lesson-{0}-{1}' -f $Index.ToString('00'), $LessonName).ToLower()
    $subPath = Join-Path $ModulePath $Submodule
    if (!(Test-Path $subPath)) { New-Item -ItemType Directory -Path $subPath | Out-Null }
    $lessonPath = Join-Path $subPath $lessonDirName
    if (Test-Path $lessonPath) { return }
    New-Item -ItemType Directory -Path $lessonPath | Out-Null
    # README
    @"
# Lesson ${Index}: ${LessonName}

## Learning Objectives
- Placeholder objective 1
- Placeholder objective 2
- Placeholder objective 3

## Duration
~30-45 minutes

## Prerequisites
See module README.

## Files
LESSON.md, QUIZ.md, ANSWERS.md, EXERCISES.md, code/.
"@ | Set-Content (Join-Path $lessonPath 'README.md')
    # LESSON
    @"
# Lesson ${Index}: ${LessonName}

## 1. Learning Objectives
- Objective 1
- Objective 2
- Objective 3

## 2. Why This Matters for a Java Tech Lead
Context placeholder.

## 3. Core Theory
### 3.1 Key Concepts
Placeholder.

### 3.2 Interview-Style Explanation
Concise explanation placeholder.

## 4. Code Examples
```java
public class Example {
    public static void main(String[] args) {
        System.out.println("$LessonName example");
    }
}
```

## 5. Pitfalls & Best Practices
- Pitfall placeholder
- Best practice placeholder

## 6. Hands-On Exercises
Refer to EXERCISES.md.

## 7. Interview Cheat Sheet
Key bullets placeholder.

## 8. Further Reading
Links placeholder.

<!-- @copilot:expand-section core-theory -->
<!-- @copilot:expand-section examples -->
<!-- @copilot:expand-section pitfalls -->
<!-- @copilot:lesson-build -->
"@ | Set-Content (Join-Path $lessonPath 'LESSON.md')
    @"
1. (MCQ) Placeholder question
2. (Short Answer) Placeholder
3. (Scenario) Placeholder
4. (True/False) Placeholder
5. (Coding logic) Placeholder
"@ | Set-Content (Join-Path $lessonPath 'QUIZ.md')
    @"
## Q1 Answer
Explanation placeholder.
"@ | Set-Content (Join-Path $lessonPath 'ANSWERS.md')
    @"
## Exercise 1
Goal
Description
Starter Code
Expected Output
"@ | Set-Content (Join-Path $lessonPath 'EXERCISES.md')
    $codePath = Join-Path $lessonPath 'code'
    New-Item -ItemType Directory -Path $codePath | Out-Null
    foreach ($d in 'starter','solution','tests') { New-Item -ItemType Directory -Path (Join-Path $codePath $d) | Out-Null }
    @"
// @copilot:fill-solution
public class StarterExample {
    public static void main(String[] args) {
        System.out.println("Starter for $LessonName");
    }
}
"@ | Set-Content (Join-Path (Join-Path $codePath 'starter') 'StarterExample.java')
    @"
public class StarterExample {
    public static void main(String[] args) {
        System.out.println("Solution for $LessonName");
    }
}
"@ | Set-Content (Join-Path (Join-Path $codePath 'solution') 'StarterExample.java')
    @"
// @copilot:generate-tests
public class StarterExampleTest {
    public static void main(String[] args) {
        StarterExample.main(new String[0]);
        System.out.println("Test executed for $LessonName");
    }
}
"@ | Set-Content (Join-Path (Join-Path $codePath 'tests') 'StarterExampleTest.java')
}

# Define blueprint mapping (module -> submodule -> lesson list)
$blueprint = @{
    '01-java' = @{
        '01-basics' = 'jdk-jre-jvm','primitives-vs-references','control-flow','memory-model'
        '02-oop' = 'four-pillars','overloading-vs-overriding','interfaces-vs-abstract-classes'
        '03-collections' = 'collections-framework','hashmap-internals','iterators'
        '04-generics' = 'generic-basics','wildcards-pecs','type-erasure'
        '05-streams' = 'streams-intro','map-filter-reduce','collectors'
        '06-exceptions' = 'exception-hierarchy','try-with-resources','custom-exceptions'
        '07-io' = 'io-vs-nio2','file-operations','serialization'
        '08-functional' = 'lambda-expressions','method-references','functional-patterns'
    }
    '02-advanced-java' = @{
        '01-concurrency-multithreading' = 'thread-fundamentals','synchronization','concurrent-collections','executor-framework','locks-conditions','atomic-operations','completablefuture','parallel-processing'
        '02-jvm-memory-management' = 'jvm-architecture','classloading','bytecode','jit-compiler','profiling-tools'
        '03-gc' = 'garbage-collection-basics','gc-algorithms','gc-tuning','memory-leaks'
        '04-memory-model' = 'memory-areas','reference-types','memory-optimization'
        '05-performance' = 'performance-fundamentals','benchmarking','optimization-techniques','monitoring-tools'
        '06-security' = 'security-fundamentals','secure-coding','cryptography'
    }
    '03-spring' = @{
        '01-core' = 'ioc-container','dependency-injection','bean-lifecycle','configuration','aop','profiles-properties'
        '02-mvc' = 'mvc-architecture','controllers','rest-apis','validation','exception-handling'
        '03-data' = 'jdbc-template','jpa-hibernate','repositories','transactions','caching','database-migrations'
        '04-boot' = 'auto-configuration','starters','actuator','profiles','testing','packaging-deployment','monitoring'
        '05-security' = 'authentication','authorization','oauth2-jwt','method-security','security-best-practices'
        '06-testing' = 'unit-testing','integration-testing','test-slices','testcontainers'
        '07-cloud' = 'spring-cloud-config','service-discovery','circuit-breakers'
        '08-reactive' = 'webflux','reactive-streams'
    }
    '04-microservices' = @{
        '01-patterns' = 'decomposition-patterns','database-per-service','api-gateway','service-mesh','backends-for-frontends'
        '02-communication' = 'synchronous-communication','asynchronous-messaging','event-driven-architecture','saga-pattern'
        '03-data' = 'cqrs','event-sourcing','data-consistency'
        '04-resilience' = 'circuit-breaker','retry-patterns','bulkhead','timeout-patterns','chaos-engineering'
        '05-observability' = 'distributed-tracing','metrics-monitoring','logging','health-checks'
        '06-deployment' = 'containerization','orchestration','ci-cd','blue-green-canary'
    }
    '05-aws' = @{
        '01-compute' = 'ec2','lambda','ecs-fargate'
        '02-storage' = 's3','ebs-efs'
        '03-messaging' = 'sqs','sns'
        '04-database' = 'rds','dynamodb'
        '05-networking' = 'vpc','api-gateway'
        '06-security' = 'iam','security-best-practices'
        '07-monitoring' = 'cloudwatch','x-ray'
    }
        '07-architecture' = @{
            '01-patterns' = 'architectural-styles','enterprise-patterns','domain-driven-design'
            '02-decisions' = 'architecture-decisions','technology-choices'
            '03-documentation' = 'architecture-documentation','c4-model'
            '04-evolution' = 'legacy-modernization','evolutionary-architecture'
        }
    '06-system-design' = @{
        '01-fundamentals' = 'scalability','load-balancing','caching','databases'
        '02-patterns' = 'architectural-patterns','data-patterns','communication-patterns'
        '03-case-studies' = 'url-shortener','chat-system','newsfeed','notification-system','web-crawler'
        '04-trade-offs' = 'cap-theorem','consistency-models','performance-vs-consistency'
        '05-estimation' = 'capacity-planning','back-of-envelope'
    }
    '08-leadership' = @{
        '01-team-management' = 'team-building','delegation','performance-management'
        '02-communication' = 'effective-communication','presentation-skills','stakeholder-management'
        '03-conflict-resolution' = 'conflict-identification','resolution-strategies'
        '04-decision-making' = 'decision-frameworks','risk-management'
    }
    '09-behavioral' = @{
        '01-star-method' = 'star-framework','story-preparation'
        '02-scenarios' = 'leadership-scenarios','technical-challenges','conflict-situations','innovation-examples'
        '03-preparation' = 'research-company','question-preparation'
    }
    '10-coding-challenges' = @{
        '01-data-structures' = 'arrays-strings','linked-lists','trees-graphs','heaps-tries','advanced-structures'
        '02-algorithms' = 'sorting-searching','dynamic-programming','greedy-algorithms','graph-algorithms','string-algorithms'
        '03-system-implementation' = 'design-implementations','concurrent-systems','distributed-systems'
    }
}

foreach ($module in $blueprint.Keys) {
    $modulePath = Join-Path $root $module
    if (!(Test-Path $modulePath)) { New-Item -ItemType Directory -Path $modulePath | Out-Null }
    foreach ($sub in $blueprint[$module].Keys) {
        foreach ($i in 0..($blueprint[$module][$sub].Count - 1)) {
            $name = $blueprint[$module][$sub][$i]
            New-Lesson -ModulePath $modulePath -Submodule $sub -LessonName $name -Index ($i+1)
        }
    }
}

Write-Host "Lesson scaffolding complete." -ForegroundColor Green
