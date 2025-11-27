# Lesson 03: String Immutability
<!-- @copilot:lesson-build -->
## Objectives
- Explain reasons for immutability (security, caching, thread-safety)
- Optimize string concatenation
- Use `StringBuilder` and `StringBuffer` appropriately
- Understand string pool behavior

## Theory
| Aspect | Benefit |
|--------|---------|
| Security | Prevents modification of sensitive data like classpath | 
| Caching | Enables string pool reuse | 
| Thread-Safety | Immutable objects are inherently safe to share | 
| Hashing | Stable hashCodes; efficient in maps | 

## String Pool
Literals interned at class load; `new String("a")` creates new object unless interned explicitly.

## Examples
```java
String a = "hello";
String b = "hello";
System.out.println(a == b); // true (same pool entry)
String c = new String("hello");
System.out.println(a == c); // false (different object)
System.out.println(a.equals(c)); // true
```

### Concatenation
Use `StringBuilder` in loops:
```java
StringBuilder sb = new StringBuilder();
for(int i=0;i<1000;i++) sb.append(i);
String result = sb.toString();
```

## Pitfalls
| Pitfall | Impact | Mitigation |
|---------|--------|-----------|
| Using + in large loops | Many temporary objects | Use `StringBuilder` |
| Relying on `==` for equality | Reference compare only | Use `.equals` |
| Unnecessary `new String(x)` | Extra allocation | Use literal or existing reference |
| Interning huge dynamic strings | Memory pressure | Avoid mass interning |

## Interview Framing
"String immutability underpins security, thread-safety and pooling performance; it allows sharing without defensive copies. For intensive concatenation, I switch to `StringBuilder` to avoid intermediate garbage."

## Exercises
See EXERCISES.md.

## Cheat Sheet
- Literals pooled
- Prefer `StringBuilder` for loops
- `.equals` for content comparison

## Further Reading
- JLS: Strings
- Effective Java: Immutability
