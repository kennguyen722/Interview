// Exercise 1: Implement Range Type
// Create a type that generates a tuple of numbers from Start to End
// Example: Range<1, 5> = [1, 2, 3, 4, 5]

type Range<Start extends number, End extends number> = any; // TODO: Implement

// Exercise 2: Implement DeepReadonly
// Make all properties and nested properties readonly
// Hint: Use recursion and conditional types

type DeepReadonly<T> = any; // TODO: Implement

interface TestObj {
  a: string;
  b: { c: number; d: { e: boolean } };
}

type TestReadonly = DeepReadonly<TestObj>;
// Should make all properties readonly, including nested ones

// Exercise 3: Implement Join Type
// Join array of strings with separator
// Example: Join<["a", "b", "c"], "-"> = "a-b-c"

type Join<T extends readonly string[], Separator extends string = ""> = any; // TODO: Implement

// Exercise 4: Implement PathOf Type
// Extract all possible paths from an object type
// Example: PathOf<{a: {b: {c: number}}}, "."> = "a" | "a.b" | "a.b.c"

type PathOf<T, Separator extends string = "."> = any; // TODO: Implement

// Exercise 5: Type-Safe Event Emitter
// Create an EventEmitter that enforces event types at compile time
// Events should be a record of event names to their payload types

interface Events {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  message: { from: string; to: string; body: string };
}

class TypedEventEmitter<TEvents extends Record<string, any>> {
  // TODO: Implement methods:
  // - on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): void
  // - emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void
  // - off<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): void
}

// Exercise 6: Implement Curry Type
// Create a type that curries a function
// Example: Curry<(a: string, b: number, c: boolean) => void>
// Should be: (a: string) => (b: number) => (c: boolean) => void

type Curry<F> = any; // TODO: Implement

// Exercise 7: Type-Safe SQL WHERE Clause
// Create a type-safe where clause builder
// Should only allow comparing fields that exist on the type
// Should enforce correct value types

interface WhereClause<T> {
  // TODO: Define structure
}

// Exercise 8: Implement Permutations Type
// Generate all permutations of a union type
// Example: Permutation<"a" | "b" | "c">
// Should be: "a" | "b" | "c" | "ab" | "ac" | "ba" | "bc" | "ca" | "cb" | "abc" | ...

type Permutation<T> = any; // TODO: Implement

// Exercise 9: Type-Level FizzBuzz
// Implement FizzBuzz at the type level
// FizzBuzz<15> should be: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]

type FizzBuzz<N extends number> = any; // TODO: Implement

// Exercise 10: Implement Pipe Type
// Create a type that represents the result of piping functions
// pipe(f, g, h)(x) = h(g(f(x)))

type Pipe<Fns extends readonly Function[]> = any; // TODO: Implement

export {};
