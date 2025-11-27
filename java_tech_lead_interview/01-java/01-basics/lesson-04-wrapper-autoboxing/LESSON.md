# Lesson 04: Wrapper Classes & Autoboxing
<!-- @copilot:lesson-build -->
## Objectives
- Explain why wrappers exist (collections, generics, nullability)
- Understand autoboxing/unboxing compilation steps
- Identify performance & memory implications
- Avoid common equality and null pitfalls

## Theory
Wrappers provide object representation of primitives enabling use in generic APIs (`List<Integer>`). Autoboxing = compiler inserts `Integer.valueOf(int)`; unboxing = inserts `intValue()`.

### Caching
`Boolean`, `Byte`, `Character` (\u0000 - \u007f), `Short` and `Integer` values in range -128..127 cached via `valueOf`.

| Primitive | Wrapper | Caching Range |
|-----------|---------|---------------|
| int | Integer | -128..127 |
| byte | Byte | All |
| short | Short | -128..127 |
| char | Character | \u0000..\u007f |
| boolean | Boolean | true/false |

## Examples
```java
Integer a = 127; Integer b = 127; System.out.println(a==b); // true cached
Integer x = 128; Integer y = 128; System.out.println(x==y); // false
int sum = 0; for(Integer i=0;i<1_000_000;i++) sum += i; // boxing per loop iteration
```

### Avoid Excess Boxing
```java
int sum2 = IntStream.range(0,1_000_000).sum();
```

### Null Unboxing Risk
```java
Integer n = null;
// int m = n; // NPE
int m = (n==null?0:n); // safe
```

## Pitfalls
| Pitfall | Impact | Mitigation |
|---------|--------|-----------|
| Using wrappers in hot loops | GC pressure | Use primitives / primitive streams |
| Comparing with '==' beyond cache | Logic bugs | Use `.equals` or compare primitives |
| Autounboxing null | NPE | Pre-null checks / Optional |
| Assuming cache for all values | Wrong identity checks | Never rely on identity |

## Interview Framing
"Wrappers enable generics and nullability; autoboxing removes verbosity but can introduce hidden allocations. I profile loops to avoid boxing overhead and always use `.equals` for value comparison."

## Exercises
See EXERCISES.md.

## Cheat Sheet
- Autobox: compile-time insertion of `valueOf`
- Cache range small integers
- Avoid boxing in tight loops

## Further Reading
- Effective Java: Item on autoboxing
- JLS: Boxing Conversion
