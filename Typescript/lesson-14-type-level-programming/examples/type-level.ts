// Example 1: Type-Level Arithmetic - Increment/Decrement
type BuildTuple<L extends number, T extends unknown[] = []> = T["length"] extends L
  ? T
  : BuildTuple<L, [...T, unknown]>;

type Inc<N extends number> = [...BuildTuple<N>, unknown]["length"] extends infer R
  ? R extends number
    ? R
    : never
  : never;

type Dec<N extends number> = BuildTuple<N> extends [unknown, ...infer Rest]
  ? Rest["length"]
  : 0;

// Tests
type Test1 = Inc<5>; // 6
type Test2 = Dec<5>; // 4
type Test3 = Inc<0>; // 1

// Example 2: String Manipulation - Split path into array
type Split<S extends string, D extends string = "."> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

// Tests
type Test4 = Split<"user.profile.name">; // ["user", "profile", "name"]
type Test5 = Split<"a/b/c", "/">; // ["a", "b", "c"]

// Example 3: Deep Get - Navigate object by path
type Get<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Get<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

type User = {
  id: number;
  profile: {
    name: string;
    address: { city: string; zip: number };
  };
};

type Test6 = Get<User, "profile.name">; // string
type Test7 = Get<User, "profile.address.city">; // string
type Test8 = Get<User, "profile.address.zip">; // number

// Example 4: Deep Set - Set value at path with type safety
type Set<T, P extends string, V> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Omit<T, K> & { [Key in K]: Set<T[K], Rest, V> }
    : T
  : P extends keyof T
  ? Omit<T, P> & { [Key in P]: V }
  : T;

type Test9 = Set<User, "profile.name", boolean>; // User with profile.name: boolean

// Example 5: Parser Combinator Types
type ParseInt<S extends string> = S extends `${infer N extends number}` ? N : never;

type ParseResult<T, Rest extends string> = {
  success: true;
  value: T;
  rest: Rest;
};

type ParseError = {
  success: false;
  error: string;
};

type Parser<T> = <S extends string>(input: S) => ParseResult<T, string> | ParseError;

// Example 6: Extract URL Parameters
type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<`/${Rest}`>
    : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type Test10 = ExtractRouteParams<"/users/:id/posts/:postId">; // { id: string; postId: string }
type Test11 = ExtractRouteParams<"/api/:version/items/:itemId">; // { version: string; itemId: string }

// Example 7: State Machine Types
type TrafficLight = "red" | "yellow" | "green";

type Transitions = {
  red: "green";
  yellow: "red";
  green: "yellow";
};

type Next<State extends TrafficLight> = Transitions[State];

type Test12 = Next<"red">; // "green"
type Test13 = Next<"green">; // "yellow"

class TrafficLightMachine<State extends TrafficLight = "red"> {
  constructor(private state: State) {}

  transition<NewState extends Transitions[State]>(
    _to: NewState
  ): TrafficLightMachine<NewState> {
    return new TrafficLightMachine(this.state as any);
  }

  getState(): State {
    return this.state;
  }
}

// Usage with compile-time validation
const light = new TrafficLightMachine("red");
const light2 = light.transition("green"); // OK
// const light3 = light.transition("yellow"); // Error: Argument of type '"yellow"' is not assignable

// Example 8: Recursive Deep Partial
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type PartialUser = DeepPartial<User>;
// All properties optional, including nested ones

// Example 9: Tuple to Union
type TupleToUnion<T extends readonly unknown[]> = T[number];

type Test14 = TupleToUnion<["a", "b", "c"]>; // "a" | "b" | "c"

// Example 10: Function Parameter Names
type GetParamNames<T> = T extends (...args: infer P) => any
  ? P extends [infer First, ...infer Rest]
    ? First extends { [key: string]: any }
      ? keyof First | GetParamNames<(...args: Rest) => any>
      : GetParamNames<(...args: Rest) => any>
    : never
  : never;

// Example 11: Type-Safe Query Builder
interface QueryBuilder<T, Selected extends keyof T = never> {
  select<K extends keyof T>(...keys: K[]): QueryBuilder<T, Selected | K>;
  where(predicate: (row: T) => boolean): QueryBuilder<T, Selected>;
  execute(): Promise<Pick<T, Selected>[]>;
}

// Example 12: Type-level Validation
type IsEmail<T extends string> = T extends `${string}@${string}.${string}` ? true : false;

type Test15 = IsEmail<"test@example.com">; // true
type Test16 = IsEmail<"invalid">; // false

// Example 13: Branded Types with Validation
declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

type PositiveNumber = Brand<number, "Positive">;
type Email = Brand<string, "Email">;

function createPositive(n: number): PositiveNumber | null {
  return n > 0 ? (n as PositiveNumber) : null;
}

function createEmail(s: string): Email | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(s) ? (s as Email) : null;
}

export {
  Inc,
  Dec,
  Split,
  Get,
  Set,
  ExtractRouteParams,
  Next,
  TrafficLightMachine,
  DeepPartial,
  TupleToUnion,
  QueryBuilder,
  IsEmail,
  PositiveNumber,
  Email,
  createPositive,
  createEmail,
};
