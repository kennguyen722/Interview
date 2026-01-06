/**
 * LESSON 35: Functional Composition & Monads - EXAMPLES
 */

// ============================================================================
// EXAMPLE 1: Pipe and Compose Operators
// ============================================================================

function example1_pipeAndCompose() {
  console.log("\n=== EXAMPLE 1: Pipe & Compose ===");

  const add1 = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  const subtract5 = (x: number) => x - 5;

  // Pipe: left-to-right
  function pipe<A, B>(a: A, f: (a: A) => B): B;
  function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
  function pipe<A, B, C, D>(a: A, f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): D;
  function pipe(a: any, ...fns: any[]): any {
    return fns.reduce((result, fn) => fn(result), a);
  }

  const result1 = pipe(5, add1, double, subtract5);
  console.log("pipe(5, add1, double, subtract5):", result1);

  // Compose: right-to-left (mathematical style)
  function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
    return (a: A) => g(f(a));
  }

  const composed = compose(compose(add1, double), subtract5);
  const result2 = composed(5);
  console.log("compose(add1, double, subtract5)(5):", result2);
}

// ============================================================================
// EXAMPLE 2: Maybe Monad
// ============================================================================

function example2_maybeMonad() {
  console.log("\n=== EXAMPLE 2: Maybe Monad ===");

  type Maybe<T> = { kind: "just"; value: T } | { kind: "nothing" };

  const just = <T>(value: T): Maybe<T> => ({ kind: "just", value });
  const nothing = <T>(): Maybe<T> => ({ kind: "nothing" });

  const maybeMap = <A, B>(fn: (a: A) => B) => (m: Maybe<A>): Maybe<B> =>
    m.kind === "just" ? just(fn(m.value)) : nothing();

  const flatMap = <A, B>(fn: (a: A) => Maybe<B>) => (m: Maybe<A>): Maybe<B> =>
    m.kind === "just" ? fn(m.value) : nothing();

  const getOrElse = <T>(def: T) => (m: Maybe<T>): T =>
    m.kind === "just" ? m.value : def;

  // Parse age safely
  const parseAge = (str: string): Maybe<number> => {
    const n = parseInt(str);
    return Number.isNaN(n) ? nothing() : just(n);
  };

  function pipe<A, B>(a: A, f: (a: A) => B): B;
  function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
  function pipe(a: any, ...fns: any[]): any {
    return fns.reduce((result, fn) => fn(result), a);
  }

  const age1 = pipe("25", parseAge, maybeMap(x => x * 2), getOrElse(0));
  const age2 = pipe("invalid", parseAge, maybeMap(x => x * 2), getOrElse(0));

  console.log("Valid age string '25':", age1);
  console.log("Invalid age string 'invalid':", age2);
}

// ============================================================================
// EXAMPLE 3: Either Monad for Error Handling
// ============================================================================

function example3_eitherMonad() {
  console.log("\n=== EXAMPLE 3: Either Monad ===");

  type Either<E, T> = { kind: "left"; error: E } | { kind: "right"; value: T };

  const right = <E, T>(value: T): Either<E, T> => ({ kind: "right", value });
  const left = <E, T>(error: E): Either<E, T> => ({ kind: "left", error });

  const eitherMap = <E, A, B>(fn: (a: A) => B) => (e: Either<E, A>): Either<E, B> =>
    e.kind === "right" ? right(fn(e.value)) : left(e.error);

  const flatMap = <E, A, B>(fn: (a: A) => Either<E, B>) => (e: Either<E, A>): Either<E, B> =>
    e.kind === "right" ? fn(e.value) : left(e.error);

  const match = <E, T, R>(onLeft: (e: E) => R, onRight: (t: T) => R) => (e: Either<E, T>): R =>
    e.kind === "left" ? onLeft(e.error) : onRight(e.value);

  const divide = (a: number, b: number): Either<string, number> =>
    b === 0 ? left("Division by zero") : right(a / b);

  function pipe<A, B>(a: A, f: (a: A) => B): B;
  function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
  function pipe(a: any, ...fns: any[]): any {
    return fns.reduce((result, fn) => fn(result), a);
  }

  const result1 = pipe(divide(10, 2), eitherMap(x => x * 3), match(err => `Error: ${err}`, val => `Result: ${val}`));
  const result2 = pipe(divide(10, 0), eitherMap(x => x * 3), match(err => `Error: ${err}`, val => `Result: ${val}`));

  console.log("divide(10, 2) with map:", result1);
  console.log("divide(10, 0) with map:", result2);
}

// ============================================================================
// EXAMPLE 4: Currying and Partial Application
// ============================================================================

function example4_currying() {
  console.log("\n=== EXAMPLE 4: Currying ===");

  // Regular function
  const add = (a: number, b: number): number => a + b;

  // Curry utility
  const curry = <A, B, C>(fn: (a: A, b: B) => C) => (a: A) => (b: B) => fn(a, b);

  const curriedAdd = curry(add);
  const add5 = curriedAdd(5);

  console.log("curriedAdd(5)(3):", add5(3));
  console.log("curriedAdd(5)(10):", curriedAdd(5)(10));

  // Practical: Array map with curried function
  const multiply = (a: number, b: number) => a * b;
  const curriedMult = curry(multiply);
  const double = curriedMult(2);
  const triple = curriedMult(3);

  const numbers = [1, 2, 3, 4, 5];
  console.log("Map with double:", numbers.map(double));
  console.log("Map with triple:", numbers.map(triple));
}

// ============================================================================
// EXAMPLE 5: Higher-Order Functions
// ============================================================================

function example5_higherOrderFunctions() {
  console.log("\n=== EXAMPLE 5: Higher-Order Functions ===");

  const map = <A, B>(fn: (a: A) => B) => (arr: A[]): B[] => arr.map(fn);
  const filter = <A>(pred: (a: A) => boolean) => (arr: A[]): A[] => arr.filter(pred);
  const reduce = <A, B>(fn: (acc: B, a: A) => B, init: B) => (arr: A[]): B => arr.reduce(fn, init);

  function pipe<A, B>(a: A, f: (a: A) => B): B;
  function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
  function pipe<A, B, C, D>(a: A, f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): D;
  function pipe(a: any, ...fns: any[]): any {
    return fns.reduce((result, fn) => fn(result), a);
  }

  const numbers = [1, 2, 3, 4, 5];
  const result = pipe(numbers, filter(n => n > 2), map(n => n * 2), reduce((sum, n) => sum + n, 0));

  console.log("Filter (>2), map (*2), reduce (sum):", result);
}

// ============================================================================
// EXAMPLE 6: Validation with Either
// ============================================================================

function example6_validation() {
  console.log("\n=== EXAMPLE 6: Validation Pipeline ===");

  type Either<E, T> = { kind: "left"; error: E } | { kind: "right"; value: T };
  const right = <E, T>(value: T): Either<E, T> => ({ kind: "right", value });
  const left = <E, T>(error: E): Either<E, T> => ({ kind: "left", error });

  const flatMap = <E, A, B>(fn: (a: A) => Either<E, B>) => (e: Either<E, A>): Either<E, B> =>
    e.kind === "right" ? fn(e.value) : left(e.error);

  type ValidationError = { field: string; message: string };

  const validateEmail = (email: string): Either<ValidationError, string> =>
    email.includes("@") ? right(email) : left({ field: "email", message: "Invalid email" });

  const validateName = (name: string): Either<ValidationError, string> =>
    name.length > 0 ? right(name) : left({ field: "name", message: "Name required" });

  const validateAge = (age: number): Either<ValidationError, number> =>
    age >= 18 ? right(age) : left({ field: "age", message: "Must be 18+" });

  interface User {
    name: string;
    email: string;
    age: number;
  }

  const validateUser = (data: { name: string; email: string; age: number }): Either<ValidationError, User> =>
    flatMap(name => flatMap(email => flatMap(age => right({ name, email, age }), validateAge(data.age)), validateEmail(data.email)), validateName(data.name));

  const valid = validateUser({ name: "Alice", email: "alice@example.com", age: 25 });
  const invalid = validateUser({ name: "", email: "bob@example.com", age: 17 });

  console.log("Valid user:", valid);
  console.log("Invalid user:", invalid);
}

// ============================================================================
// EXAMPLE 7: Method Chaining Builder Pattern
// ============================================================================

function example7_builderPattern() {
  console.log("\n=== EXAMPLE 7: Fluent Builder ===");

  interface QueryBuilder<T> {
    select: (...fields: (keyof T)[]) => QueryBuilder<T>;
    where: (predicate: (item: T) => boolean) => QueryBuilder<T>;
    orderBy: (comparator: (a: T, b: T) => number) => QueryBuilder<T>;
    limit: (n: number) => QueryBuilder<T>;
    build: () => T[];
  }

  interface Product {
    id: number;
    name: string;
    price: number;
  }

  const products: Product[] = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mouse", price: 50 },
    { id: 3, name: "Keyboard", price: 100 }
  ];

  function createQueryBuilder<T>(data: T[]): QueryBuilder<T> {
    let result: T[] = data;
    const builder = {
      select: () => builder,
      where: (pred: (t: T) => boolean) => {
        result = result.filter(pred);
        return builder;
      },
      orderBy: (comp: (a: T, b: T) => number) => {
        result = [...result].sort(comp);
        return builder;
      },
      limit: (n: number) => {
        result = result.slice(0, n);
        return builder;
      },
      build: () => result
    };
    return builder;
  }

  const query = createQueryBuilder(products)
    .where((p: Product) => p.price > 50)
    .orderBy((a, b) => a.price - b.price)
    .limit(2)
    .build();

  console.log("Query result:", query);
}

// ============================================================================
// EXAMPLE 8: Point-Free Style
// ============================================================================

function example8_pointFree() {
  console.log("\n=== EXAMPLE 8: Point-Free Style ===");

  const map = <A, B>(fn: (a: A) => B) => (arr: A[]): B[] => arr.map(fn);
  const filter = <A>(pred: (a: A) => boolean) => (arr: A[]): A[] => arr.filter(pred);

  function pipe<A, B>(a: A, f: (a: A) => B): B;
  function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
  function pipe(a: any, ...fns: any[]): any {
    return fns.reduce((result, fn) => fn(result), a);
  }

  // Point-full (explicit parameters)
  const incrementPointful = (x: number) => x + 1;
  const doublePointful = (x: number) => x * 2;

  // Point-free (no explicit parameters)
  const increment = (x: number) => x + 1;
  const double = (x: number) => x * 2;

  const numbers = [1, 2, 3, 4, 5];

  // Without point-free (more verbose)
  const result1 = numbers.map(increment).map(double).filter((x: number) => x > 4);

  // With point-free (cleaner data flow)
  const result2 = pipe(numbers, map(increment), map(double), filter(x => x > 4));

  console.log("Point-full result:", result1);
  console.log("Point-free result:", result2);
}

// ============================================================================
// MAIN: Run all examples
// ============================================================================

function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║     LESSON 35: Functional Composition & Monads             ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  example1_pipeAndCompose();
  example2_maybeMonad();
  example3_eitherMonad();
  example4_currying();
  example5_higherOrderFunctions();
  example6_validation();
  example7_builderPattern();
  example8_pointFree();

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║              All examples completed successfully!           ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
}

main();
