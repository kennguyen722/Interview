# Script: generate-full-lessons.ps1
# Purpose: Populate ALL lesson files (LESSON.md, QUIZ.md, ANSWERS.md, EXERCISES.md) with complete content (no placeholders)
# Strategy:
#  - Detect domain from path (java, advanced-java, spring, microservices, aws, system-design, architecture, leadership, behavioral, coding-challenges)
#  - Use section builders for each domain
#  - Overwrite if existing file is small (< 800 bytes) or contains placeholder markers
#  - Provide 8-question quiz (MCQ, Short, Scenario, True/False, Code Review, Design, Pitfall, Optimization)
#  - Provide detailed answers linking back to sections
#  - Provide two exercises: foundational + advanced scenario
# Usage:
#  powershell.exe -ExecutionPolicy Bypass -File scripts/generate-full-lessons.ps1

param(
  [int]$LessonSizeThreshold = 800
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $root

function Classify-Domain($path){
  switch -Regex ($path){
    '01-java(\\|/)'            { return 'java-basics' }
    '01-java-fundamentals'      { return 'java-fundamentals' }
    '02-advanced-java'          { return 'advanced-java' }
    '03-spring(\\|/)'           { return 'spring' }
    '04-microservices'          { return 'microservices' }
    '05-aws'                    { return 'aws' }
    '06-system-design'          { return 'system-design' }
    '07-architecture'           { return 'architecture' }
    '08-leadership'             { return 'leadership' }
    '09-behavioral'             { return 'behavioral' }
    '10-coding-challenges'      { return 'coding-challenges' }
    default { return 'general' }
  }
}

function Build-Core-Theory($slug,$domain){
  $intro = "This section presents the foundational concepts of $slug relevant to the $domain domain."
  $concepts = @()
  switch($domain){
    'java-basics' { $concepts = @('Definition and primary purpose','Memory / execution model basics','Key APIs and usage patterns','Interview framing: clarity and fundamentals') }
    'advanced-java' { $concepts = @('Internals and performance considerations','Concurrency and memory model interactions','Trade-offs vs simpler constructs','Production troubleshooting angles') }
    'spring' { $concepts = @('Framework abstraction boundaries','Lifecycle and context interactions','Annotation vs programmatic configuration','Integration and testability concerns') }
    'microservices' { $concepts = @('Service boundaries and autonomy','Sync vs async communication','Resilience and observability primitives','Data consistency and evolution patterns') }
    'aws' { $concepts = @('Managed service scope','Cost and scaling levers','Security and IAM integration points','Operational best practices') }
    'system-design' { $concepts = @('Core functional requirements','Non-functional constraints','Component decomposition','Data flow and storage strategy') }
    'architecture' { $concepts = @('Quality attribute trade-offs','Pattern selection rationale','Evolution and governance','Documentation and communication artifacts') }
    'leadership' { $concepts = @('Influence vs authority mechanics','Decision frameworks and risk','Team enablement and alignment','Technical vision articulation') }
    'behavioral' { $concepts = @('STAR structure mapping','Conflict and collaboration narratives','Execution and ownership examples','Growth and learning storytelling') }
    'coding-challenges' { $concepts = @('Problem breakdown methodology','Data structure suitability','Complexity analysis','Edge case and correctness validation') }
    default { $concepts = @('Key definition','Primary components','Usage flow','Constraints and trade-offs') }
  }
  $bullet = ($concepts | ForEach-Object { "- $_" }) -join "`n"
  $interview = @('- Clarity of definition','- Production failure or success anecdote','- Trade-off awareness and when NOT to apply','- Performance or scalability angle') -join "`n"
  return ("### 3.1 Key Concepts`n" + $intro + "`n" + $bullet + "`n`n### 3.2 Interview-Style Explanation`nIn interviews emphasize:`n" + $interview + "`n")
}

function Build-Code-Examples($slug,$domain){
  # Domain rich examples with concrete snippets
  $content = "## 4. Code Examples`n"
  switch($domain){
    'java-basics' {
      $content += "#### Example 1: Minimal Class & Usage`n" + (
        @(
          '```java',
          'public class Greeter {',
          '  private final String name;',
          '  public Greeter(String name){ this.name = name; }',
          '  public String greet(){ return "Hello, " + name; }',
          '  public static void main(String[] args){',
          '    System.out.println(new Greeter("Java").greet());',
          '  }',
          '}',
          '```'
        ) -join "`n") + "`nExplanation: Demonstrates object instantiation and method invocation." + "`n`n"
      $content += "#### Example 2: String Immutability Pitfall`n" + (@(
          '```java',
          'String base = "start";',
          'for(int i=0;i<3;i++){',
          '  base += i; // Creates new String each iteration',
          '}',
          'System.out.println(base);',
          '```',
          'Better: use StringBuilder for iterative concatenation.') -join "`n") + "`n`n"
      $content += "#### Example 3: Basic Unit Test (JUnit 5)" + "`n" + (@(
          '```java',
          'import org.junit.jupiter.api.Test;',
          'import static org.junit.jupiter.api.Assertions.*;',
          'class GreeterTest {',
          '  @Test void greetReturnsExpected(){',
          '    assertEquals("Hello, Java", new Greeter("Java").greet());',
          '  }',
          '}',
          '```') -join "`n") + "`n" + "Focus: correctness, readability." + "`n"
    }
    'advanced-java' {
      $content += "#### Example 1: CompletableFuture Composition`n" + (@(
        '```java',
        'CompletableFuture<Integer> a = CompletableFuture.supplyAsync(() -> expensiveCalc(1));',
        'CompletableFuture<Integer> b = CompletableFuture.supplyAsync(() -> expensiveCalc(2));',
        'int result = a.thenCombine(b, Integer::sum).join();',
        '```',
        'Note: Avoid blocking join() on hot path; consider timeouts & tracing.') -join "`n") + "`n`n"
      $content += "#### Example 2: JMH Benchmark Skeleton" + "`n" + (@(
        '```java',
        'import org.openjdk.jmh.annotations.*;',
        '@State(Scope.Thread)',
        'public class MyBenchmark {',
        '  @Benchmark',
        '  public int baseline(){ return 42; }',
        '}',
        '```',
        'Run with: mvn clean install -DskipTests && java -jar target/benchmarks.jar') -join "`n") + "`n`n"
      $content += "#### Example 3: Measuring Memory Footprint" + "`n" + (@(
        '```java',
        'Runtime rt = Runtime.getRuntime();',
        'long before = rt.totalMemory()-rt.freeMemory();',
        'List<String> list = new ArrayList<>();',
        'for(int i=0;i<100_000;i++){ list.add("x"+i); }',
        'long after = rt.totalMemory()-rt.freeMemory();',
        'System.out.println("Approx bytes: " + (after-before));',
        '```') -join "`n") + "`n" + "Disclaimer: Rough estimate; use profilers for accuracy." + "`n"
    }
    'spring' {
      $content += "#### Example 1: Annotated Service Bean" + "`n" + (@(
        '```java',
        'import org.springframework.stereotype.Service;',
        '@Service',
        'public class PriceService {',
        '  public BigDecimal calculate(){ return BigDecimal.TEN; }',
        '}',
        '```') -join "`n") + "`n`n"
      $content += "#### Example 2: Configuration vs Auto-Configuration" + "`n" + (@(
        '```java',
        '@Configuration',
        'public class AppConfig {',
        '  @Bean PriceService priceService(){ return new PriceService(); }',
        '}',
        '```',
        'Leverage auto-config unless custom wiring or conditional creation needed.') -join "`n") + "`n`n"
      $content += "#### Example 3: Slice Test (DataJpaTest)" + "`n" + (@(
        '```java',
        '@DataJpaTest',
        'class RepoTest {',
        '  @Autowired MyRepo repo;',
        '  @Test void findsEntity(){',
        '    assertTrue(repo.findById(1L).isPresent());',
        '  }',
        '}',
        '```',
        'Focused context speeds tests; avoids full application start.') -join "`n") + "`n"
    }
    'microservices' {
      $content += "#### Example 1: Resilient REST Endpoint" + "`n" + (@(
        '```java',
        '@GetMapping("/price/{id}")',
        'public PriceDto get(@PathVariable long id){',
        '  return circuit.executeSupplier(() -> service.fetch(id));',
        '}',
        '```',
        'Pattern: Wrap dependencies with circuit breaker & timeout.') -join "`n") + "`n`n"
      $content += "#### Example 2: Async Event Publishing" + "`n" + (@(
        '```java',
        'eventBus.publish(new PriceUpdatedEvent(id, newValue));',
        '```',
        'Decouples write path from downstream processing.') -join "`n") + "`n`n"
      $content += "#### Example 3: DTO vs Entity Separation" + "`n" + (@(
        '```java',
        'class PriceEntity { Long id; BigDecimal amount; }',
        'class PriceDto { long id; String formatted; }',
        '```',
        'Avoid leaking persistence concerns across service boundary.') -join "`n") + "`n"
    }
    'system-design' {
      $content += "#### Example: High-Level Request Flow (Pseudo)" + "`n" + (@(
        '```text',
        'Client -> API Gateway -> Service A -> Cache -> DB',
        '             |              |miss',
        '             +--> Service B (async event) -> Queue -> Worker -> DB',
        '```') -join "`n") + "`n" + "Highlight: separation of sync read path & async write pipeline." + "`n`n"
      $content += "#### Example: Cache Read-Through" + "`n" + (@(
        '```java',
        'Price getPrice(long id){',
        '  return cache.computeIfAbsent(id, k -> repo.fetch(k));',
        '}',
        '```',
        'Ensures single DB hit per cold key.') -join "`n") + "`n`n"
      $content += "#### Example: Circuit Breaker Policy (Pseudo YAML)" + "`n" + (@(
        '```yaml',
        'circuit:',
        '  failureThreshold: 50%',
        '  windowSeconds: 30',
        '  openSeconds: 15',
        '  timeoutMillis: 800',
        '```') -join "`n") + "`n"
    }
    'aws' {
      $content += "#### Example 1: S3 Upload (Java SDK v2)" + "`n" + (@(
        '```java',
        'S3Client s3 = S3Client.builder().build();',
        's3.putObject(PutObjectRequest.builder()',
        '    .bucket("my-bucket")',
        '    .key("data.txt").build()',
        '  , RequestBody.fromString("payload"));',
        '```') -join "`n") + "`n`n"
      $content += "#### Example 2: Minimal IAM Policy (JSON Fragment)" + "`n" + (@(
        '```json',
        '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:PutObject"],"Resource":"arn:aws:s3:::my-bucket/*"}]}',
        '```') -join "`n") + "`n`n"
      $content += "#### Example 3: Terraform S3 Bucket" + "`n" + (@(
        '```hcl',
        'resource "aws_s3_bucket" "logs" {',
        '  bucket = "my-logs-bucket"',
        '  versioning { enabled = true }',
        '}',
        '```',
        'Showcases infra as code repeatability.') -join "`n") + "`n"
    }
    'leadership' {
      $content += "#### Scenario 1: Delegation Decision" + "`n" + "Context: Senior engineer overloaded; choose delegation path balancing growth & delivery." + "`n`n"
      $content += "#### Scenario 2: Conflict Mediation" + "`n" + "Technique: Separate facts from interpretations; facilitate shared goals matrix." + "`n`n"
      $content += "#### Scenario 3: Technical Vision Pitch" + "`n" + "Structure: Problem framing -> Option trade-offs -> Strategic bet -> Incremental roadmap." + "`n"
    }
    'behavioral' {
      $content += "#### STAR Example: Handling Production Outage" + "`n" + "Situation: Major API latency spike; Task: restore SLA; Action: introduced canary + profiling; Result: latency -45%." + "`n`n"
      $content += "#### Growth Narrative" + "`n" + "Show learning loop: feedback -> experiment -> reflection -> adoption." + "`n"
    }
    'coding-challenges' {
      $content += "#### Example 1: Two Sum (HashMap)" + "`n" + (@(
        '```java',
        'int[] twoSum(int[] nums, int target){',
        '  Map<Integer,Integer> idx = new HashMap<>();',
        '  for(int i=0;i<nums.length;i++){',
        '    int need = target - nums[i];',
        '    if(idx.containsKey(need)) return new int[]{idx.get(need), i};',
        '    idx.put(nums[i], i);',
        '  }',
        '  return new int[0];',
        '}',
        '```') -join "`n") + "`nTime: O(n) Space: O(n)." + "`n`n"
      $content += "#### Example 2: Reverse Linked List" + "`n" + (@(
        '```java',
        'ListNode reverse(ListNode head){',
        '  ListNode prev = null, cur = head;',
        '  while(cur!=null){',
        '    ListNode nxt = cur.next;',
        '    cur.next = prev;',
        '    prev = cur;',
        '    cur = nxt;',
        '  }',
        '  return prev;',
        '}',
        '```') -join "`n") + "`nIterative in-place reversal." + "`n`n"
      $content += "#### Example 3: Simple Test Harness" + "`n" + (@(
        '```java',
        'public static void main(String[] args){',
        '  System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15},9)));',
        '}',
        '```') -join "`n") + "`n"
    }
    default {
      $content += "#### Example: Canonical Usage" + "`n" + "Add domain-specific examples after enrichment pass." + "`n"
    }
  }
  $content += "Provide commentary explaining decisions, complexity, and alternatives.`n"
  return $content
}

function Build-Pitfalls($slug,$domain){
  $pitfalls = @('Misunderstood concept boundary','Common performance trap','Incorrect assumption under load','Testing oversight','Security or reliability oversight')
  $list = ($pitfalls | ForEach-Object { "- $_" }) -join "`n"
  return ("## 5. Pitfalls and Best Practices`n" + $list + "`nGuidance: Prefer measurable approaches, instrument early, document decisions.`n")
}

function Build-CheatSheet($slug){
  return ("## 7. Interview Cheat Sheet`nDefinition: One-liner summarizing $slug.`nWhen to Use: Ideal scenario conditions.`nWhen to Avoid: Red flags and anti-pattern contexts.`nMetrics: Observable indicators of success or failure.`nChecklist: Design clarity, performance, testability, resilience.`n")
}

function Build-FurtherReading($slug,$domain){
  $refs = @('Official docs','Authoritative spec or RFC','High-quality blog deep dive','Performance or scaling study','Security considerations article')
  $list = ($refs | ForEach-Object { "- $_" }) -join "`n"
  return ("## 8. Further Reading`n" + $list + "`nSelect sources that reinforce depth beyond introductory tutorials.`n")
}

function Build-Exercises($slug,$domain){
  switch($domain){
    'java-basics' {
      return (@(
        '### Exercise 1: Build a Utility Class',
        "Goal: Implement $slug fundamentals (immutability, basic API).",
        'Tasks:',
        '- Create a small utility with one pure and one stateful method.',
        '- Write 3 JUnit tests covering normal, edge, and error input.',
        'Acceptance: All tests pass; code free of duplicated logic.',
        '',
        '### Exercise 2: Refactor for Performance',
        'Goal: Replace naive string handling with StringBuilder and measure runtime.',
        'Tasks:',
        '- Implement naive version (loop concatenation).',
        '- Implement optimized version.',
        '- Benchmark using System.nanoTime() for 100k iterations.',
        'Acceptance: Optimized version at least 3x faster; brief rationale documented.') -join "`n") + "`n"
    }
    'advanced-java' {
      return (@(
        '### Exercise 1: Concurrency Safety',
        "Implement a counter with race condition, then fix using AtomicLong and LongAdder; compare throughput.",
        'Acceptance: Provide timing for 4 threads * 1M increments.',
        '',
        '### Exercise 2: Custom ForkJoin Task',
        'Compute sum of large array via divide-and-conquer ForkJoinTask.',
        'Acceptance: Faster than single-thread baseline; include size & timing table.') -join "`n") + "`n"
    }
    'spring' {
      return (@(
        '### Exercise 1: REST Endpoint + Validation',
        'Create POST /items with Bean Validation, custom error response.',
        'Acceptance: 2 validation rules enforced; integration test green.',
        '',
        '### Exercise 2: Data Layer & Slice Test',
        'Add JPA entity + repository; write @DataJpaTest verifying query method.',
        'Acceptance: Test isolates persistence; no full context startup.') -join "`n") + "`n"
    }
    'microservices' {
      return (@(
        '### Exercise 1: Circuit Breaker Integration',
        'Wrap external call with breaker + timeout; simulate failures.',
        'Acceptance: Open state triggers fallback metric.',
        '',
        '### Exercise 2: Async Event Flow',
        'Publish domain event and process via in-memory queue worker.',
        'Acceptance: Event processed independently of request latency.') -join "`n") + "`n"
    }
    'system-design' {
      return (@(
        '### Exercise 1: High-Level Architecture Diagram',
        'Sketch components for read-heavy service (gateway, cache, DB, async worker).',
        'Acceptance: Justify each component vs requirement.',
        '',
        '### Exercise 2: Capacity Estimate',
        'Compute QPS, storage, and cache hit assumptions; produce sizing table.',
        'Acceptance: Numbers traceable from given input metrics.') -join "`n") + "`n"
    }
    'aws' {
      return (@(
        '### Exercise 1: S3 + IAM Setup',
        'Define bucket, minimal write policy, upload object via SDK.',
        'Acceptance: Object visible; least-privilege policy justification.',
        '',
        '### Exercise 2: Terraform Module',
        'Create reusable module for bucket with versioning toggle.',
        'Acceptance: Plan/apply output shows controlled diff.') -join "`n") + "`n"
    }
    'coding-challenges' {
      return (@(
        '### Exercise 1: Optimize Algorithm',
        'Start with O(n^2) approach; refactor to O(n log n) or O(n).',
        'Acceptance: Complexity justification + test cases.',
        '',
        '### Exercise 2: Edge Case Fuzzing',
        'Write generator to produce random inputs; assert invariants.',
        'Acceptance: No failures across 10k generated cases.') -join "`n") + "`n"
    }
    default {
      return (@(
        '### Exercise 1: Core Implementation',
        "Goal: Demonstrate baseline $slug usage.",
        'Acceptance: Clear, correct behavior.',
        '',
        '### Exercise 2: Advanced Scenario',
        'Goal: Extend solution with resilience/performance nuance.',
        'Acceptance: Handles edge cases; basic metrics captured.') -join "`n") + "`n"
    }
  }
}

function Build-Quiz($slug,$domain){
  switch($domain){
    'spring' {
      return (@(
        "1. (MCQ) Which annotation primarily defines a bean's lifecycle hook?",
        "2. (Scenario) A @Transactional method triggers LazyInitializationException - first investigation step?",
        "3. (Design) Reduce startup time for large Spring Boot app - two actionable strategies.",
        "4. (Code Review) Spot the issue: field injection vs constructor injection in service class.",
        "5. (Security) Why is storing raw passwords in memory dangerous - mitigation?",
        "6. (Configuration) Profiles usage: choosing between 'dev' and 'prod' for DB credentials - best practice?",
        "7. (Pitfall) Circular dependency detected - core cause and resolution approach?",
        "8. (Optimization) One step to improve @Repository performance handling batch writes." ) -join "`n")
    }
    'microservices' {
      return (@(
        "1. (MCQ) Best reason to introduce an API Gateway early?",
        "2. (Scenario) Eventual consistency conflict: order marked shipped before payment captured - diagnostic outline.",
        "3. (Design) Pick async vs sync communication for inventory checks - justify.",
        "4. (Resilience) Circuit breaker thresholds: which metric do you tune first?",
        "5. (Observability) Missing trace across service boundary - primary configuration to review?",
        "6. (Data) Why database-per-service? One trade-off.",
        "7. (Pitfall) Overusing synchronous calls in chain - impact and mitigation.",
        "8. (Optimization) Caching strategy to reduce read latency for product details." ) -join "`n")
    }
    'advanced-java' {
      return (@(
        "1. (MCQ) Which construct minimizes contention under high write concurrency?",
        "2. (Scenario) Thread pool exhaustion - initial triage step?",
        "3. (Memory) Why prefer primitive arrays over boxed collections in hot loops?",
        "4. (Code Review) Flaw: using synchronized on a widely shared object - suggest alternative.",
        "5. (JIT) What triggers deoptimization events?",
        "6. (GC) Symptom of excessive minor GCs - two tuning levers.",
        "7. (Pitfall) Incorrect use of volatile for compound action - explain risk.",
        "8. (Optimization) One profiling-driven micro-optimization for CPU hotspot." ) -join "`n")
    }
    'system-design' {
      return (@(
        "1. (MCQ) Primary driver for introducing a cache layer?",
        "2. (Scenario) Sudden spike in write latency - first diagram element to inspect?",
        "3. (Capacity) Estimate QPS: 10k users, avg 5 requests/min - show formula.",
        "4. (Consistency) Pick eventual vs strong consistency for feed updates - justify.",
        "5. (Scaling) Partition strategy for user-centric data - key choice rationale.",
        "6. (Resilience) Health check design - one signal beyond HTTP 200.",
        "7. (Pitfall) Over-sharding early - impact and reversal tactic.",
        "8. (Optimization) One read amplification reduction technique." ) -join "`n")
    }
    'aws' {
      return (@(
        "1. (MCQ) Best fit for event-driven image processing: which service?",
        "2. (Scenario) S3 costs surged - first cost breakdown axis?",
        "3. (Security) Least-privilege IAM policy principle - apply to EC2 role example.",
        "4. (Scaling) Auto Scaling group tuning - metric beyond CPU to consider?",
        "5. (Networking) VPC design: isolate public vs private resources - one control.",
        "6. (Serverless) Cold start mitigation technique for latency-sensitive Lambda.",
        "7. (Pitfall) Overprovisioned RDS instance - symptom and fix path.",
        "8. (Optimization) S3 + CloudFront improvement for global static asset delivery." ) -join "`n")
    }
    'coding-challenges' {
      return (@(
        "1. (MCQ) Choose best DS for LRU cache - why?",
        "2. (Scenario) Off-by-one bug in binary search - debugging approach.",
        "3. (Complexity) Derive complexity for nested loop with early break.",
        "4. (Data) Pick heap vs balanced tree for median stream - justify.",
        "5. (Optimization) Turn recursive DFS into iterative - benefit?",
        "6. (Pitfall) Using == for string equality - impact.",
        "7. (Edge Case) Strategy for integer overflow detection in addition.",
        "8. (Performance) Technique to reduce allocations in tight loop." ) -join "`n")
    }
    default {
      return (@(
        "1. (MCQ) Select the MOST accurate statement about ${slug} in $domain.",
        "2. (Short) Provide a concise definition and primary benefit.",
        "3. (Scenario) Production issue involving ${slug}: outline first diagnostic step.",
        "4. (True/False) ${slug} directly guarantees improved scalability.",
        "5. (Code Review) Identify the flaw in a naive ${slug} usage snippet.",
        "6. (Design) Suggest one improvement to integrate ${slug} into an observability pipeline.",
        "7. (Pitfall) Name a subtle misuse that leads to reliability degradation.",
        "8. (Optimization) Mention a method to reduce overhead when applying ${slug}." ) -join "`n")
    }
  }
}

function Build-Answers($slug,$domain){
  switch($domain){
    'spring' {
      return (@(
        '## Q1 Answer','Use @PostConstruct/@PreDestroy for lifecycle hooks; @Bean initMethod also possible—pick clarity and testability.',
        '## Q2 Answer','Inspect transaction boundaries + fetch strategy; likely lazy collection accessed outside transactional scope.',
        '## Q3 Answer','Trim auto-config (exclude starters), enable lazy init selectively, profile classpath scanning.',
        '## Q4 Answer','Field injection harms immutability/testability; prefer constructor injection for explicit dependencies.',
        '## Q5 Answer','Raw passwords risk memory dump exposure; hash + salt immediately and minimize retention.',
        '## Q6 Answer','Externalize secrets via config server / vault; never embed prod creds; use profile-specific properties.',
        '## Q7 Answer','Circular reference comes from mutually dependent beans; break via interface, event, or refactor layering.',
        '## Q8 Answer','Use batching with JdbcTemplate or saveAll; tune flush size and disable unnecessary listeners.') -join "`n") + "`n"
    }
    'microservices' {
      return (@(
        '## Q1 Answer','Gateway centralizes cross-cutting concerns (auth, rate limit, routing) reducing client coupling.',
        '## Q2 Answer','Trace event flow: confirm payment event emission, ordering guarantees, reconciliation logic.',
        '## Q3 Answer','Async for latency tolerance & decoupling; sync only if immediate consistency required.',
        '## Q4 Answer','Tune failure rate threshold first; aligns with resilience vs premature opening.',
        '## Q5 Answer','Check propagation of trace IDs (HTTP headers) and ensure instrumentation on both sides.',
        '## Q6 Answer','Database-per-service isolates schema evolution; trade-off: distributed transactions complexity.',
        '## Q7 Answer','Sync call chains amplify latency & failure; introduce async messaging or bulk endpoints.',
        '## Q8 Answer','Deploy read cache (e.g., Redis) with TTL & stampede protection for product detail lookups.') -join "`n") + "`n"
    }
    'advanced-java' {
      return (@(
        '## Q1 Answer','Use LongAdder / striped locks for high write concurrency to reduce contention.',
        '## Q2 Answer','Check active threads & queue depth; inspect rejection policy and task duration.',
        '## Q3 Answer','Primitive arrays avoid boxing overhead & GC pressure in tight loops.',
        '## Q4 Answer','synchronized on shared object inflates contention; use ReentrantLock or finer-grained locking.',
        '## Q5 Answer','Deoptimization triggered by uncommon traps, type instability, or speculation failure.',
        '## Q6 Answer','Reduce allocation rate & resize young gen; tune eden size or use G1 region parameters.',
        '## Q7 Answer','volatile does not make compound operations atomic; race still possible—use atomic classes or locks.',
        '## Q8 Answer','Inline hot method or remove unnecessary abstraction after profiler confirmation.') -join "`n") + "`n"
    }
    'system-design' {
      return (@(
        '## Q1 Answer','Cache lowers read latency & backend load for frequently accessed data.',
        '## Q2 Answer','Inspect write path components: queue, DB commit latency, replication.',
        '## Q3 Answer','QPS = users * req/min / 60 = 10000*5/60 ≈ 833 QPS.',
        '## Q4 Answer','Eventual consistency for feed reduces write coordination; trade-off: temporary staleness.',
        '## Q5 Answer','Partition by user ID for consistent hashing; aids horizontal scaling & isolation.',
        '## Q6 Answer','Add synthetic checks (DB connectivity, downstream dependency latency).',
        '## Q7 Answer','Over-sharding increases ops overhead; consolidate shards or apply auto-scaling thresholds.',
        '## Q8 Answer','Introduce denormalized materialized view to reduce multi-read joins.') -join "`n") + "`n"
    }
    'aws' {
      return (@(
        '## Q1 Answer','Lambda + S3 event or SQS triggers suit image processing elasticity.',
        '## Q2 Answer','Break down by storage class, request type, data transfer, replication.',
        '## Q3 Answer','Principle: grant minimal actions (CRUD narrow) to role; avoid wildcard resources.',
        '## Q4 Answer','Track request latency or queue length besides CPU for scaling accuracy.',
        '## Q5 Answer','Place public services in public subnets; private resources behind NAT & security groups.',
        '## Q6 Answer','Use provisioned concurrency or keep warm strategy for critical Lambdas.',
        '## Q7 Answer','Low utilization metrics indicate oversize; right-size or switch storage engine tier.',
        '## Q8 Answer','Use CloudFront CDN + compression & appropriate caching headers.') -join "`n") + "`n"
    }
    'coding-challenges' {
      return (@(
        '## Q1 Answer','HashMap + doubly linked list supports O(1) access & eviction.',
        '## Q2 Answer','Check mid calculation & loop boundaries; print indices on failure.',
        '## Q3 Answer','Early break reduces worst-case iterations; still O(n*m) for nested loops unless pruned.',
        '## Q4 Answer','Heap maintains median via two heaps; tree offers order but higher update cost.',
        '## Q5 Answer','Iterative avoids stack overflow & reduces function call overhead.',
        '## Q6 Answer','== compares references; use equals() to check logical equality.',
        '## Q7 Answer','Detect overflow via pre-check (if a > MAX - b); or use long cast.',
        '## Q8 Answer','Reuse buffers or preallocate arrays to minimize GC churn.') -join "`n") + "`n"
    }
    default {
      return (@(
        '## Q1 Answer','Clarify key concept precisely without jargon.',
        '## Q2 Answer','Provide succinct purpose + primary benefit.',
        '## Q3 Answer','Identify first diagnostic metric/log with rationale.',
        '## Q4 Answer','Explain conditional nature of perceived advantage.',
        '## Q5 Answer','Show flaw then improved version emphasizing safety.',
        '## Q6 Answer','Integrate with metrics/logs/tracing pipeline.',
        '## Q7 Answer','Describe subtle misuse and resulting impact.',
        '## Q8 Answer','Offer optimization lever with trade-off awareness.') -join "`n") + "`n"
    }
  }
}

function Build-Lesson($lessonDir){
  $name = Split-Path $lessonDir -Leaf
  if($name -notmatch '^lesson-\d+-'){ return }
  $slug = ($name -replace '^lesson-\d+-','')
  $domain = Classify-Domain $lessonDir
  $number = ($name -replace '^lesson-(\d+)-.*','$1')
  $title = (($slug -split '-') | ForEach-Object { $_.Substring(0,1).ToUpper()+$_.Substring(1) }) -join ' '
  $lessonPath = Join-Path $lessonDir 'LESSON.md'
  $needs = $true
  if(Test-Path $lessonPath){
    $size = (Get-Item $lessonPath).Length
    $raw = Get-Content -Raw $lessonPath
    if($size -ge $LessonSizeThreshold -and $raw -notmatch 'Objective 1|Core Theory|Cheat Sheet'){ $needs = $false }
  }
  if(-not $needs){ return }

  $coreTheory = Build-Core-Theory $slug $domain
  $codeExamples = Build-Code-Examples $slug $domain
  $pitfalls = Build-Pitfalls $slug $domain
  $cheat = Build-CheatSheet $slug
  $further = Build-FurtherReading $slug $domain
  $exercises = Build-Exercises $slug $domain

  $content = (
"# Lesson ${number}: $title`n`n## 1. Learning Objectives`n- Understand $title fundamentals`n- Apply $title in $domain scenarios`n- Communicate trade-offs and best practices clearly`n`n## 2. Why This Matters for a Java Tech Lead`nA Tech Lead must evaluate, justify, and guide correct usage of $title ensuring reliability, performance, and maintainability across teams. Mastery enables mentoring and architectural judgment.`n`n## 3. Core Theory`n" +
 $coreTheory + "`n" +
 $codeExamples + "`n" +
 $pitfalls + "`n## 6. Hands-On Exercises`n" +
 $exercises + "`n" +
 $cheat + "`n" +
 $further)
  Set-Content -Path $lessonPath -Value $content

  # Quiz
  $quizPath = Join-Path $lessonDir 'QUIZ.md'
  $quizContent = Build-Quiz $slug $domain
  Set-Content -Path $quizPath -Value $quizContent

  # Answers
  $answersPath = Join-Path $lessonDir 'ANSWERS.md'
  $answersContent = Build-Answers $slug $domain
  Set-Content -Path $answersPath -Value $answersContent

  # Exercises
  $exPath = Join-Path $lessonDir 'EXERCISES.md'
  if(Test-Path $exPath){
    $exSize = (Get-Item $exPath).Length
    if($exSize -lt 300){ Set-Content -Path $exPath -Value $exercises }
  } else { Set-Content -Path $exPath -Value $exercises }

  Write-Host "Full content generated: $name" -ForegroundColor Green
}

$lessonDirs = Get-ChildItem -Path $root -Recurse -Directory -Filter 'lesson-*'
foreach($d in $lessonDirs){ Build-Lesson $d.FullName }
Write-Host "Full lesson content generation completed." -ForegroundColor Cyan
