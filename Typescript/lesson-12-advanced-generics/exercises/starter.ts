// Exercise 1: Type-safe Query Builder
// TODO: Create a QueryBuilder<T> class with chainable methods:
// - where(field: keyof T, value: T[field]): QueryBuilder<T>
// - orderBy(field: keyof T, direction: "asc" | "desc"): QueryBuilder<T>
// - limit(count: number): QueryBuilder<T>
// - execute(): Promise<T[]>

// Exercise 2: Curry type utility
// TODO: Implement Curry<F> that transforms:
// (a: A, b: B, c: C) => D
// into: (a: A) => (b: B) => (c: C) => D

// Exercise 3: PathOf utility type
// TODO: Create PathOf<T> that generates all valid paths:
// type User = { profile: { name: string; address: { city: string } } };
// PathOf<User> => "profile" | "profile.name" | "profile.address" | "profile.address.city"

// Exercise 4: Pipe with full type inference
// TODO: Implement pipe() that works with 5+ functions and infers types correctly:
// const result = pipe(
//   (x: number) => x + 1,
//   (x: number) => x * 2,
//   (x: number) => x.toString(),
//   (x: string) => x.length
// )(5);  // should infer: number => string => number

export {};
