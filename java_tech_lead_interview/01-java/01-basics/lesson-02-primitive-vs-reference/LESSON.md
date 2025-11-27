# Lesson 02: Primitive vs Reference Types
<!-- @copilot:lesson-build -->
## Objectives
- Distinguish value vs object semantics
- Understand memory layout (stack/frame vs heap) conceptually
- Recognize autoboxing impacts
- Avoid common NPE & equality pitfalls

## Theory
| Aspect | Primitive | Reference |
|--------|-----------|-----------|
| Storage | Raw value | Pointer to object | 
| Default field value | 0 / false | null |
| Equality (==) | Value equality | Reference identity |
| Nullability | Cannot be null | Can be null |
| Autoboxing | Wrap to object | N/A |
| Performance | No allocation | Allocation + GC |

## Autoboxing Costs
Implicit conversions introduce temporary objects and potential cache misses.

## Examples
```java
int a = 5; int b = 5; System.out.println(a == b); // true
Integer x = 128; Integer y = 128; System.out.println(x == y); // false (outside cache range)
Integer p = 127; Integer q = 127; System.out.println(p == q); // true (cache -128..127)
System.out.println(x.equals(y)); // true
```

## Pitfalls
| Pitfall | Impact | Mitigation |
|---------|--------|-----------|
| Using == on wrappers | Logic bugs | Use .equals for value |
| Unboxing null | NPE | Validate before unboxing |
| Excess boxing in loops | Performance hit | Use primitives or primitive streams |
| Relying on wrapper caching | Non-portable reasoning | Always use .equals |

## Interview Framing
"Primitives are stored as raw values enabling efficient computation; references add indirection and require heap allocation. Autoboxing simplifies syntax but can hide performance issues and NPE risks."

## Exercises
See EXERCISES.md.

## Cheat Sheet
- Primitives: fast, no null
- Wrappers: objects, nullable, caching for small integers

## Further Reading
- Effective Java: Autoboxing
- JLS: Primitive Types
