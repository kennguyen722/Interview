# Lesson 05: Stack vs Heap
<!-- @copilot:lesson-build -->
## Objectives
- Differentiate stack frames vs heap objects
- Understand allocation, lifetime, and GC interaction
- Explain escape analysis & scalar replacement conceptually
- Identify memory-related interview talking points

## Theory
| Aspect | Stack | Heap |
|--------|-------|------|
| Purpose | Method execution frames (locals, params, return addr) | Object / array storage |
| Allocation | Implicit on method call | Via `new` (bytecode) |
| Lifetime | Until method returns | Until unreachable & collected |
| Thread Access | Thread-confined | Shared across threads |
| Size | Limited per thread (configurable) | Larger, managed by GC |
| Performance | Very fast (pointer move) | Slower (object header, GC) |

### Escape Analysis
JIT can allocate objects on stack or eliminate them if they don't escape method scope (conceptual optimization; not directly controllable).

### Object Layout
Header (mark word, klass pointer) + fields aligned; affects memory footprint.

## Examples
```java
void foo() { // new frame
  int x = 10; // stack local
  Person p = new Person(); // heap allocation
}
```

### High Allocation Rate Impact
Frequent short-lived heap objects increase GC frequency; consider pooling only when justified by profiling.

## Pitfalls
| Pitfall | Impact | Mitigation |
|---------|--------|-----------|
| Assuming manual stack allocation | Misconceptions | JVM decides; rely on JIT optimizations |
| Overusing object creation in tight loops | GC pressure | Reuse objects / use primitives |
| Ignoring thread stack size | StackOverflowError | Increase size or reduce recursion |
| Deep recursion without tail optimization | Stack overflow | Convert to iteration |

## Interview Framing
"Stack holds call frames and primitive locals; heap stores objects accessible beyond a single method. Allocation cost differs; the JIT may optimize short-lived objects through escape analysis reducing heap pressure. I monitor allocation rates via profiling before considering pooling."

## Exercises
See EXERCISES.md.

## Cheat Sheet
- Stack = frames, fast, thread-local
- Heap = objects, shared, GC-managed
- Escape analysis may elide allocations

## Further Reading
- JVM spec runtime data areas
- JIT compilation whitepapers
