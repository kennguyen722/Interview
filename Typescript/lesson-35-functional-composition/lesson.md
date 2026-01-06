# Lesson 35: Functional Composition & Monads

## Goals
- Master function composition patterns for clean data pipelines
- Understand monadic patterns (Maybe, Either, Result) for error handling
- Build type-safe composable functions
- Learn about pipe and compose operators
- Apply functional programming to real-world problems

## Core Concepts

### 1. Function Composition Basics

**Composition** means applying functions sequentially where output of one becomes input of next.

```ts
// Simple example
const add1 = (x: number) => x + 1;
const double = (x: number) => x * 2;
const subtract5 = (x: number) => x - 5;

// Naive approach: nested function calls
const result = subtract5(double(add1(5)));  // 2

// Better: explicit composition
type Fn<A, B> = (a: A) => B;

function compose<A, B, C>(f: Fn<A, B>, g: Fn<B, C>): Fn<A, C> {
  return (a: A) => g(f(a));
}

const pipeline = compose(compose(add1, double), subtract5);
const result2 = pipeline(5);  // same as above
```

**Key insight**: Composition reads right-to-left in most functional languages (f after g), but for JavaScript comfort, `pipe` reads left-to-right.

```ts
// Pipe: left-to-right composition (more intuitive for most developers)
function pipe<A, B>(a: A, f: Fn<A, B>): B;
function pipe<A, B, C>(a: A, f: Fn<A, B>, g: Fn<B, C>): C;
function pipe<A, B, C, D>(a: A, f: Fn<A, B>, g: Fn<B, C>, h: Fn<C, D>): D;
function pipe(a: any, ...fns: any[]): any {
  return fns.reduce((result, fn) => fn(result), a);
}

const result3 = pipe(5, add1, double, subtract5);  // 2
```

### 2. Higher-Order Functions

Functions that work with other functions:

```ts
// Map: applies function to each element
const map = <A, B>(fn: (a: A) => B) => (arr: A[]): B[] => arr.map(fn);

// Filter: keeps elements matching predicate
const filter = <A>(pred: (a: A) => boolean) => (arr: A[]): A[] => arr.filter(pred);

// Reduce: combines elements
const reduce = <A, B>(fn: (acc: B, a: A) => B, init: B) => (arr: A[]): B =>
  arr.reduce(fn, init);

// Usage with composition
const numbers = [1, 2, 3, 4, 5];
const result = pipe(
  numbers,
  filter(n => n > 2),
  map(n => n * 2),
  reduce((sum, n) => sum + n, 0)
);  // (3 + 4 + 5) * 2 = 24
```

### 3. Maybe Monad Pattern

`Maybe<T>` represents a value that may or may not exist (instead of `null`/`undefined`).

```ts
type Maybe<T> = { kind: "just"; value: T } | { kind: "nothing" };

// Constructor functions
const just = <T>(value: T): Maybe<T> => ({ kind: "just", value });
const nothing = <T>(): Maybe<T> => ({ kind: "nothing" });

// Map: apply function only if Just
const maybeMap = <A, B>(fn: (a: A) => B) => (m: Maybe<A>): Maybe<B> =>
  m.kind === "just" ? just(fn(m.value)) : nothing();

// FlatMap: chain operations that return Maybe
const flatMap = <A, B>(fn: (a: A) => Maybe<B>) => (m: Maybe<A>): Maybe<B> =>
  m.kind === "just" ? fn(m.value) : nothing();

// GetOrElse: extract value with default
const getOrElse = <T>(def: T) => (m: Maybe<T>): T =>
  m.kind === "just" ? m.value : def;

// Usage example
const parseAge = (str: string): Maybe<number> => {
  const n = parseInt(str);
  return Number.isNaN(n) ? nothing() : just(n);
};

const ageStr = "25";
const doubled = pipe(
  ageStr,
  parseAge,
  maybeMap(x => x * 2),
  getOrElse(0)
);  // 50
```

**Key benefit**: No null checks needed—the type system enforces handling both cases.

### 4. Either Monad Pattern

`Either<E, T>` represents success (Right) or failure (Left) with error information.

```ts
type Either<E, T> = { kind: "left"; error: E } | { kind: "right"; value: T };

const right = <E, T>(value: T): Either<E, T> => ({ kind: "right", value });
const left = <E, T>(error: E): Either<E, T> => ({ kind: "left", error });

// Map: apply function only if Right
const eitherMap = <E, A, B>(fn: (a: A) => B) => (e: Either<E, A>): Either<E, B> =>
  e.kind === "right" ? right(fn(e.value)) : left(e.error);

// FlatMap: chain operations
const flatMap = <E, A, B>(fn: (a: A) => Either<E, B>) => (e: Either<E, A>): Either<E, B> =>
  e.kind === "right" ? fn(e.value) : left(e.error);

// Match: handle both cases
const match = <E, T, R>(
  onLeft: (e: E) => R,
  onRight: (t: T) => R
) => (e: Either<E, T>): R =>
  e.kind === "left" ? onLeft(e.error) : onRight(e.value);

// Usage
const divide = (a: number, b: number): Either<string, number> =>
  b === 0 ? left("Division by zero") : right(a / b);

const result = pipe(
  divide(10, 2),
  eitherMap(x => x * 3),
  match(
    err => `Error: ${err}`,
    val => `Result: ${val}`
  )
);  // "Result: 15"
```

### 5. Result Type for Validation

Common pattern combining Either with type-safe error handling:

```ts
type Result<T, E = Error> = Either<E, T>;

// Validation example
interface ValidatedUser {
  id: number;
  name: string;
  email: string;
}

type ValidationError = { field: string; message: string };

const validateEmail = (email: string): Either<ValidationError, string> => {
  return email.includes("@") ? right(email) : left({ field: "email", message: "Invalid email" });
};

const validateName = (name: string): Either<ValidationError, string> => {
  return name.length > 0 ? right(name) : left({ field: "name", message: "Name required" });
};

// Combine validations
const validateUser = (data: { name: string; email: string }): Either<ValidationError, ValidatedUser> =>
  flatMap(
    name =>
      flatMap(
        email => right({ id: 0, name, email }),
        validateEmail(data.email)
      ),
    validateName(data.name)
  );
```

### 6. Currying for Composition

**Currying** converts a function of multiple arguments into a chain of functions.

```ts
// Regular function
const add = (a: number, b: number): number => a + b;

// Curried version
const curriedAdd = (a: number) => (b: number): number => a + b;
const add5 = curriedAdd(5);  // partial application
const result = add5(3);  // 8

// Curry utility
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return a => b => fn(a, b);
}

// Practical use with composition
const multiply = (a: number, b: number) => a * b;
const curriedMult = curry(multiply);

const double = curriedMult(2);
const result2 = [1, 2, 3].map(double);  // [2, 4, 6]
```

### 7. Point-Free Style

Writing functions without explicit parameters:

```ts
// Point-ful (explicit parameters)
const increment = (x: number) => x + 1;
const double = (x: number) => x * 2;
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// Point-free (using composition)
const increment = (x: number) => x + 1;
const double = (x: number) => x * 2;

const process = pipe(
  [1, 2, 3],
  map(increment),
  map(double),
  sum
);

// Even more point-free with composition operators
const mapIncrementDouble = compose(map(increment), map(double));
```

### 8. Applicative Pattern

Pattern for combining values in a context:

```ts
type App<T> = { apply: (fn: App<(t: T) => T>) => App<T> };

// Maybe applicative
const maybeOf = <T>(value: T): Maybe<T> => just(value);

const maybeApply = <A, B>(
  mfn: Maybe<(a: A) => B>
) => (ma: Maybe<A>): Maybe<B> =>
  mfn.kind === "just" && ma.kind === "just" ? just(mfn.value(ma.value)) : nothing();

// Usage: Apply multiple functions to a value
const add = (a: number) => (b: number) => a + b;
const result = pipe(
  just(2),
  maybeApply(just(add(3)))
);  // just(5)
```

## Exercises

1. **Pipe & Compose Builders**
   - Implement variadic `pipe(...fns)` and `compose(...fns)`
   - Handle type inference for chained calls
   - Build `flow(fns)` as alternative syntax

2. **Custom Monad Library**
   - Implement Maybe, Either, Result types
   - Add map, flatMap, getOrElse methods
   - Create validation helper using Either

3. **Currying Utilities**
   - Build generic `curry` for multi-argument functions
   - Implement `partial` for partial application
   - Create `uncurry` for converting back

4. **Railway-Oriented Pipeline**
   - Build error-handling pipeline using Either
   - Chain multiple validations
   - Accumulate errors (collect all validation failures)

5. **Type-Safe Query Builder**
   - Build composable query builder with method chaining
   - Use either monad for type validation
   - Generate SQL or API calls

## Key Takeaways

1. **Composition** enables reusable, testable functions
2. **Pipe** (left-to-right) reads better than nested function calls
3. **Monads** (Maybe, Either) eliminate null checks and error handling boilerplate
4. **Currying** enables partial application and function specialization
5. **Point-free** style reduces ceremony and emphasizes data flow
6. **Type safety** increases as you move to functional patterns
7. **Railway-oriented** programming keeps happy path code clean
