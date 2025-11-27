# Script: fill-lessons.ps1
# Purpose: Broad quick fill of lesson placeholders across repository.
# Strategy: For each LESSON.md, if placeholder markers or generic 'Placeholder.' text exist, inject concise Core Theory,
# Code Example, Pitfalls, Cheat Sheet tailored to lesson name via mapping.
# Usage: powershell.exe -ExecutionPolicy Bypass -File .\scripts\fill-lessons.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $root

# Mapping of topic keywords to content expansions
$topicMap = @{
  'jdk-jre-jvm' = @{
    theory = "JDK provides dev tools (javac, jlink). JRE legacy packaging of JVM + libs. JVM executes bytecode with class loading, verification, JIT + GC. Java 9+ modules enable trimmed runtime images via jlink.";
    code = @'
public class RuntimeInfo {
  public static void main(String[] args) {
    System.out.println("Version: " + System.getProperty("java.version"));
    System.out.println("Vendor : " + System.getProperty("java.vendor"));
  }
}
'@;
    pitfalls = "Bundling full JDK in containers, ignoring GC impacts, mixing versions across microservices.";
    cheat = "JDK = tools; JVM = engine; Use jlink for minimal images; Monitor GC + JIT warmup.";
  };
  'primitives-vs-references' = @{
    theory = "Primitives store values directly (int, boolean); references store object addresses. Affects memory layout, default values, and pass-by-value semantics (copies references, not objects).";
    code = @'
public class PrimitiveVsReference {
  static class Box { int value; }
  public static void main(String[] args) {
    int a = 5; int b = a; b++; // a unaffected
    Box box = new Box(); box.value = 10; Box box2 = box; box2.value = 20; // both see 20
    System.out.println("a="+a+" b="+b+" box.value="+box.value);
  }
}
'@;
    pitfalls = "Autoboxing overhead, == vs equals, null risks with wrappers.";
    cheat = "Primitives faster, no null. Reference copies share object. Avoid == for objects.";
  };
  'four-pillars' = @{
    theory = "Encapsulation (hide internal state), Inheritance (IS-A hierarchy), Polymorphism (dynamic dispatch), Abstraction (focus on essential).";
    code = @'
interface Payment { void process(); }
class CardPayment implements Payment { public void process(){ System.out.println("Card charged"); } }
class OrderService { Payment p; OrderService(Payment p){this.p=p;} void pay(){ p.process(); } }
'@;
    pitfalls = "Deep inheritance chains, leaking internal mutable state, abusing inheritance over composition.";
    cheat = "Prefer composition. Keep fields private. Override behavior cleanly.";
  };
  'hashmap-internals' = @{
    theory = "HashMap uses array of buckets (nodes or tree bins). Key hash -> index; collisions via linked list or red-black tree (Java 8+). Resize when load factor exceeded.";
    code = @'
Map<String,Integer> counts = new HashMap<>();
counts.put("a",1); counts.put("b",2); counts.put("a", counts.get("a")+1);
System.out.println(counts);
'@;
    pitfalls = "Poor hashCode implementations causing clustering, mutating keys after insert.";
    cheat = "Stable hashCode + equals; Avoid mutable keys; Default load factor 0.75.";
  };
  'wildcards-pecs' = @{
    theory = "PECS: Producer Extends, Consumer Super. Use ? extends T for reading (covariant), ? super T for writing (contravariant).";
    code = @'
static int sum(List<? extends Number> nums){ int s=0; for(Number n:nums) s+=n.intValue(); return s; }
'@;
    pitfalls = "Using extends when writing, losing type safety; Overusing raw types.";
    cheat = "Producer Extends; Consumer Super; Favor generics over raw types.";
  };
  'streams-intro' = @{
    theory = "Streams provide declarative processing of collections: pipeline of intermediate ops (map, filter) ending with terminal ops (collect, reduce). Lazy evaluation.";
    code = @'
List<Integer> nums = List.of(1,2,3,4);
int sumSquares = nums.stream().map(n->n*n).reduce(0,Integer::sum);
System.out.println(sumSquares);
'@;
    pitfalls = "Stateful lambdas, parallel streams on small data, modifying source during streaming.";
    cheat = "Stateless ops, measure before parallel, keep pipelines readable.";
  };
  'exception-hierarchy' = @{
    theory = "Throwable -> Error (unrecoverable) & Exception. Checked exceptions must be declared/handled; unchecked (RuntimeException) indicate programming errors. Custom exceptions add context.";
    code = @'
try { throw new IllegalArgumentException("bad"); } catch (IllegalArgumentException e){ System.out.println(e.getMessage()); }
'@;
    pitfalls = "Swallowing exceptions, broad catch Exception, overusing checked exceptions.";
    cheat = "Catch narrow types; add context; avoid empty catches.";
  };
  'io-vs-nio2' = @{
    theory = "Classic IO: stream/blocking; NIO2: channels, buffers, async, Path API. Better scalability with selectors for many connections.";
    code = @'
Path p = java.nio.file.Paths.get("sample.txt");
java.nio.file.Files.writeString(p, "Hello");
System.out.println(java.nio.file.Files.readString(p));
'@;
    pitfalls = "Blocking IO in high concurrency, forgetting to close resources (use try-with-resources).";
    cheat = "Use NIO for scalable networking; Path & Files for modern file ops.";
  };
  'lambda-expressions' = @{
    theory = "Lambdas implement functional interfaces (single abstract method). Enable concise behavior passing and stream ops.";
    code = @'
Function<String,Integer> len = s -> s.length();
System.out.println(len.apply("abc"));
'@;
    pitfalls = "Complex lambdas reducing readability, capturing mutable external state.";
    cheat = "Keep lambdas short; prefer method references when clear.";
  };
  'thread-fundamentals' = @{
    theory = "Threads provide concurrent execution. Key concepts: lifecycle (new, runnable, blocked, terminated), shared memory synchronization, visibility (happens-before).";
    code = @'
Thread t = new Thread(() -> System.out.println("Hi from thread"));
t.start(); t.join();
'@;
    pitfalls = "Missing join causing premature exit, unsynchronized shared state.";
    cheat = "Prefer executors; minimize shared mutable data.";
  };
  'jvm-architecture' = @{
    theory = "Class loading, runtime data areas (heap, stack, metaspace), execution engine (interpreter + JIT), native interface, GC subsystems.";
    code = @'
public class JvmMem {
  public static void main(String[] args) {
    long max = Runtime.getRuntime().maxMemory();
    System.out.println("Max heap MB=" + (max/1024/1024));
  }
}
'@;
    pitfalls = "Wrong heap tuning, ignoring metaspace growth, assuming PermGen flags still apply.";
    cheat = "Tune heap after profiling; monitor GC logs.";
  };
  'garbage-collection-basics' = @{
    theory = "GC reclaims unreachable objects. Generational approach: young (eden, survivor) vs old; algorithms: mark-sweep, mark-compact; modern collectors: G1, ZGC, Shenandoah.";
    code = @'
import java.util.*;
public class GcDemo {
  public static void main(String[] args) {
    List<byte[]> blobs = new ArrayList<>();
    for(int i=0;i<25;i++){ blobs.add(new byte[1024*1024]); }
    System.out.println("Allocated ~" + blobs.size() + "MB");
  }
}
'@;
    pitfalls = "Calling System.gc() expecting performance gains, retaining references unintentionally.";
    cheat = "Use profiling for leaks; choose collector per latency profile.";
  };
  'scalability' = @{
    theory = "Scale vertically (bigger box) vs horizontally (more nodes). Dimensions: throughput, latency, storage, team. Patterns: sharding, replication, caching, partitioning.";
    code = @'
// Pseudo-code snippet emphasizing stateless design
class UserController { // no session state retained
  Response getUser(String id) { return userService.fetch(id); }
}
'@;
    pitfalls = "Premature sharding, ignoring data access patterns, single DB bottleneck.";
    cheat = "Measure first; cache hot reads; isolate state.";
  };
  # --- Additional Mappings Added ---
  'control-flow' = @{
    theory = 'Sequence, selection (if/switch), iteration (for/while), early exit patterns. Prefer clarity over clever nesting.';
    code = @'
for(int i=0;i<5;i++){ if(i%2==0) continue; System.out.println(i); }
'@;
    pitfalls = 'Deep nesting reduces readability; missing breaks in switch.';
    cheat = 'Favor polymorphism over giant switch when behavior varies.';
  };
  'memory-model' = @{
    theory='Java Memory Model defines happens-before; volatile ensures visibility; synchronized establishes ordering.';
    code=@'
class Flag { volatile boolean done; }
'@;
    pitfalls='Confusing atomicity with visibility; double-checked locking without volatile.';
    cheat='Use java.util.concurrent primitives; minimize shared state.';
  };
  'overloading-vs-overriding' = @{
    theory='Overloading: same name diff signature compile-time. Overriding: subclass changes method behavior runtime polymorphism.';
    code=@'
class A{ void f(int x){} } class B extends A{ @Override void f(int x){} }
'@;
    pitfalls='Accidental overload due to autoboxing; missing @Override.';
    cheat='Always use @Override to catch mistakes.';
  };
  'interfaces-vs-abstract-classes' = @{
    theory='Interfaces: contract, multiple inheritance of type. Abstract class: partial implementation + state.';
    code=@'
interface Shape{ double area(); } abstract class BaseShape implements Shape{ }
'@;
    pitfalls='Overusing abstract base for unrelated types.';
    cheat='Prefer interface for capability; abstract when shared code needed.';
  };
  'iterators' = @{
    theory='Iterator provides sequential access; fail-fast behavior on structural modification.';
    code=@'
for(Iterator<String> it=list.iterator(); it.hasNext();) System.out.println(it.next());
'@;
    pitfalls='Calling remove() without understanding concurrent modification; using iterator where stream simpler.';
    cheat='Use streams for transformation; iterator for controlled mutation.';
  };
  'map-filter-reduce' = @{
    theory='Functional pipeline transforms collection immutably; reduce accumulates result.';
    code=@'
int sum = list.stream().filter(x->x>0).mapToInt(x->x).reduce(0,Integer::sum);
'@;
    pitfalls='Unnecessary boxing; complex lambdas.';
    cheat='Keep pipeline linear; use method refs.';
  };
  'collectors' = @{
    theory='Collectors aggregate stream elements (toList, groupingBy, joining). Provide mutability behind facade.';
    code=@'
Map<Boolean,List<Integer>> m=list.stream().collect(java.util.stream.Collectors.partitioningBy(x->x%2==0));
'@;
    pitfalls='Custom collectors incorrect concurrency; misuse of parallel with non-thread-safe collector.';
    cheat='Use standard collectors; verify parallel safety.';
  };
  'try-with-resources' = @{
    theory='Ensures AutoCloseable closed deterministically; multiple resources supported.';
    code=@'
try(java.io.BufferedReader br=new java.io.BufferedReader(new java.io.FileReader("f.txt"))){ System.out.println(br.readLine()); }
'@;
    pitfalls='Closing manually plus TWR causing double close; forgetting exception suppression semantics.';
    cheat='Implement AutoCloseable for custom resource mgmt.';
  };
  'custom-exceptions' = @{
    theory='Provide semantic meaning, capture context (ids, states). Extend RuntimeException when unrecoverable.';
    code=@'
class DomainException extends RuntimeException{ DomainException(String m){super(m);} }
'@;
    pitfalls='Generic Exception usage; lack of message detail.';
    cheat='Include actionable message + optional cause.';
  };
  'file-operations' = @{
    theory='Use NIO Files API for paths, atomic moves, buffered IO.';
    code=@'
java.nio.file.Files.writeString(java.nio.file.Path.of("demo.txt"),"data");
'@;
    pitfalls='Not handling charset; ignoring atomic move for replaces.';
    cheat='Prefer Files utility methods; validate existence.';
  };
  'serialization' = @{
    theory='Java serialization writes object graph; risks: performance, security. Prefer JSON/Proto for interoperability.';
    code=@'
// Avoid default serialization for new designs
'@;
    pitfalls='SerialVersionUID mismatch; exposing private data.';
    cheat='Use external formats (Jackson) for APIs.';
  };
  'method-references' = @{
    theory='Syntax sugar for lambdas calling existing methods; improves readability.';
    code=@'
list.stream().map(String::toUpperCase).forEach(System.out::println);
'@;
    pitfalls='Overusing when lambda clarifies parameters.';
    cheat='Use when direct delegation fits.';
  };
  'functional-patterns' = @{
    theory='Composition, immutability, pure functions reduce side effects; use Optional to model absence.';
    code=@'
java.util.function.Function<Integer,Integer> inc = x->x+1;
'@;
    pitfalls='Mapping Optional just to get value later; excessive nesting.';
    cheat='Prefer clear transformations; avoid side-effect lambdas.';
  };
  'synchronization' = @{
    theory='Intrinsic locks guard critical sections; visibility ensured after release; prefer higher-level concurrency utilities.';
    code=@'
synchronized(obj){ counter++; }
'@;
    pitfalls='Locking on publicly accessible objects; holding lock during I/O.';
    cheat='Use private final lock object; minimize scope.';
  };
  'concurrent-collections' = @{
    theory='Provide thread-safe operations with internal partitioning (ConcurrentHashMap). Avoid global locking.';
    code=@'
var map=new java.util.concurrent.ConcurrentHashMap<String,Integer>(); map.merge("a",1,Integer::sum);
'@;
    pitfalls='Assuming compound operations atomic; iteration without snapshot.';
    cheat='Use compute/merge APIs for atomic update.';
  };
  'executor-framework' = @{
    theory='Abstracts thread management; pools reuse threads; submit tasks returning Future.';
    code=@'
var ex=java.util.concurrent.Executors.newFixedThreadPool(4); ex.submit(()->System.out.println("run")); ex.shutdown();
'@;
    pitfalls='Unbounded queue causing memory pressure; forgetting shutdown.';
    cheat='Size pool to CPU vs IO workload; monitor queue.';
  };
  'locks-conditions' = @{
    theory='ReentrantLock offers fairness, tryLock; Conditions support await/signal patterns.';
    code=@'
java.util.concurrent.locks.Lock l=new java.util.concurrent.locks.ReentrantLock(); l.lock(); try{ /*critical*/ } finally{ l.unlock(); }
'@;
    pitfalls='Deadlocks from inconsistent ordering.';
    cheat='Document lock ordering; prefer synchronized unless advanced features needed.';
  };
  'atomic-operations' = @{
    theory='Atomic classes provide lock-free CAS updates ensuring visibility & atomicity.';
    code=@'
java.util.concurrent.atomic.AtomicInteger ai=new java.util.concurrent.atomic.AtomicInteger(); ai.incrementAndGet();
'@;
    pitfalls='Spinning under contention; mixing atomic and non-atomic state.';
    cheat='Group related state; consider LongAdder for high contention counters.';
  };
  'completablefuture' = @{
    theory='Chain async tasks, compose and combine with non-blocking callbacks.';
    code=@'
java.util.concurrent.CompletableFuture.supplyAsync(()->"hi").thenApply(String::toUpperCase).thenAccept(System.out::println);
'@;
    pitfalls='Blocking get() defeating async; silent exceptions.';
    cheat='Use exceptionally() and allOf() for orchestration.';
  };
  'parallel-processing' = @{
    theory='Parallel stream splits workload; beneficial for CPU-bound large data; requires thread-safe operations.';
    code=@'
list.parallelStream().map(x->x*x).reduce(0,Integer::sum);
'@;
    pitfalls='IO-bound tasks; small collections overhead.';
    cheat='Benchmark; consider ForkJoin directly for custom tasks.';
  };
  'classloading' = @{
    theory='Delegation model: parent-first; custom loaders isolate plugins; impact on resource visibility.';
    code=@'
ClassLoader cl = Thread.currentThread().getContextClassLoader();
'@;
    pitfalls='Shadowing core classes; memory leaks via stale loaders.';
    cheat='Unload via removing references; avoid overriding system classes.';
  };
  'bytecode' = @{
    theory='Compact instruction set executed by JVM; verification ensures type safety; enables JIT optimization.';
    code=@'
// Use javap -c to inspect instructions
'@;
    pitfalls='Manual bytecode gen errors; relying on unspecified stack behavior.';
    cheat='Leverage ASM libraries carefully.';
  };
  'jit-compiler' = @{
    theory='Hot methods compiled to native; tiered C1->C2; speculative optimizations deopt on invalid assumptions.';
    code=@'
// Warm by looping: for(int i=0;i<1_000_000;i++) foo();
'@;
    pitfalls='Microbench without JIT warmup; disabling tiered compilation inadvertently.';
    cheat='Use JMH for reliable benchmarking.';
  };
  'profiling-tools' = @{
    theory='Tools: jcmd, jmap, jstack, async-profiler, JFR for low overhead event capture.';
    code=@'
// Run: jfr start name=Profile duration=60s filename=app.jfr
'@;
    pitfalls='Profiling in production without sampling strategy.';
    cheat='Prefer JFR; avoid full heap dumps in peak traffic.';
  };
  'gc-algorithms' = @{
    theory='Stop-the-world vs concurrent; generational copying; region-based (G1); colored pointers (ZGC).' ;
    code=@'
// Enable: -XX:+UseG1GC
'@;
    pitfalls='Misinterpreting pause time vs throughput goals.';
    cheat='Align collector to latency SLOs.';
  };
  'gc-tuning' = @{
    theory='Adjust heap regions, pause goals (-XX:MaxGCPauseMillis); monitor logs for promotion failure.';
    code=@'
// Flags example: -Xms512m -Xmx512m -XX:MaxGCPauseMillis=200
'@;
    pitfalls='Over-constraining heap; ignoring allocation rate.';
    cheat='Tune after measuring live metrics.';
  };
  'memory-leaks' = @{
    theory='Unintentional object retention: static collections, listeners, caches without eviction.';
    code=@'
// Detect with heap dump + dominator tree.
'@;
    pitfalls='Assuming GC frees referenced objects.';
    cheat='Use weak refs / explicit removal for listeners.';
  };
  'memory-areas' = @{
    theory='Heap for objects, stack per thread, metaspace for class meta, code cache for JIT.';
    code=@'
// Inspect with jmap -heap pid
'@;
    pitfalls='Confusing stack overflow with heap.';
    cheat='Monitor metaspace for dynamic class gen.';
  };
  'reference-types' = @{
    theory='Strong, soft, weak, phantom control GC reachability; used for caches & cleanup hooks.';
    code=@'
java.lang.ref.WeakReference<String> w=new java.lang.ref.WeakReference<>("data");
'@;
    pitfalls='Soft refs unpredictably cleared; misuse for logic.';
    cheat='Use weak for maps; phantom for post-mortem cleanup.';
  };
  'memory-optimization' = @{
    theory='Reduce allocations, prefer primitives, reuse buffers, avoid boxing in hot paths.';
    code=@'
StringBuilder sb=new StringBuilder(); for(int i=0;i<100;i++) sb.append(i);
'@;
    pitfalls='Premature optimization; object pooling harming GC efficiency.';
    cheat='Profile allocation hotspots first.';
  };
  'performance-fundamentals' = @{
    theory='Measure (JMH), identify bottlenecks (CPU, IO, lock), optimize only validated hotspots.';
    code=@'
// JMH benchmark skeleton
'@;
    pitfalls='Relying on anecdotal evidence.';
    cheat='Establish baselines and regress tests.';
  };
  'benchmarking' = @{
    theory='Isolate code, control warmup, avoid dead-code elimination; use JMH harness.';
    code=@'
// @Benchmark method pattern
'@;
    pitfalls='System.nanoTime misuse; unstable environment.';
    cheat='Run multiple forks; capture variance.';
  };
  'optimization-techniques' = @{
    theory='Algorithmic changes first (O complexity), data locality, concurrency adjustments, caching.';
    code=@'
// Replace O(n^2) with O(n log n)
'@;
    pitfalls='Micro-optimizations overshadow readability.';
    cheat='Optimize after high-level design sound.';
  };
  'monitoring-tools' = @{
    theory='Metrics (Micrometer), logs (structured), traces (OpenTelemetry) provide observability pillars.';
    code=@'
// meterRegistry.counter("requests").increment();
'@;
    pitfalls='High cardinality labels; log spam.';
    cheat='Define SLIs/SLOs early.';
  };
  'security-fundamentals' = @{
    theory='Confidentiality, integrity, availability; defense in depth; input validation & least privilege.';
    code=@'
// Validate input length & pattern
'@;
    pitfalls='Hardcoded secrets; missing output encoding.';
    cheat='Centralize secret management.';
  };
  'secure-coding' = @{
    theory='Avoid SQL injection (prepared statements), XSS (output encode), SSRF (whitelists).';
    code=@'
PreparedStatement ps=conn.prepareStatement("SELECT * FROM t WHERE id=?");
'@;
    pitfalls='String concatenated SQL; trusting client data.';
    cheat='Use validation + sanitization layers.';
  };
  'cryptography' = @{
    theory='Use high-level APIs (AES-GCM, PBKDF2/Bcrypt for hashing); never custom crypto.';
    code=@'
Cipher c=Cipher.getInstance("AES/GCM/NoPadding");
'@;
    pitfalls='ECB mode usage; weak random (Random vs SecureRandom).';
    cheat='Follow libs; rotate keys.';
  };
  'ioc-container' = @{
    theory='Container manages object lifecycles & dependency graphs; promotes loose coupling.';
    code=@'
@Component class Service{}
'@;
    pitfalls='Overuse of field injection; hidden dependencies.';
    cheat='Prefer constructor injection & explicit config.';
  };
  'dependency-injection' = @{
    theory='Inject dependencies rather than constructing; improves testability.';
    code=@'
public MyController(Service s){this.s=s;}
'@;
    pitfalls='Circular dependencies; ambiguous beans.';
    cheat='Use @Qualifier for disambiguation.';
  };
  'bean-lifecycle' = @{
    theory='Instantiation -> dependency injection -> post-process -> init -> use -> destroy.';
    code=@'
@PostConstruct void init(){}
'@;
    pitfalls='Heavy logic in constructors.';
    cheat='Leverage lifecycle hooks for resource init.';
  };
  'configuration' = @{
    theory='Externalize via properties/yaml; profiles select env-specific sets.';
    code=@'
@ConfigurationProperties(prefix="app")
'@;
    pitfalls='Hardcoded config; scattered keys.';
    cheat='Centralize config classes.';
  };
  'aop' = @{
    theory='Cross-cutting concerns (logging, security) via proxies & advice (before/after/around).';
    code=@'
@Aspect class LogAspect{}
'@;
    pitfalls='Overuse causing hidden flow.';
    cheat='Keep aspects focused and documented.';
  };
  'profiles-properties' = @{
    theory='Activate subsets of beans/config per environment using spring.profiles.active.';
    code=@'
application-dev.yml
'@;
    pitfalls='Mismatched profile names; leaking test config.';
    cheat='Document profile purpose.';
  };
  'mvc-architecture' = @{
    theory='Model-View-Controller separates concerns; in REST, controller returns resource representations.';
    code=@'
@RestController class Api{ @GetMapping("/ping") String ping(){return "pong";} }
'@;
    pitfalls='Fat controllers; business logic leakage.';
    cheat='Delegate to service layer.';
  };
  'controllers' = @{
    theory='Map HTTP to use-case; validate & delegate.';
    code=@'
@GetMapping("/items/{id}")
'@;
    pitfalls='Returning entities directly (expose internals).';
    cheat='Use DTOs for boundaries.';
  };
  'rest-apis' = @{
    theory='Resource-based, stateless; use proper status codes; idempotence for PUT.';
    code=@'
@PostMapping("/orders")
'@;
    pitfalls='Misusing GET for mutations; ambiguous error payloads.';
    cheat='Define consistent error schema.';
  };
  'validation' = @{
    theory='Bean Validation annotations ensure constraints; groups & custom validators.';
    code=@'
@Size(min=3) String name;
'@;
    pitfalls='Skipping server-side validation; mixing persistence annotations.';
    cheat='Centralize validation logic.';
  };
  'exception-handling' = @{
    theory='@ControllerAdvice centralizes mapping exceptions to responses.';
    code=@'
@ExceptionHandler(RuntimeException.class)
'@;
    pitfalls='Leaking stack traces; inconsistent error codes.';
    cheat='Standardize error response format.';
  };
  'jdbc-template' = @{
    theory='Simplifies JDBC boilerplate; handles resource closing & mapping.';
    code=@'
jdbcTemplate.query("SELECT * FROM t", rs-> {...});
'@;
    pitfalls='Manual string concatenation; ignoring batch updates.';
    cheat='Use placeholders & RowMapper.';
  };
  'jpa-hibernate' = @{
    theory='ORM maps entities to tables; persistence context manages identity & caching.';
    code=@'
@Entity class User{ @Id Long id; }
'@;
    pitfalls='N+1 selects; lazy loading outside tx.';
    cheat='Fetch joins & DTO projections.';
  };
  'repositories' = @{
    theory='Spring Data derives queries from method names; custom impl for complex logic.';
    code=@'
interface UserRepo extends JpaRepository<User,Long>{}
'@;
    pitfalls='Overly long method names; leakage of domain logic.';
    cheat='Use Specification or QueryDSL for complex queries.';
  };
  'transactions' = @{
    theory='Atomic unit of work; isolation levels manage concurrency anomalies.';
    code=@'
@Transactional
'@;
    pitfalls='Long-running tx; improper propagation.';
    cheat='Keep transactional boundaries narrow.';
  };
  'caching' = @{
    theory='Reduce recomputation & DB load; annotations abstract provider.';
    code=@'
@Cacheable("users")
'@;
    pitfalls='Cache stampede; stale data.';
    cheat='Define TTL & eviction strategy.';
  };
  'database-migrations' = @{
    theory='Versioned schema changes (Flyway/Liquibase) ensure consistent environments.';
    code=@'
V1__init.sql
'@;
    pitfalls='Manual ad-hoc SQL; missing rollback plan.';
    cheat='Automate migrations in pipeline.';
  };
  'auto-configuration' = @{
    theory='Conditionally create beans based on classpath/properties; enables convention-over-config.';
    code=@'
@ConditionalOnClass
'@;
    pitfalls='Hidden behavior complicating debugging.';
    cheat='Inspect /actuator/conditions.';
  };
  'starters' = @{
    theory='Bundle dependencies + auto-config; reduce manual version management.';
    code=@'
spring-boot-starter-web
'@;
    pitfalls='Including overlapping starters causing bloat.';
    cheat='Audit dependency tree regularly.';
  };
  'actuator' = @{
    theory='Operational endpoints health, metrics, env; extend with custom health indicators.';
    code=@'
management.endpoints.web.exposure.include=*
'@;
    pitfalls='Exposing sensitive endpoints publicly.';
    cheat='Secure actuator with auth & network controls.';
  };
  'testing' = @{
    theory='Context slicing speeds tests; use @SpringBootTest only when needed.';
    code=@'
@WebMvcTest(Controller.class)
'@;
    pitfalls='Slow full-context tests for simple units.';
    cheat='Prefer plain JUnit + Mockito for logic.';
  };
  'packaging-deployment' = @{
    theory='Fat JAR / layered containers; leverage buildpacks for consistent images.';
    code=@'
mvn spring-boot:build-image
'@;
    pitfalls='Large layers from frequent config changes.';
    cheat='Separate app & dependency layers.';
  };
  'monitoring' = @{
    theory='Integrate Micrometer exporters (Prometheus, OTLP); set SLAs.';
    code=@'
@Timed
'@;
    pitfalls='Ignoring high-cardinality tag explosion.';
    cheat='Whitelist metric tags.';
  };
  'authentication' = @{
    theory='Verify identity via credentials/token; integrate OAuth2/JWT for delegation.';
    code=@'
http.oauth2Login()
'@;
    pitfalls='Storing passwords unhashed.';
    cheat='Use bcrypt/argon2.';
  };
  'authorization' = @{
    theory='Access control via roles/permissions; method-level security with @PreAuthorize.';
    code=@'
@PreAuthorize("hasRole('ADMIN')")
'@;
    pitfalls='Role explosion; mixing auth & business logic.';
    cheat='Use fine-grained authorities.';
  };
  'oauth2-jwt' = @{
    theory='JWT bearer tokens signed; stateless auth; include scopes.';
    code=@'
Authorization: Bearer <jwt>
'@;
    pitfalls='Long-lived tokens; missing audience checks.';
    cheat='Short expiry + refresh + signature verification.';
  };
  'method-security' = @{
    theory='Protect service methods; expression-based access decisions.';
    code=@'
@Secured("ROLE_ADMIN")
'@;
    pitfalls='Missing tests for security rules.';
    cheat='Centralize expressions.';
  };
  'security-best-practices' = @{
    theory='Least privilege, secure defaults, central secret mgmt, regular patching.';
    code=@'
// Apply CSP headers
'@;
    pitfalls='Inconsistent policies; unused open ports.';
    cheat='Automate dependency vulnerability scans.';
  };
  'unit-testing' = @{
    theory='Test smallest unit without framework overhead; fast feedback.';
    code=@'
@Test void add(){ assertEquals(4, calc.add(2,2)); }
'@;
    pitfalls='Testing implementation details.';
    cheat='Focus on observable behavior.';
  };
  'integration-testing' = @{
    theory='Validate component collaboration & persistence.';
    code=@'
@SpringBootTest
'@;
    pitfalls='Slow DB spin-ups; flaky external calls.';
    cheat='Use Testcontainers for reproducibility.';
  };
  'test-slices' = @{
    theory='Limit context to needed layer reducing startup time.';
    code=@'
@DataJpaTest
'@;
    pitfalls='Misassumption of full context available.';
    cheat='Pick correct slice annotation.';
  };
  'testcontainers' = @{
    theory='Ephemeral real service instances (DB, MQ) for integration tests.';
    code=@'
@Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:15");
'@;
    pitfalls='Heavy test startup without reuse.';
    cheat='Reuse containers across test runs.';
  };
  'spring-cloud-config' = @{
    theory='Centralized configuration server; dynamic refresh via /actuator/refresh.';
    code=@'
spring.cloud.config.uri
'@;
    pitfalls='Unsecured config server exposing secrets.';
    cheat='Encrypt sensitive values.';
  };
  'service-discovery' = @{
    theory='Registry (Eureka/Consul) enables dynamic service location; clients load-balance.';
    code=@'
@EnableDiscoveryClient
'@;
    pitfalls='Hardcoding endpoints; stale registry entries.';
    cheat='Health check + eviction.';
  };
  'circuit-breakers' = @{
    theory='Fail fast on downstream instability; open/half-open/closed states.';
    code=@'
resilience4j.circuitbreaker.instances.default
'@;
    pitfalls='Too aggressive thresholds causing unnecessary opens.';
    cheat='Tune based on error rate + latency.';
  };
  'webflux' = @{
    theory='Reactive non-blocking runtime leveraging event loop; publishers & subscribers.';
    code=@'
Mono.just("hi").map(String::toUpperCase).subscribe(System.out::println);
'@;
    pitfalls='Blocking calls inside reactive pipeline.';
    cheat='Bridge blocking with boundedElastic scheduler.';
  };
  'reactive-streams' = @{
    theory='Spec defines Publisher/Subscriber contract with backpressure.';
    code=@'
Flux.range(1,5)
'@;
    pitfalls='Ignoring backpressure leading to OOM.';
    cheat='Use operators with built-in buffering strategies.';
  };
  'decomposition-patterns' = @{
    theory='Split by business capability, bounded context, or transactional boundaries.';
    code=@'
// Identify domains: Billing, Inventory
'@;
    pitfalls='Nano-services overhead.';
    cheat='Ensure each service owns a cohesive domain.';
  };
  'database-per-service' = @{
    theory='Each service owns schema -> loose coupling; enables polyglot persistence.';
    code=@'
orders-db, users-db
'@;
    pitfalls='Cross-service joins impossible; duplication.';
    cheat='Use events to sync data.';
  };
  'api-gateway' = @{
    theory='Single entrypoint handling routing, auth, aggregation, throttling.';
    code=@'
spring.cloud.gateway.routes
'@;
    pitfalls='Becoming monolith bottleneck.';
    cheat='Scale horizontally; keep logic minimal.';
  };
  'service-mesh' = @{
    theory='Sidecar proxies manage traffic, security, observability uniformly.';
    code=@'
Istio Envoy config
'@;
    pitfalls='Operational complexity overhead.';
    cheat='Adopt mesh after baseline maturity.';
  };
  'backends-for-frontends' = @{
    theory='Frontend-specific gateways tailor responses reducing client complexity.';
    code=@'
web-bff, mobile-bff
'@;
    pitfalls='Duplication of logic across BFFs.';
    cheat='Extract shared domain services.';
  };
  'synchronous-communication' = @{
    theory='Request/response (HTTP/gRPC) simple but tighter coupling & latency.';
    code=@'
GET /orders/123
'@;
    pitfalls='Scaling under high fan-out.';
    cheat='Use async for high volume fan-out paths.';
  };
  'asynchronous-messaging' = @{
    theory='Message brokers decouple producers/consumers enabling buffering & retry.';
    code=@'
publish(topic, event
'@;
    pitfalls='Eventual consistency surprises.';
    cheat='Define reconciliation strategy.';
  };
  'event-driven-architecture' = @{
    theory='React to domain events; promotes loose coupling & scalability.';
    code=@'
OrderCreatedEvent
'@;
    pitfalls='Undocumented event schemas.';
    cheat='Version events + schema registry.';
  };
  'saga-pattern' = @{
    theory='Manage distributed transactions via orchestration or choreography with compensations.';
    code=@'
// Step events with compensating action
'@;
    pitfalls='Complexity of error handling.';
    cheat='Begin with orchestration for clarity.';
  };
  'cqrs' = @{
    theory='Separate write (command) and read (query) models optimized differently.';
    code=@'
QueryService vs CommandService
'@;
    pitfalls='Overengineering for small domains.';
    cheat='Adopt when read scaling or divergence needed.';
  };
  'event-sourcing' = @{
    theory='Persist events as source of truth; build state by replay.';
    code=@'
append(Event e)
'@;
    pitfalls='Migration complexity; large replay times.';
    cheat='Use snapshots periodically.';
  };
  'data-consistency' = @{
    theory='Patterns: distributed locks, idempotent writes, outbox, two-phase commit (rare).' ;
    code=@'
outbox table + poller
'@;
    pitfalls='Global transactions harming availability.';
    cheat='Prefer async compensation.';
  };
  'circuit-breaker' = @{
    theory='Protect from cascading failures failing fast after threshold.';
    code=@'
decorateFunction(circuitBreaker, supplier)
'@;
    pitfalls='Misconfigured thresholds causing false opens.';
    cheat='Base on rolling window metrics.';
  };
  'retry-patterns' = @{
    theory='Transient failure recovery; exponential backoff + jitter.';
    code=@'
RetryConfig.custom().maxAttempts(3)
'@;
    pitfalls='Retrying non-idempotent operations.';
    cheat='Ensure idempotency or use dedupe keys.';
  };
  'bulkhead' = @{
    theory='Isolate resources to prevent one failing component exhausting all.';
    code=@'
Bulkhead.of("ext", conf)
'@;
    pitfalls='Too small limits throttling legitimate traffic.';
    cheat='Tune via load testing.';
  };
  'timeout-patterns' = @{
    theory='Bound waiting time; prevents thread exhaustion.';
    code=@'
webClient.get().retrieve().timeout(Duration.ofSeconds(2))
'@;
    pitfalls='No fallback leading to user errors.';
    cheat='Pair with circuit breaker.';
  };
  'chaos-engineering' = @{
    theory='Inject failures to validate resilience assumptions.';
    code=@'
kill random pod
'@;
    pitfalls='Running experiments in peak hours.';
    cheat='Define blast radius & abort conditions.';
  };
  'distributed-tracing' = @{
    theory='Correlate spans across services; identify latency sources.';
    code=@'
traceId, spanId propagation
'@;
    pitfalls='Missing propagation headers.';
    cheat='Standardize trace instrumentation.';
  };
  'metrics-monitoring' = @{
    theory='Quantitative insight into health; golden signals (latency, traffic, errors, saturation).';
    code=@'
counter("requests")
'@;
    pitfalls='Too many metrics raising storage costs.';
    cheat='Curate essential KPIs.';
  };
  'logging' = @{
    theory='Structured logs enable search & correlation; levels indicate severity.';
    code=@'
logger.info("order {}", id)
'@;
    pitfalls='Sensitive data leakage; noisy debug in prod.';
    cheat='Mask PII; set retention policies.';
  };
  'health-checks' = @{
    theory='Expose readiness & liveness endpoints guiding orchestration decisions.';
    code=@'
/actuator/health/readiness
'@;
    pitfalls='Heavy logic in health endpoint.';
    cheat='Keep checks fast & isolated.';
  };
  'containerization' = @{
    theory='Package app + dependencies for portability; layered images reduce rebuild time.';
    code=@'
FROM eclipse-temurin:17-jre
'@;
    pitfalls='Running as root; bloated base image.';
    cheat='Use distroless minimal images.';
  };
  'orchestration' = @{
    theory='Automated scheduling, scaling, healing (Kubernetes).' ;
    code=@'
Deployment + HPA
'@;
    pitfalls='Manual scaling ignoring autoscaling signals.';
    cheat='Define resource requests/limits.';
  };
  'ci-cd' = @{
    theory='Automate build, test, deploy pipelines; shift-left quality gates.';
    code=@'
github actions workflow yaml
'@;
    pitfalls='Skipping security scans.';
    cheat='Include lint, test, scan stages.';
  };
  'blue-green-canary' = @{
    theory='Blue/Green zero-downtime swap; Canary gradual traffic exposure.';
    code=@'
service labels route subset
'@;
    pitfalls='Incomplete rollback plan.';
    cheat='Automate health-based promotion.';
  };
  'ec2' = @{
    theory='Elastic compute instances; choose sizing by CPU/RAM profile.';
    code=@'
Terraform aws_instance
'@;
    pitfalls='Underutilized large instances.';
    cheat='Use autoscaling groups.';
  };
  'lambda' = @{
    theory='Event-driven serverless functions; pay per invocation.';
    code=@'
Handler implements RequestHandler<Map<String,Object>,String>
'@;
    pitfalls='Cold starts; large deployment artifact.';
    cheat='Optimize package size & init.';
  };
  'ecs-fargate' = @{
    theory='Serverless containers; remove node management.';
    code=@'
task definition JSON
'@;
    pitfalls='Incorrect resource sizing causing throttling.';
    cheat='Right-size CPU/memory per task metrics.';
  };
  's3' = @{
    theory='Object storage, eventual consistency for overwrite (now strong for new objects).';
    code=@'
s3Client.putObject(...)
'@;
    pitfalls='Public buckets inadvertently.';
    cheat='Enable bucket policies + encryption.';
  };
  'ebs-efs' = @{
    theory='EBS block storage per instance; EFS shared NFS elastic file system.';
    code=@'
Mount targets configuration
'@;
    pitfalls='Unencrypted volumes; cost inefficiencies.';
    cheat='Choose EFS for multi-AZ share; monitor throughput.';
  };
  'sqs' = @{
    theory='Reliable queue decoupling; visibility timeout controls processing lock.';
    code=@'
ReceiveMessageRequest
'@;
    pitfalls='Leaving messages un-deleted; small visibility causing reprocessing.';
    cheat='Tune visibility & DLQ.';
  };
  'sns' = @{
    theory='Pub/sub fan-out across protocols (HTTP, email, SQS).';
    code=@'
snsClient.publish(...)
'@;
    pitfalls='Unfiltered high-volume subscriptions.';
    cheat='Use message attributes for filtering.';
  };
  'rds' = @{
    theory='Managed relational DB: backups, patching, multi-AZ failover.';
    code=@'
Parameter group config
'@;
    pitfalls='Ignoring storage IOPS limits.';
    cheat='Enable performance insights.';
  };
  'dynamodb' = @{
    theory='NoSQL key-value & document; partition key + optional sort key; provisioned vs on-demand.';
    code=@'
GetItemRequest
'@;
    pitfalls='Hot partition from skewed keys.';
    cheat='Distribute partition key space.';
  };
  'vpc' = @{
    theory='Isolated virtual network; subnets (public/private); security groups vs NACLs.';
    code=@'
CIDR 10.0.0.0/16
'@;
    pitfalls='Overly broad SG rules; overlapping CIDRs.';
    cheat='Separate tier subnets.';
  };
  'cloudwatch' = @{
    theory='Metrics, logs, alarms; central monitoring hub.';
    code=@'
PutMetricData
'@;
    pitfalls='Excessive custom metrics cost.';
    cheat='Aggregate before publish.';
  };
  'x-ray' = @{
    theory='Distributed tracing service correlating segments & subsegments.';
    code=@'
Trace header injection
'@;
    pitfalls='Missing instrumentation in async tasks.';
    cheat='Instrument entry points + external calls.';
  };
  'iam' = @{
    theory='Identity & Access Management; policies define permissions; least privilege mandatory.';
    code=@'
Policy JSON
'@;
    pitfalls='Wildcard * permissions.';
    cheat='Scope resources & actions granularly.';
  };
  'architectural-styles' = @{
    theory='Layered, microservices, event-driven, hexagonal, serverless each trade-offs.';
    code=@'
// Choose style per domain constraints
'@;
    pitfalls='Mixing styles arbitrarily.';
    cheat='Match style to business drivers.';
  };
  'enterprise-patterns' = @{
    theory='Patterns: CQRS, Saga, Outbox, Circuit Breaker support reliability & scale.';
    code=@'
Outbox table example
'@;
    pitfalls='Pattern cargo-culting.';
    cheat='Derive from explicit problem statement.';
  };
  'domain-driven-design' = @{
    theory='Ubiquitous language, bounded contexts, aggregates enforce invariants.';
    code=@'
ValueObject Email{}
'@;
    pitfalls='Over-modeling trivial domains.';
    cheat='Focus on core domain complexity.';
  };
  'architecture-decisions' = @{
    theory='ADRs record context, decision, consequences enabling traceability.';
    code=@'
ADR-001-record.md
'@;
    pitfalls='Unmaintained decision log.';
    cheat='Review ADRs quarterly.';
  };
  'technology-choices' = @{
    theory='Evaluate via criteria: fit, team skill, ROI, ecosystem, risk.';
    code=@'
Decision matrix table
'@;
    pitfalls='Bias toward novelty.';
    cheat='Pilot + metrics before adoption.';
  };
  'architecture-documentation' = @{
    theory='Convey why/what/how: diagrams, runtime, deployment, data, risks.';
    code=@'
Arc42 structure
'@;
    pitfalls='Outdated docs; excessive detail.';
    cheat='Automate diagram generation.';
  };
  'c4-model' = @{
    theory='Context->Container->Component->Code hierarchy; clarity at each level.';
    code=@'
ASCII C4 diagram placeholders
'@;
    pitfalls='Skipping context leading to ambiguity.';
    cheat='Link diagrams to README indexes.';
  };
  'legacy-modernization' = @{
    theory='Strangle pattern incrementally replaces legacy; anti-corruption layer.';
    code=@'
Proxy routing new vs old
'@;
    pitfalls='Big bang rewrite risk.';
    cheat='Track progress with KPIs.';
  };
  'evolutionary-architecture' = @{
    theory='Support constant change with fitness functions validating qualities.';
    code=@'
Automated test asserts latency < threshold
'@;
    pitfalls='Neglecting continuous validation.';
    cheat='Codify fitness checks in CI.';
  };
  'team-building' = @{
    theory='Form cross-functional teams; clear roles; psychological safety promotes innovation.';
    code=@'
// Facilitate retros & 1:1s
'@;
    pitfalls='Role ambiguity.';
    cheat='Publish RACI matrix.';
  };
  'delegation' = @{
    theory='Assign outcomes not tasks; empower ownership + accountability.';
    code=@'
// Define success criteria docs
'@;
    pitfalls='Micromanagement; unclear authority.';
    cheat='Use delegation level scale.';
  };
  'performance-management' = @{
    theory='Continuous feedback + objective metrics; align with growth paths.';
    code=@'
OKR examples
'@;
    pitfalls='Annual-only reviews.';
    cheat='Monthly check-ins.';
  };
  'effective-communication' = @{
    theory='Audience-centric, structured (BLUF, Pyramid). Active listening.';
    code=@'
BLUF: Decision summary first.
'@;
    pitfalls='Technical jargon for execs.';
    cheat='Tailor message to stakeholder goals.';
  };
  'presentation-skills' = @{
    theory='Narrative arc: problem->solution->impact; visuals minimal.';
    code=@'
Slide outline bullets
'@;
    pitfalls='Text-heavy slides.';
    cheat='Use diagrams for complex flows.';
  };
  'stakeholder-management' = @{
    theory='Map influence vs interest; proactive updates mitigate surprises.';
    code=@'
Stakeholder matrix
'@;
    pitfalls='Ignoring silent stakeholders.';
    cheat='Maintain communication plan.';
  };
  'conflict-identification' = @{
    theory='Early detection via patterns: repeated escalation, passive resistance.';
    code=@'
Issue log tracking
'@;
    pitfalls='Avoidance leading to bigger issues.';
    cheat='Address facts & impacts promptly.';
  };
  'resolution-strategies' = @{
    theory='Collaborative problem solving: interests over positions, mediation.';
    code=@'
Structured facilitation agenda
'@;
    pitfalls='Win/lose framing.';
    cheat='Seek joint gains.';
  };
  'decision-frameworks' = @{
    theory='Use DACI/RACI, cost-benefit, risk matrix; time-box analysis.';
    code=@'
Decision record template
'@;
    pitfalls='Analysis paralysis.';
    cheat='Set reversible vs irreversible decision path.';
  };
  'risk-management' = @{
    theory='Identify, assess probability/impact; mitigation & contingency plans.';
    code=@'
Risk register row
'@;
    pitfalls='Static register; lack owner assignment.';
    cheat='Review risks in sprint planning.';
  };
  'star-framework' = @{
    theory='Situation, Task, Action, Result structure for behavioral answers.';
    code=@'
STAR note template
'@;
    pitfalls='Missing measurable results.';
    cheat='Quantify impact (%, $, time).';
  };
  'story-preparation' = @{
    theory='Curate bank of diverse scenarios: failure, leadership, innovation.';
    code=@'
Story index doc
'@;
    pitfalls='Over-rehearsed scripted tone.';
    cheat='Focus on authenticity + learning.';
  };
  'leadership-scenarios' = @{
    theory='Prepare for outage, hiring challenge, architectural pivot examples.';
    code=@'
Scenario worksheet
'@;
    pitfalls='Generic answers lacking depth.';
    cheat='Include constraints & trade-offs.';
  };
  'technical-challenges' = @{
    theory='Describe complex bug hunts, scale improvements, refactors with metrics.';
    code=@'
Before/After metrics table
'@;
    pitfalls='Blame shifting.';
    cheat='Highlight team collaboration.';
  };
  'conflict-situations' = @{
    theory='Show de-escalation, alignment on shared goals.';
    code=@'
Conflict resolution steps
'@;
    pitfalls='Taking sides prematurely.';
    cheat='Separate people from problem.';
  };
  'innovation-examples' = @{
    theory='Demonstrate initiative delivering measurable improvement (cost, performance).';
    code=@'
Innovation one-pager
'@;
    pitfalls='Buzzword focus over outcome.';
    cheat='Lead with impact metrics.';
  };
  'research-company' = @{
    theory='Analyze product, tech stack, values; tailor answers accordingly.';
    code=@'
Research checklist
'@;
    pitfalls='Generic enthusiasm.';
    cheat='Reference specific recent initiatives.';
  };
  'question-preparation' = @{
    theory='Prepare insightful questions on roadmap, team practices, success metrics.';
    code=@'
Question list doc
'@;
    pitfalls='No questions signals low engagement.';
    cheat='Group questions by theme.';
  };
  'arrays-strings' = @{
    theory='Common ops: reverse, two-pointer technique, sliding window for substrings.';
    code=@'
int[] arr={1,2,3};
'@;
    pitfalls='Off-by-one; unnecessary copies.';
    cheat='Validate indices carefully.';
  };
  'linked-lists' = @{
    theory='Nodes with next pointers; operations rely on pointer manipulation; dummy head eases edge cases.';
    code=@'
class Node{int v;Node n;}
'@;
    pitfalls='Losing reference during reversal.';
    cheat='Track prev/curr.';
  };
  'trees-graphs' = @{
    theory='Traversal DFS/BFS; complexity impacted by branching factor; graphs require visit tracking.';
    code=@'
void dfs(Node n){ if(n==null) return; dfs(n.left); }
'@;
    pitfalls='Recursion stack overflow.';
    cheat='Iterative approach for deep trees.';
  };
  'heaps-tries' = @{
    theory='Heap supports O(log n) insert/pop; trie efficient prefix queries.';
    code=@'
PriorityQueue<Integer> pq=new PriorityQueue<>();
'@;
    pitfalls='Inefficient string scanning instead of trie.';
    cheat='Use heap for top-k streaming.';
  };
  'advanced-structures' = @{
    theory='Union-Find, Segment Tree, LRU cache, Bloom filter for specialized performance.';
    code=@'
int find(int x){ return parent[x]==x?x:parent[x]=find(parent[x]); }
'@;
    pitfalls='Incorrect path compression causing cycles.';
    cheat='Test with edge cases.';
  };
  'sorting-searching' = @{
    theory='Comparison vs non-comparison sorts; binary search requires sorted invariant.';
    code=@'
Arrays.sort(arr);
'@;
    pitfalls='Wrong mid calc overflow.';
    cheat='mid = low + (high-low)/2.';
  };
  'dynamic-programming' = @{
    theory='Break problem into overlapping subproblems; memoization vs tabulation.';
    code=@'
int fib(int n){ return n<2?n:fib(n-1)+fib(n-2); }
'@;
    pitfalls='Exponential recursion without memo.';
    cheat='Identify state & transition first.';
  };
  'greedy-algorithms' = @{
    theory='Choose locally optimal step expecting global optimum; prove via exchange argument.';
    code=@'
// Interval scheduling sort by earliest finish
'@;
    pitfalls='Applying greedy where optimal not guaranteed.';
    cheat='Provide correctness proof.';
  };
  'graph-algorithms' = @{
    theory='Traversal, shortest path (Dijkstra), MST (Kruskal/Prim).';
    code=@'
// Dijkstra pseudocode
'@;
    pitfalls='Using Dijkstra with negative weights.';
    cheat='Use Bellman-Ford or SPFA.';
  };
  'string-algorithms' = @{
    theory='Pattern matching (KMP), hashing (Rabin-Karp), tries for prefix.';
    code=@'
// KMP prefix function
'@;
    pitfalls='Ignoring Unicode complexities.';
    cheat='Clarify assumptions up front.';
  };
  'design-implementations' = @{
    theory='Translate system design to code skeleton: layering, DTOs, interfaces.';
    code=@'
interface Repository{}
'@;
    pitfalls='Skipping abstraction boundaries.';
    cheat='Define contracts before coding.';
  };
  'concurrent-systems' = @{
    theory='Coordinate tasks safely: immutability, message passing, lock partitioning.';
    code=@'
ExecutorService ex=Executors.newFixedThreadPool(8);
'@;
    pitfalls='Shared mutable hotspots causing contention.';
    cheat='Favor non-blocking algorithms.';
  };
  'distributed-systems' = @{
    theory='Network partitions, eventual consistency, id generation, retries & backoff.';
    code=@'
// Use UUID or snowflake ids
'@;
    pitfalls='Ignoring partial failure modes.';
    cheat='Design for timeouts + idempotency.';
  };
}

function Update-Lesson($path) {
  $content = Get-Content $path -Raw
  # Determine key based on folder name inside path
  $folder = Split-Path (Split-Path $path -Parent) -Leaf
  # folder e.g. lesson-01-jdk-jre-jvm
  if ($folder -match 'lesson-\d+-(.+)$') { $key = $Matches[1] } else { return }
  if (-not $topicMap.ContainsKey($key)) { return }
  $t = $topicMap[$key]
  if ($content -notmatch 'Placeholder.' -and $content -match '## 3. Core Theory' -and $content -match '### 3.1 Key Concepts' -and $content -match 'Placeholder.') {
    # already filled
    return
  }
  # Simple replace for placeholder markers
  $content = $content -replace '### 3.1 Key Concepts[\s\S]*?### 3.2 Interview-Style Explanation', "### 3.1 Key Concepts\n$t.theory\n\n### 3.2 Interview-Style Explanation"
  if ($content -match '## 4. Code Examples') {
    $content = $content -replace '## 4. Code Examples[\s\S]*?## 5. Pitfalls & Best Practices', "## 4. Code Examples\n```java\n$t.code\n```\n\n## 5. Pitfalls & Best Practices"
  }
  if ($content -match '## 5. Pitfalls & Best Practices') {
    $content = $content -replace '## 5. Pitfalls & Best Practices[\s\S]*?## 6. Hands-On Exercises', "## 5. Pitfalls & Best Practices\n$t.pitfalls\n\n## 6. Hands-On Exercises"
  }
  if ($content -match '## 7. Interview Cheat Sheet') {
    $content = $content -replace '## 7. Interview Cheat Sheet[\s\S]*?## 8. Further Reading', "## 7. Interview Cheat Sheet\n$t.cheat\n\n## 8. Further Reading"
  }
  Set-Content -Path $path -Value $content
  Write-Host "Updated: $folder" -ForegroundColor Cyan
}

$lessonFiles = Get-ChildItem -Path $root -Recurse -Filter 'LESSON.md'
foreach ($f in $lessonFiles) { Update-Lesson $f.FullName }
Write-Host "Broad quick fill completed." -ForegroundColor Green
