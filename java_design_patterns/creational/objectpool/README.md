# Object Pool Pattern (Creational - Supplemental)

## Intent
Manage a set of initialized reusable objects rather than creating/destroying them on demand.

## Motivation
High-cost objects (e.g., parsers with heavy state, buffers) benefit from reuse to reduce GC pressure and latency spikes.

## Structure
- Pool holds idle instances.
- Borrow returns instance (new or reused).
- Release returns instance to pool.

## Participants
- Pool (manages lifecycle)
- PooledObject (objects suitable for reuse)
- Client (borrows/releases objects)

## Example
`ObjectPool<T>` with a `Deque<T>` and a `Supplier<T>` for creation.

## Advantages
- Performance: fewer allocations & reduced initialization cost.
- Predictable resource usage.

## Disadvantages
- Complexity around object state cleanliness.
- Risk of stale or leaked objects if not released.

## When to Use
- Expensive creation; high frequency short-lived usage.

## When to Avoid
- Lightweight objects; let GC manage lifecycle.

## Implementation Notes
- Always reset object state on release.
- Consider max pool size and eviction policies.
- Thread-safe pools require synchronization; consider `BlockingQueue`.

## Related Patterns
- Prototype (fast cloning alternative).
- Flyweight (sharing intrinsic state instead of pooling full objects).
- Singleton (single shared instance vs many reusable instances).
