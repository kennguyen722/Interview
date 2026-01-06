/**
 * LESSON 35: Functional Composition & Monads - SOLUTIONS
 */

// ============================================================================
// SOLUTION 1: Pipe & Compose Builders
// ============================================================================

function pipe<A, B>(a: A, f: (a: A) => B): B;
function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
function pipe<A, B, C, D>(a: A, f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): D;
function pipe<A, B, C, D, E>(a: A, f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E): E;
function pipe(a: any, ...fns: any[]): any {
  return fns.reduce((result, fn) => fn(result), a);
}

function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a: A) => g(f(a));
}

// ============================================================================
// SOLUTION 2: Maybe Type
// ============================================================================

type Maybe<T> = 
  | { kind: "just"; value: T }
  | { kind: "nothing" };

const just = <T>(value: T): Maybe<T> => ({ kind: "just", value });
const nothing = <T>(): Maybe<T> => ({ kind: "nothing" });

const maybeMap = <A, B>(fn: (a: A) => B) => (m: Maybe<A>): Maybe<B> =>
  m.kind === "just" ? just(fn(m.value)) : nothing();

const maybeFlatMap = <A, B>(fn: (a: A) => Maybe<B>) => (m: Maybe<A>): Maybe<B> =>
  m.kind === "just" ? fn(m.value) : nothing();

const maybeGetOrElse = <T>(def: T) => (m: Maybe<T>): T =>
  m.kind === "just" ? m.value : def;

// ============================================================================
// SOLUTION 3: Either Type
// ============================================================================

type Either<E, T> = 
  | { kind: "left"; error: E }
  | { kind: "right"; value: T };

const right = <E, T>(value: T): Either<E, T> => ({ kind: "right", value });
const left = <E, T>(error: E): Either<E, T> => ({ kind: "left", error });

const eitherMap = <E, A, B>(fn: (a: A) => B) => (e: Either<E, A>): Either<E, B> =>
  e.kind === "right" ? right(fn(e.value)) : left(e.error);

const eitherFlatMap = <E, A, B>(fn: (a: A) => Either<E, B>) => (e: Either<E, A>): Either<E, B> =>
  e.kind === "right" ? fn(e.value) : left(e.error);

const eitherMapError = <E, F, T>(fn: (e: E) => F) => (e: Either<E, T>): Either<F, T> =>
  e.kind === "left" ? left(fn(e.error)) : right(e.value);

const eitherFold = <E, T, R>(onLeft: (e: E) => R, onRight: (t: T) => R) => (e: Either<E, T>): R =>
  e.kind === "left" ? onLeft(e.error) : onRight(e.value);

// ============================================================================
// SOLUTION 4: Validation Pipeline
// ============================================================================

type ValidationError = { field: string; message: string };

const validateEmail = (email: string): Either<ValidationError, string> =>
  email.includes("@") && email.includes(".")
    ? right(email)
    : left({ field: "email", message: "Invalid email format" });

const validatePassword = (password: string): Either<ValidationError, string> =>
  password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    ? right(password)
    : left({ field: "password", message: "Password must be 8+ chars with uppercase and number" });

const validateAge = (age: number): Either<ValidationError, number> =>
  age >= 18
    ? right(age)
    : left({ field: "age", message: "Must be 18 or older" });

interface User {
  email: string;
  password: string;
  age: number;
}

const validateUser = (data: { email: string; password: string; age: number }): Either<ValidationError, User> =>
  eitherFlatMap(
    email => eitherFlatMap(
      password => eitherFlatMap(
        age => right({ email, password, age }),
        validateAge(data.age)
      ),
      validatePassword(data.password)
    ),
    validateEmail(data.email)
  );

// ============================================================================
// SOLUTION 5: Curry & Partial
// ============================================================================

const curry = <A, B, C>(fn: (a: A, b: B) => C) => (a: A) => (b: B) => fn(a, b);

const partial = <A, B, C>(fn: (a: A, b: B) => C, a: A) => (b: B) => fn(a, b);

const uncurry = <A, B, C>(fn: (a: A) => (b: B) => C) => (a: A, b: B) => fn(a)(b);

// ============================================================================
// SOLUTION 6: Higher-Order Functions
// ============================================================================

const map = <A, B>(fn: (a: A) => B) => (arr: A[]): B[] => arr.map(fn);
const filter = <A>(pred: (a: A) => boolean) => (arr: A[]): A[] => arr.filter(pred);
const reduce = <A, B>(fn: (acc: B, a: A) => B, init: B) => (arr: A[]): B => arr.reduce(fn, init);
const flatMap = <A, B>(fn: (a: A) => B[]) => (arr: A[]): B[] => arr.flatMap(fn);

// ============================================================================
// Test Solutions
// ============================================================================

function testSolutions() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  LESSON 35: Functional Composition - SOLUTIONS            ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  // Test pipe
  console.log("✓ Solution 1: Pipe & Compose");
  const result1 = pipe(5, x => x + 1, x => x * 2, x => x - 5);
  console.log(`  pipe(5, +1, *2, -5) = ${result1}`);

  // Test Maybe
  console.log("\n✓ Solution 2: Maybe Type");
  const maybe1 = maybeFlatMap(x => just(x * 2))(just(5));
  const maybe2 = maybeFlatMap(x => just(x * 2))(nothing());
  console.log(`  just(5) >>= (*2) = ${JSON.stringify(maybe1)}`);
  console.log(`  nothing() >>= (*2) = ${JSON.stringify(maybe2)}`);

  // Test Either
  console.log("\n✓ Solution 3: Either Type");
  const either1 = eitherFlatMap(x => right(x * 2))(right(5));
  const either2 = eitherFlatMap(x => right(x * 2))(left("error"));
  console.log(`  right(5) >>= (*2) = ${JSON.stringify(either1)}`);
  console.log(`  left("error") >>= (*2) = ${JSON.stringify(either2)}`);

  // Test validation
  console.log("\n✓ Solution 4: Validation Pipeline");
  const validUser = validateUser({ email: "alice@example.com", password: "Secure123", age: 25 });
  const invalidUser = validateUser({ email: "invalid", password: "weak", age: 15 });
  console.log(`  Valid user: ${JSON.stringify(validUser)}`);
  console.log(`  Invalid user: ${JSON.stringify(invalidUser)}`);

  // Test curry
  console.log("\n✓ Solution 5: Curry & Partial");
  const add = (a: number, b: number) => a + b;
  const curriedAdd = curry(add);
  const add5 = curriedAdd(5);
  console.log(`  curry(add)(5)(3) = ${add5(3)}`);

  // Test HOFs
  console.log("\n✓ Solution 6: Higher-Order Functions");
  const numbers = [1, 2, 3, 4, 5];
  const result6 = pipe(
    numbers,
    filter(n => n > 2),
    map(n => n * 2),
    reduce((sum, n) => sum + n, 0)
  );
  console.log(`  [1,2,3,4,5] |> filter(>2) |> map(*2) |> sum = ${result6}`);

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║              All solutions tested! ✓                     ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");
}

testSolutions();
