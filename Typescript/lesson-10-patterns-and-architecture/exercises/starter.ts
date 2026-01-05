// Exercise 1: assertNever and exhaustive checking
// TODO: Implement assertNever(x: never): never
// TODO: Use it in a switch statement that covers all states

// Exercise 2: Cache interface and implementation
// TODO: Define Cache<K, V> interface with:
// - get(key: K): V | undefined
// - set(key: K, value: V): void
// - delete(key: K): boolean
// TODO: Implement MemoryCache<K, V> with Map

// Exercise 3: Order state machine
// TODO: Define OrderStatus type: created, paid, shipped, delivered, cancelled
// TODO: Define Order type with id, status, total
// TODO: Implement transition function that enforces valid state changes
// Example: can transition from "created" to "paid", but not "paid" back to "created"

export {};
