# Singleton Pattern (Creational)

## Intent
Ensure exactly one instance of a class is created and provide a global access point.

## Motivation
Centralized configuration, caching, or registry objects often must exist only once. Direct use of global variables leads to tight coupling and test difficulty; Singleton centralizes creation and can enable lazy initialization.

## Structure (Simplified UML)
Class `Singleton`:
- private constructor
- static private instance reference
- static accessor `getInstance()` returning the sole instance

## Participants
- Singleton: Declares and manages the unique instance.
- Clients: Access via `Singleton.getInstance()`.

## Implementation Notes
- Prefer initialization-on-demand holder idiom in Java for thread safety without synchronization cost.
- Avoid double-checked locking unless using `volatile` correctly.
- Consider replacing Singletons with DI-managed beans (Spring scopes) for better testability.

## Variants Implemented in This Module
- `ConfigSingletonEager`: eager initialization at class-load; simple and thread-safe, not lazy.
- `ConfigSingletonHolder`: lazy holder idiom; thread-safe without synchronization.
- `ConfigSingletonSynchronized`: synchronized accessor; trivial to implement, but adds runtime overhead.
- `ConfigSingletonDcl`: double-checked locking with `volatile` for safe publication; reduces synchronization after init.
- `ConfigSingletonEnum`: enum-based singleton; serialization-safe and recommended for most use cases.

Each variant includes a concurrent `Map<String,String>` to mimic configuration storage and exposes `getValue` / `setValue` methods.

## Example (Holder Idiom)
```java
public final class ConfigSingletonHolder {
  private ConfigSingletonHolder(){}
  private static class Holder { static final ConfigSingletonHolder INSTANCE = new ConfigSingletonHolder(); }
  public static ConfigSingletonHolder getInstance(){ return Holder.INSTANCE; }
}
```

## Advantages
- Controlled access; potential lazy instantiation.
- Prevents accidental multiple creations of expensive resources.

## Disadvantages
- Hidden dependencies and implicit global state.
- Hinders unit testing (difficult to swap instances).
- Risk of turning into a multithreaded contention point.

## Build & Test
```
mvn -q -f "d:\GitHub_Src\Interview\java_design_patterns\pom.xml" -pl creational/singleton -am test
```

## When to Use
- Truly one logical instance (e.g. environment configuration, lightweight registries).

## When to Avoid
- Replace with dependency injection or pass explicit context.
- Avoid storing mutable state that changes over time.

## Related Patterns
- Factory Method (to manage creation variants instead of a single instance).
- Abstract Factory (families of singletons).
- Object Pool (reuse multiple instances rather than restricting to one).
