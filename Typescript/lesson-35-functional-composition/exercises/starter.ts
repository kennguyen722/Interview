/**
 * LESSON 35: Functional Composition & Monads - EXERCISES
 */

// ============================================================================
// EXERCISE 1: Pipe & Compose Builders
// ============================================================================

/*
Task: Implement variadic pipe and compose operators

1. Implement pipe(...fns) for left-to-right composition
2. Implement compose(...fns) for right-to-left composition
3. Handle type inference for chained calls (tricky!)
4. Add flow() as alternative syntax

Example:
  pipe(5, x => x + 1, x => x * 2, x => x - 5) // (5+1)*2-5 = 7
  compose(x => x - 5, x => x * 2, x => x + 1)(5) // 5 from right
  
Hints:
- Use function overloads for type-safe inference
- For compose, apply functions right-to-left
- Test with various function types (string transforms, etc)
*/

// TODO: Implement pipe
// function pipe<A, B>(a: A, f: (a: A) => B): B;
// function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C;
// ... more overloads
// function pipe(a: any, ...fns: any[]): any { ... }

// TODO: Implement compose
// function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C { ... }

// ============================================================================
// EXERCISE 2: Custom Maybe & Either Types
// ============================================================================

/*
Task: Implement Maybe and Either monad types with full API

Maybe<T> should have:
- just(value): Maybe<T>
- nothing(): Maybe<T>
- map(fn): apply function if Some
- flatMap(fn): chain operations
- getOrElse(default): extract with fallback
- fold(onNothing, onJust): handle both cases

Either<E, T> should have:
- right(value): Either<E, T>
- left(error): Either<E, T>
- map(fn): transform right value
- flatMap(fn): chain operations
- mapError(fn): transform left error
- fold(onLeft, onRight): handle both cases

Example:
  const maybe = just(5).map(x => x * 2).flatMap(x => just(x + 1))
  const either = right(10).map(x => x / 2).fold(e => -1, v => v)
  
Hints:
- Use discriminated unions for type safety
- Implement both map and flatMap
- Test chaining operations
- Verify type narrowing works
*/

// TODO: Implement Maybe type
// TODO: Implement Either type

// ============================================================================
// EXERCISE 3: Validation Pipeline
// ============================================================================

/*
Task: Build email/password/age validation using Either

1. Validate email (must contain @)
2. Validate password (8+ chars, has number, has uppercase)
3. Validate age (must be 18+)
4. Combine validations for user registration
5. Accumulate ALL errors (not just first one)

Example:
  Input: { email: "invalid", password: "weak", age: 15 }
  Output: { errors: ["Invalid email", "Password too weak", "Must be 18+"] }
  
Hints:
- Use Either to represent success/failure
- For accumulation, collect errors in array
- Use flatMap to chain validations
- Return both success and error variants
*/

// TODO: Implement email validation
// TODO: Implement password validation
// TODO: Implement age validation
// TODO: Implement combined validateUser

// ============================================================================
// EXERCISE 4: Currying & Partial Application
// ============================================================================

/*
Task: Implement curry and partial utilities

1. curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C
2. partial<A, B, C>(fn: (a: A, b: B) => C, a: A): (b: B) => C
3. uncurry: reverse curry
4. Test with array mapping

Example:
  const add = (a: number, b: number) => a + b;
  const curriedAdd = curry(add);
  const add5 = curriedAdd(5);
  [1, 2, 3].map(add5) // [6, 7, 8]
  
Hints:
- Curry returns nested functions
- Partial applies one argument and returns function
- Use generics for type safety
- Test composition with map/filter
*/

// TODO: Implement curry
// TODO: Implement partial
// TODO: Implement uncurry

// ============================================================================
// EXERCISE 5: Higher-Order Function Library
// ============================================================================

/*
Task: Build reusable HOF utilities (map, filter, reduce, etc)

1. map<A, B>(fn: (a: A) => B): (arr: A[]) => B[]
2. filter<A>(pred: (a: A) => boolean): (arr: A[]) => A[]
3. reduce<A, B>(fn: (acc: B, a: A) => B, init: B): (arr: A[]) => B
4. compose them with pipe

Example:
  const numbers = [1, 2, 3, 4, 5];
  pipe(
    numbers,
    filter(x => x > 2),
    map(x => x * 2),
    reduce((sum, x) => sum + x, 0)
  ) // (3 + 4 + 5) * 2 = 24
  
Hints:
- Each HOF returns a function taking array
- This enables composition with pipe
- Test with different data types
- Performance: note this creates intermediate arrays
*/

// TODO: Implement map HOF
// TODO: Implement filter HOF
// TODO: Implement reduce HOF

// ============================================================================
// EXERCISE 6: Fluent Query Builder
// ============================================================================

/*
Task: Build type-safe fluent API for queries

Example:
  db.users
    .where(u => u.age > 18)
    .select(["name", "email"])
    .orderBy("name", "asc")
    .limit(10)
    .exec()
  
Requirements:
1. Chainable methods (return this or builder)
2. Type-safe field selection
3. Where filtering
4. Order by with direction
5. Limit results
6. Execute query

Hints:
- Use method chaining
- Return QueryBuilder from each method
- Use generics for type safety on fields
- Build SQL string or execute immediately
*/

// TODO: Implement QueryBuilder interface
// TODO: Implement createQueryBuilder factory

// ============================================================================
// Test harness
// ============================================================================

function testExercises() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  LESSON 35: Functional Composition - EXERCISES");
  console.log("═══════════════════════════════════════════════════════════\n");

  // TODO: Add test cases for exercises 1-6

  console.log("✓ All tests passed!");
}

// Uncomment to run tests
// testExercises();
