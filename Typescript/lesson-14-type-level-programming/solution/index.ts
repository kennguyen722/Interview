// Solution 1: Range Type
type BuildTuple<L extends number, T extends unknown[] = []> = T["length"] extends L
  ? T
  : BuildTuple<L, [...T, unknown]>;

type Range<
  Start extends number,
  End extends number,
  Acc extends number[] = [],
  Current extends number = Start
> = Current extends End
  ? [...Acc, Current]
  : Range<Start, End, [...Acc, Current], [...BuildTuple<Current>, unknown]["length"] extends infer Next
      ? Next extends number
        ? Next
        : never
      : never>;

type Test1 = Range<1, 5>; // [1, 2, 3, 4, 5]
type Test2 = Range<0, 3>; // [0, 1, 2, 3]

// Solution 2: DeepReadonly
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface TestObj {
  a: string;
  b: { c: number; d: { e: boolean } };
  f: string[];
}

type TestReadonly = DeepReadonly<TestObj>;
// { readonly a: string; readonly b: { readonly c: number; readonly d: { readonly e: boolean } }; readonly f: readonly string[] }

// Solution 3: Join Type
type Join<T extends readonly string[], Separator extends string = ""> = T extends readonly [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? Rest["length"] extends 0
    ? First
    : `${First}${Separator}${Join<Rest, Separator>}`
  : "";

type Test3 = Join<["a", "b", "c"], "-">; // "a-b-c"
type Test4 = Join<["x", "y"], "/">; // "x/y"

// Solution 4: PathOf Type
type PathOf<T, Separator extends string = ".", Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ?
            | `${Prefix}${K}`
            | PathOf<T[K], Separator, `${Prefix}${K}${Separator}`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

type TestPath = PathOf<{ a: { b: { c: number } } }>;
// "a" | "a.b" | "a.b.c"

// Solution 5: Type-Safe Event Emitter
interface Events {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  message: { from: string; to: string; body: string };
}

class TypedEventEmitter<TEvents extends Record<string, any>> {
  private handlers = new Map<keyof TEvents, Set<(payload: any) => void>>();

  on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  off<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }
}

// Test
const emitter = new TypedEventEmitter<Events>();
emitter.on("login", (payload) => {
  console.log(`User ${payload.userId} logged in at ${payload.timestamp}`);
});
emitter.emit("login", { userId: "123", timestamp: new Date() });

// Solution 6: Curry Type
type Curry<F> = F extends (...args: infer Args) => infer Return
  ? Args extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<(...args: Rest) => Return>
    : Return
  : never;

function curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  } as Curry<F>;
}

// Test
const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);
const result = curriedAdd(1)(2)(3); // 6

// Solution 7: Type-Safe SQL WHERE Clause
type Comparator = "=" | "!=" | ">" | "<" | ">=" | "<=";

type WhereClause<T> = {
  [K in keyof T]?: T[K] extends string | number | boolean
    ? { field: K; operator: Comparator; value: T[K] } | T[K]
    : never;
};

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

type UserWhere = WhereClause<User>;

const where: UserWhere = {
  age: { field: "age", operator: ">=", value: 18 },
  active: true,
};

// Solution 8: Permutation Type
type Permutation<T, K = T> = [T] extends [never]
  ? []
  : K extends K
  ? [K, ...Permutation<Exclude<T, K>>]
  : never;

type Test5 = Permutation<"a" | "b" | "c">;
// ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"] | ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]

// Solution 9: Type-Level FizzBuzz (Simplified version)
type FizzBuzzValue<N extends number> = N extends 0
  ? never
  : `${N}` extends `${string}${3 | 6 | 9}`
  ? "Fizz"
  : `${N}` extends `${string}${5 | 0}`
  ? "Buzz"
  : `${N}` extends `${string}${15}`
  ? "FizzBuzz"
  : `${N}`;

// For a complete implementation, you'd need to build a tuple and map over it
type FizzBuzz<N extends number> = Range<1, N> extends infer R
  ? R extends number[]
    ? { [K in keyof R]: FizzBuzzValue<R[K] extends number ? R[K] : never> }
    : never
  : never;

// Solution 10: Pipe Type
type Pipe<Fns extends readonly Function[]> = Fns extends readonly [
  infer First,
  ...infer Rest extends readonly Function[]
]
  ? First extends (arg: infer A) => infer B
    ? Rest extends []
      ? (arg: A) => B
      : Pipe<Rest> extends (arg: B) => infer C
      ? (arg: A) => C
      : never
    : never
  : never;

function pipe<T extends readonly Function[]>(
  ...fns: T
): Pipe<T> {
  return ((arg: any) => fns.reduce((acc, fn) => fn(acc), arg)) as Pipe<T>;
}

// Test
const add1 = (x: number) => x + 1;
const double = (x: number) => x * 2;
const toString = (x: number) => `Result: ${x}`;

const transform = pipe(add1, double, toString);
const output = transform(5); // "Result: 12"

// Advanced: PathValue type that gets value at path
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

interface NestedUser {
  profile: {
    personal: {
      name: string;
      age: number;
    };
  };
}

type UserName = PathValue<NestedUser, "profile.personal.name">; // string
type UserAge = PathValue<NestedUser, "profile.personal.age">; // number

export {
  Range,
  DeepReadonly,
  Join,
  PathOf,
  TypedEventEmitter,
  Curry,
  curry,
  WhereClause,
  Permutation,
  FizzBuzz,
  Pipe,
  pipe,
  PathValue,
};
