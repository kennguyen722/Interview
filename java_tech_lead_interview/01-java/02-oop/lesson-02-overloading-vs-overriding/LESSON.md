# Lesson 02: Method Overloading vs Method Overriding
<!-- @copilot:lesson-build -->
## Objectives
- Distinguish compile-time vs runtime polymorphism
- Know resolution rules for overloading & overriding
- Avoid pitfalls with autoboxing, varargs, and covariant returns
- Explain dynamic dispatch clearly in interviews

## Comparison Table
| Aspect | Overloading | Overriding |
|--------|-------------|------------|
| Purpose | API convenience / different params | Specialize behavior in subclass |
| When | Same method name, different parameter list | Same signature (name + params) in child class |
| Resolution | Compile time (method selection) | Runtime (dynamic dispatch) |
| Return Type | Can vary independently | Must be same or covariant |
| Access Modifiers | Independent | Cannot be more restrictive |
| Exceptions | Independent | Cannot throw broader checked exceptions |

## Overloading Nuances
- Ambiguity with autoboxing vs varargs: compiler chooses most specific
- Primitive vs wrapper selection precedence (widening > boxing > varargs)

## Overriding Rules
- Annotate with `@Override` to catch signature mismatches
- Covariant return allowed (e.g., overriding returns subtype)
- Final methods cannot be overridden; static methods are hidden not overridden

## Dynamic Dispatch Flow
1. Compile uses reference type for method existence
2. Runtime uses actual object type's vtable for target implementation

## Examples (Calculator Hierarchy)
See code examples in `code/` directory mirroring multiple overloads and overrides for clarity.

### Overloading Selection
```java
void print(int x); 
void print(Integer x); 
void print(long x); 
print(5); // chooses primitive widening to long or exact int method depending presence
```

### Overriding with Covariant Return
```java
class Animal { Animal reproduce() { return new Animal(); } }
class Cat extends Animal { @Override Cat reproduce(){ return new Cat(); } }
```

## Pitfalls
| Pitfall | Impact | Mitigation |
|---------|--------|-----------|
| Assuming overriding for static methods | Hidden behavior confusion | Clarify: static = hiding |
| Overload ambiguity (null argument) | Compile error | Cast explicitly |
| Ignoring autoboxing cost in overload chosen | Performance hit | Use primitives where possible |
| Not using @Override | Silent signature mismatch | Always annotate |

## Interview Framing
"Overloading is compile-time polymorphism improving API ergonomics; overriding is runtime polymorphism enabling behavioral specialization. The JVM uses dynamic dispatch based on the actual object, not the reference. I guard against overload ambiguity and highlight covariant returns & access modifier constraints."

## Exercises
See `EXERCISES.md` (ambiguity resolution, covariant return demo, static hiding vs overriding).

## Cheat Sheet
- Overload: same name, different params
- Override: same signature, subclass implementation
- Resolution order: compile-time vs runtime
- Widening > boxing > varargs (overload choice)

## Further Reading
- JLS: Overloading & Overriding sections
- Effective Java: Methods & polymorphism
