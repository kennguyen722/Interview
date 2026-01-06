# Lesson 34: Functional Array Methods & Advanced Transformations

## Goals
- Master map, filter, sort with advanced TypeScript typing
- Understand type-preserving transformations and type guards
- Apply functional composition patterns for data processing pipelines
- Build type-safe, chainable array operations
- Learn performance implications and optimization strategies

## Core Concepts

### 1. Typed Map Operations

The `map()` method transforms each element while preserving type information.

```ts
// Basic typed map
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // inferred as number[]

// Type transformations with explicit typing
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
const names = users.map(u => u.name);  // inferred as string[]

// Generic map with type parameter
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const result = mapArray([1, 2, 3], n => n * 2);  // U = number
```

**Type Preservation & Covariance**: JavaScript's `map` is covariant—it preserves read-only types. When mapping a union type, each element is processed independently:

```ts
type Pet = { kind: "dog" } | { kind: "cat" };
const pets: Pet[] = [{ kind: "dog" }, { kind: "cat" }];
const kinds = pets.map(p => p.kind);  // inferred as ("dog" | "cat")[]
```

### 2. Typed Filter Operations

`filter()` narrows types using type guards, enabling better type safety.

```ts
// Basic filter
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);  // number[]

// Filter with type guard (TypeScript magic!)
function isString(value: string | number): value is string {
  return typeof value === "string";
}

const mixed: (string | number)[] = ["hello", 42, "world"];
const strings = mixed.filter(isString);  // inferred as string[]!

// Union type narrowing
type Animal = { type: "dog"; breed: string } | { type: "cat"; color: string };
const animals: Animal[] = [
  { type: "dog", breed: "Labrador" },
  { type: "cat", color: "black" }
];

const dogs = animals.filter((a): a is { type: "dog"; breed: string } => a.type === "dog");
// dogs is now { type: "dog"; breed: string }[], type-safe access to .breed!
```

**Type Guard Functions**: A type predicate `x is T` tells TypeScript that if the function returns true, x is of type T.

```ts
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const items = [1, undefined, 2, undefined, 3];
const defined = items.filter(isDefined);  // number[]
```

### 3. Custom Sort with Type Safety

`sort()` is tricky because it mutates the array. Often better to avoid mutation or wrap it.

```ts
// Basic numeric sort
const numbers = [3, 1, 2];
numbers.sort((a, b) => a - b);  // mutates array

// Non-mutating sort with spread operator
const sorted = [...numbers].sort((a, b) => a - b);

// Complex object sorting with type safety
type User = { id: number; name: string; age: number };
const users: User[] = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 }
];

// Sort by age (non-mutating)
const byAge = [...users].sort((a, b) => a.age - b.age);

// Type-safe comparator function
function compareBy<T>(key: keyof T): (a: T, b: T) => number {
  return (a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  };
}

const sortedUsers = [...users].sort(compareBy<User>("age"));
const sortedByName = [...users].sort(compareBy<User>("name"));
```

### 4. Chaining Operations for Pipelines

Combining map, filter, sort creates powerful data transformation pipelines:

```ts
const orders = [
  { id: 1, amount: 100, status: "completed" },
  { id: 2, amount: 50, status: "pending" },
  { id: 3, amount: 200, status: "completed" }
];

// Pipeline: filter → map → sort
const topCompleted = orders
  .filter(o => o.status === "completed")  // filter: Order[]
  .map(o => ({ ...o, tax: o.amount * 0.1 }))  // map: (Order & { tax: number })[]
  .sort((a, b) => b.amount - a.amount);  // sort: (Order & { tax: number })[]
```

### 5. Advanced Type Transformations

**Reduce for Accumulation**: Transform arrays to objects or aggregates.

```ts
// Count by status
const counts = orders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);
// { completed: 2, pending: 1 }

// Group by status
const grouped = orders.reduce((acc, o) => {
  if (!acc[o.status]) acc[o.status] = [];
  acc[o.status].push(o);
  return acc;
}, {} as Record<string, typeof orders>);

// Object from key-value array
const pairs: [string, number][] = [["a", 1], ["b", 2]];
const obj = Object.fromEntries(pairs);  // { a: 1, b: 2 }
```

**Flat & FlatMap**: Flatten nested structures.

```ts
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.flat();  // [1, 2, 3, 4, 5]

// flatMap combines map + flat
const sentences = ["hello world", "typescript rocks"];
const words = sentences.flatMap(s => s.split(" "));  // ["hello", "world", "typescript", "rocks"]

// Type-safe flatMap with optional chaining
type Post = { id: number; comments?: { id: number; text: string }[] };
const posts: Post[] = [
  { id: 1, comments: [{ id: 1, text: "great" }] },
  { id: 2 }  // no comments
];
const allComments = posts.flatMap(p => p.comments ?? []);
```

### 6. Immutable Array Methods

Modern functional programming favors immutability:

```ts
// toSorted: non-mutating sort (ES2023)
const arr = [3, 1, 2];
const sorted = arr.toSorted();  // [1, 2, 3], arr unchanged

// toReversed: non-mutating reverse (ES2023)
const reversed = arr.toReversed();  // [2, 1, 3]

// toSpliced: non-mutating splice (ES2023)
const removed = arr.toSpliced(1, 1, 99);  // [3, 99, 2]

// For older targets, use immutable pattern
const immutableSort = <T>(arr: T[], compare: (a: T, b: T) => number): T[] => {
  return [...arr].sort(compare);
};
```

### 7. Performance Considerations

- **Multiple passes**: `.filter().map()` iterates twice. Use `reduce()` for single pass if performance critical.
- **Lazy evaluation**: Generators can defer computation until needed.
- **Memory**: Large arrays with `.map()` create intermediate copies.

```ts
// Two passes (clear but slower for huge arrays)
const result = numbers
  .filter(n => n > 5)
  .map(n => n * 2);

// Single pass with reduce (faster, less readable)
const optimized = numbers.reduce((acc, n) => {
  if (n > 5) acc.push(n * 2);
  return acc;
}, [] as number[]);

// Lazy evaluation with generators
function* filterMap<T, U>(arr: T[], predicate: (t: T) => boolean, transform: (t: T) => U) {
  for (const item of arr) {
    if (predicate(item)) yield transform(item);
  }
}

const lazy = filterMap(numbers, n => n > 5, n => n * 2);
for (const value of lazy) console.log(value);  // computes on demand
```

## Exercises

1. **Type-Safe Product Builder**
   - Create a `Product` interface with `id`, `name`, `price`, `category`
   - Filter products by category, transform to discount prices (10% off), sort by price
   - Return strongly-typed result array

2. **User Data Pipeline**
   - Load users with optional `email` field
   - Filter out users without email using type guard
   - Map to `{ id, name, email }` (guaranteed email)
   - Sort by name alphabetically

3. **Comparator Factory**
   - Build generic `compareBy<T>(key: keyof T)` for any sortable property
   - Build `thenBy<T>(first: Comparator<T>, second: Comparator<T>)` for multi-field sorting
   - Sort complex objects by multiple criteria

4. **Immutable Transformations**
   - Implement non-mutating sort, reverse, splice using spread/slice
   - Chain operations on large arrays (1M+ items)
   - Compare performance vs mutating versions

5. **Stream Processing**
   - Build lazy filter/map using generators
   - Process large datasets without loading all into memory
   - Implement `take(n)` to limit generator output

## Key Takeaways

1. **Type guards in filter** enable narrowing: `filter((x): x is T => ...)` is your friend
2. **Composition over loops**: `.filter().map()` reads better than nested for loops
3. **Immutability wins**: Use spread/slice to avoid mutation bugs
4. **Performance tradeoffs**: Single-pass `reduce()` vs readable `.filter().map()`
5. **Generators for large data**: Lazy evaluation saves memory and CPU
6. **Type-safe comparators**: Generic sort builders reduce boilerplate
7. **Functional pipelines**: Chain operations for clear data transformation intent
