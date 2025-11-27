# Script: populate-lesson-assets.ps1
# Purpose: Generate or enrich per-lesson auxiliary files (README.md, QUIZ.md, ANSWERS.md, EXERCISES.md,
#          starter/solution/test code) according to PROMPTS-BLUEPRINT.md without overwriting rich existing content.
# Usage:  powershell.exe -ExecutionPolicy Bypass -File scripts/populate-lesson-assets.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $root

# Heuristic metadata maps (extendable). Keys = topic slug after lesson-XX-
$objectiveMap = @{
  'jdk-jre-jvm' = @('Differentiate JDK/JRE/JVM components','Inspect runtime properties programmatically','Explain JVM execution pipeline in interviews');
  'concurrent-systems' = @('Recognize concurrency primitives','Select appropriate synchronization strategy','Design thread-safe components');
  'hashmap-internals' = @('Explain hashing & collision resolution','Analyze load factor impact','Avoid common misuse pitfalls');
  'streams-intro' = @('Build transformation pipelines','Use reduction & aggregation','Avoid performance traps');
  'garbage-collection-basics' = @('Describe generational GC','Interpret GC logs','Choose collector for SLA');
  'scalability' = @('Differentiate vertical vs horizontal scaling','Apply partitioning & caching','Evaluate scalability trade-offs');
  'api-gateway' = @('Explain gateway roles','Configure routing & aggregation','Apply security & resilience patterns');
  'ec2' = @('Select appropriate instance types','Configure autoscaling groups','Optimize cost vs performance');
  'cqrs' = @('Separate read/write models','Design command & query flows','Assess CQRS applicability');
  'dynamodb' = @('Design partition/sort keys','Optimize RCU/WCU usage','Handle hot partitions');
  # Spring Core
  'ioc-container' = @('Explain Inversion of Control principle','Compare BeanFactory vs ApplicationContext','Trace bean creation & destruction lifecycle');
  'dependency-injection' = @('Differentiate constructor vs setter injection','Leverage @Configuration and @Bean methods','Resolve circular dependency scenarios');
  'bean-lifecycle' = @('Sequence initialization callbacks','Use @PostConstruct/@PreDestroy appropriately','Customize lifecycle with BeanPostProcessor');
  'configuration' = @('Externalize config with properties & YAML','Bind config using @ConfigurationProperties','Profile-specific bean configuration');
  'aop' = @('Explain cross-cutting concerns & join points','Design pointcuts using AspectJ expressions','Implement advice for logging & transactions');
  'profiles-properties' = @('Activate profiles via environment','Isolate environment-specific beans','Securely manage secrets & sensitive config');
  # Spring MVC
  'dispatcher-servlet' = @('Describe request flow through DispatcherServlet','Configure handler mappings & view resolution','Differentiate @Controller vs @RestController');
  'request-mapping' = @('Use composed annotations (@GetMapping etc.)','Handle path variables & query params','Version REST endpoints cleanly');
  'validation' = @('Apply Bean Validation annotations','Create custom validators','Return structured validation errors');
  'error-handling' = @('Centralize errors with @ControllerAdvice','Map exceptions to HTTP status codes','Return consistent error payload schema');
  # Spring Data
  'jdbc-template' = @('Execute queries with JdbcTemplate','Map rows efficiently','Handle transactions declaratively');
  'jpa-hibernate' = @('Explain entity states & persistence context','Optimize fetch strategies & batching','Avoid N+1 select performance issues');
  'repositories' = @('Leverage derived query methods','Customize with @Query JPQL/SQL','Extend base repository interfaces');
  'transactions' = @('Explain ACID & propagation levels','Select isolation levels for scenarios','Diagnose common transactional pitfalls');
  'caching' = @('Apply @Cacheable/@CacheEvict/@CachePut','Choose cache store (Redis vs Caffeine)','Implement cache invalidation strategies');
  'database-migrations' = @('Version schema changes with Flyway/Liquibase','Plan backward-compatible migrations','Automate migration in CI/CD');
  # Spring Boot
  'auto-configuration' = @('Describe how auto-configuration selects beans','Use conditional annotations (@Conditional*)','Customize via disabling or overriding defaults');
  'starters' = @('Select relevant starter dependencies','Analyze dependency tree impact','Create custom starter modules');
  'actuator' = @('Expose operational endpoints securely','Customize health indicators','Integrate metrics with observability stack');
  'monitoring' = @('Instrument app with Micrometer','Ship traces & metrics to APM','Define SLIs & alert thresholds');
  'packaging-deployment' = @('Build layered jars/OCI images','Configure build plugins (Spring Boot / Jib)','Prepare artifacts for cloud deployment');
  # Spring Security
  'security-overview' = @('Explain authentication vs authorization','Understand filter chain ordering','Integrate security with application layers');
  'authentication-authorization' = @('Configure UsernamePasswordAuthentication','Implement role/authority hierarchy','Secure method calls with @PreAuthorize');
  'jwt' = @('Structure JWT claims & signature','Implement token issuance & refresh','Mitigate common JWT vulnerabilities');
  'oauth2' = @('Differentiate Authorization Code vs Client Credentials','Configure resource server & authorization server','Handle token introspection & scopes');
  'method-security' = @('Enable method security annotations','Design fine-grained permission checks','Test secured methods effectively');
  # Spring Cloud
  'service-discovery' = @('Register services with Eureka/Consul','Resolve instances client-side','Handle instance health & eviction');
  'load-balancing' = @('Differentiate server vs client-side strategies','Configure Spring Cloud LoadBalancer','Use retries & backoff for resilience');
  'circuit-breaker' = @('Apply resilience patterns (retry, bulkhead)','Configure circuit breaker thresholds','Fallback strategies & graceful degradation');
  'config-server' = @('Centralize configuration via Config Server','Refresh properties dynamically','Secure configuration repository access');
  'distributed-tracing' = @('Propagate trace/span IDs across services','Interpret trace waterfall diagrams','Correlate logs with trace context');
}

$prereqMap = @{
  'jdk-jre-jvm' = 'Basic Java syntax';
  'hashmap-internals' = 'Understanding of equals/hashCode';
  'streams-intro' = 'Collections & lambdas';
  'garbage-collection-basics' = 'JVM architecture overview';
  'ec2' = 'AWS account & console familiarity';
  'cqrs' = 'Domain-driven design basics';
  # Spring Core prereqs
  'ioc-container' = 'Java classes & interfaces';
  'dependency-injection' = 'OOP + constructor/setter patterns';
  'bean-lifecycle' = 'IoC container basics';
  'configuration' = 'Property files & environment variables';
  'aop' = 'Proxy pattern + Java annotations';
  'profiles-properties' = 'Basic Spring configuration';
  # Spring MVC prereqs
  'dispatcher-servlet' = 'HTTP fundamentals';
  'request-mapping' = 'REST basics';
  'validation' = 'Bean Validation (JSR 380)';
  'error-handling' = 'Exception hierarchy understanding';
  # Spring Data prereqs
  'jdbc-template' = 'SQL & JDBC basics';
  'jpa-hibernate' = 'Relational modeling & annotations';
  'repositories' = 'JPA entity definitions';
  'transactions' = 'ACID semantics';
  'caching' = 'Key-value store basics';
  'database-migrations' = 'DDL & version control';
  # Spring Boot prereqs
  'auto-configuration' = 'Spring Core fundamentals';
  'starters' = 'Maven/Gradle dependency management';
  'actuator' = 'Basic Spring Boot app';
  'monitoring' = 'Metrics & logging basics';
  'packaging-deployment' = 'Jar vs container concepts';
  # Spring Security prereqs
  'security-overview' = 'HTTP & servlet filters';
  'authentication-authorization' = 'Security overview basics';
  'jwt' = 'Authentication & token concepts';
  'oauth2' = 'Authentication-Authorization basics';
  'method-security' = 'Spring Security configuration';
  # Spring Cloud prereqs
  'service-discovery' = 'Microservices fundamentals';
  'load-balancing' = 'Service discovery basics';
  'circuit-breaker' = 'Resilience patterns basics';
  'config-server' = 'External configuration basics';
  'distributed-tracing' = 'Logging & monitoring fundamentals';
}

function Get-Title($slug){
  $parts = $slug -split '-'
  ($parts | ForEach-Object { $_.Substring(0,1).ToUpper()+$_.Substring(1) }) -join ' '
}

function Ensure-File($path,$generator){
  if(-not (Test-Path $path)) { & $generator $path; return }
  $size = (Get-Item $path).Length
  # Force regeneration if placeholder objectives still present
  $content = Get-Content -Raw $path
  if($content -match 'Placeholder objective'){ & $generator $path; return }
  if($size -lt 180){ & $generator $path }
}

function Write-Readme($path){
  $folder = Split-Path -Parent $path
  $lessonDir = Split-Path $folder -Leaf
  if($lessonDir -match 'lesson-\d+-(.+)$'){ $slug = $Matches[1] } else { $slug = $lessonDir }
  $title = Get-Title $slug
  $objectives = $objectiveMap[$slug]; if(-not $objectives){ $objectives = @('Understand core concepts','Apply topic to real scenarios','Prepare concise interview explanation') }
  $prereq = $prereqMap[$slug]; if(-not $prereq){ $prereq = 'General Java fundamentals' }
  $content = @"
# $title

## Learning Objectives
$(($objectives | ForEach-Object { "- $_" }) -join "`n")

## Estimated Duration
30-45 minutes

## Prerequisites
- $prereq

## Files Included
- LESSON.md
- QUIZ.md
- ANSWERS.md
- EXERCISES.md
- code/starter
- code/solution
- code/tests

<!-- @copilot:lesson-build -->
"@
  Set-Content -Path $path -Value $content
}

function Write-Quiz($path){
  $folder = Split-Path -Parent $path
  $lessonDir = Split-Path $folder -Leaf
  if($lessonDir -match 'lesson-\d+-(.+)$'){ $slug = $Matches[1] } else { $slug = $lessonDir }
  $title = Get-Title $slug
  $questions = @(
    "1. (MCQ) Which statement about $title is MOST accurate?",
    "2. (Short) Describe one real-world use case for $title.",
    "3. (Scenario) Given a production issue related to $title, outline a remediation step.",
    "4. (True/False) $title improves maintainability when used correctly.",
    "5. (Code) Identify the bug in this simplified $title snippet and propose a fix." )
  $content = $questions -join "`n"
  Set-Content -Path $path -Value $content
}

function Write-Answers($path){
  $answers = @"
## Q1 Answer
Explain key principle.

## Q2 Answer
Relevant succinct scenario.

## Q3 Answer
Root cause + mitigation.

## Q4 Answer
True (with justification) or False.

## Q5 Answer
Logic flaw explanation + corrected snippet.
"@
  Set-Content -Path $path -Value $answers
}

function Write-Exercises($path){
  $folder = Split-Path -Parent $path
  $lessonDir = Split-Path $folder -Leaf
  if($lessonDir -match 'lesson-\d+-(.+)$'){ $slug = $Matches[1] } else { $slug = $lessonDir }
  $title = Get-Title $slug
  $content = @"
## Exercise 1: Apply $title Basics
Goal: Reinforce fundamental concept.
Description: Implement a minimal example demonstrating primary mechanism of $title.
Starter Code: See code/starter/Example.java
Expected Output: Demonstrates correct core behavior.

## Exercise 2: Edge Case Handling
Goal: Explore pitfalls.
Description: Extend solution to handle one edge or failure scenario related to $title.
Expected Output: Program handles edge condition gracefully.
"@
  Set-Content -Path $path -Value $content
}

function Write-Starter($path){
  $dir = Split-Path -Parent $path
  $lessonDir = Split-Path (Split-Path $dir -Parent) -Leaf
  if($lessonDir -match 'lesson-\d+-(.+)$'){ $slug = $Matches[1] } else { $slug = $lessonDir }
  $title = Get-Title $slug
  $code = @"
// @copilot:fill-solution
// Starter illustrating $title
public class Example {
  public static void main(String[] args) {
    System.out.println("Starter for $title");
  }
}
"@
  Set-Content -Path $path -Value $code
}

function Write-Solution($path){
  $code = @"
// Solution implementation (initial placeholder)
public class Solution {
  public static void main(String[] args) {
    Example.main(args); // Extend with real logic
  }
}
"@
  Set-Content -Path $path -Value $code
}

function Write-Test($path){
  $code = @"
// @copilot:generate-tests
// Basic placeholder test (adapt to JUnit in full build)
class ExampleTest {
  public static void main(String[] args){
    System.out.println("Run basic validation: OK");
  }
}
"@
  Set-Content -Path $path -Value $code
}

function Process-Lesson($dir){
  $readme = Join-Path $dir 'README.md'
  Ensure-File $readme { param($p) Write-Readme $p }

  $quiz = Join-Path $dir 'QUIZ.md'
  Ensure-File $quiz { param($p) Write-Quiz $p }

  $answers = Join-Path $dir 'ANSWERS.md'
  Ensure-File $answers { param($p) Write-Answers $p }

  $ex = Join-Path $dir 'EXERCISES.md'
  Ensure-File $ex { param($p) Write-Exercises $p }

  $codeRoot = Join-Path $dir 'code'
  $starterDir = Join-Path $codeRoot 'starter'
  $solutionDir = Join-Path $codeRoot 'solution'
  $testsDir = Join-Path $codeRoot 'tests'
  foreach($c in @($starterDir,$solutionDir,$testsDir)){ if(-not (Test-Path $c)){ New-Item -ItemType Directory -Path $c | Out-Null } }

  $starterFile = Join-Path $starterDir 'Example.java'
  $solutionFile = Join-Path $solutionDir 'Solution.java'
  $testFile = Join-Path $testsDir 'ExampleTest.java'
  if(-not (Test-Path $starterFile)){ Write-Starter $starterFile }
  if(-not (Test-Path $solutionFile)){ Write-Solution $solutionFile }
  if(-not (Test-Path $testFile)){ Write-Test $testFile }

  Write-Host "Enriched: $(Split-Path $dir -Leaf)" -ForegroundColor Yellow
}

$lessonDirs = Get-ChildItem -Path $root -Recurse -Directory | Where-Object { $_.Name -like 'lesson-*' }
foreach($d in $lessonDirs){ Process-Lesson $d.FullName }
Write-Host "Lesson asset population completed." -ForegroundColor Green
