// Example 1: Variance in TypeScript
interface Animal {
  name: string;
  makeSound(): string;
}

interface Dog extends Animal {
  breed: string;
}

interface Cat extends Animal {
  indoor: boolean;
}

// Covariance in arrays
const dogs: Dog[] = [
  { name: "Rex", breed: "Labrador", makeSound: () => "Woof" },
  { name: "Max", breed: "Beagle", makeSound: () => "Woof" },
];

const animals: Animal[] = dogs; // ✓ OK: Dog[] is assignable to Animal[]

// Contravariance in function parameters
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

const logAnimal: AnimalHandler = (animal) => {
  console.log(`${animal.name} says ${animal.makeSound()}`);
};

const handleDog: DogHandler = logAnimal; // ✓ OK: contravariance

// Example 2: Higher-order generics and type manipulation
type Box<T> = { value: T };
type Unwrap<T> = T extends Box<infer U> ? U : T;

type StringBox = Box<string>;
type UnwrappedString = Unwrap<StringBox>; // string

// Example 3: Recursive types
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
// All nested properties are readonly

// Example 4: Builder Pattern with Type State
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

class TypeSafeUserBuilder<T extends Partial<User> = {}> {
  private data: T;

  constructor(initialData: T = {} as T) {
    this.data = initialData;
  }

  withId<ID extends string>(id: ID): TypeSafeUserBuilder<T & { id: ID }> {
    return new TypeSafeUserBuilder({ ...this.data, id } as T & { id: ID });
  }

  withName<N extends string>(name: N): TypeSafeUserBuilder<T & { name: N }> {
    return new TypeSafeUserBuilder({ ...this.data, name } as T & { name: N });
  }

  withEmail<E extends string>(email: E): TypeSafeUserBuilder<T & { email: E }> {
    return new TypeSafeUserBuilder({ ...this.data, email } as T & { email: E });
  }

  withAge(age: number): TypeSafeUserBuilder<T & { age: number }> {
    return new TypeSafeUserBuilder({ ...this.data, age } as T & { age: number });
  }

  // build() only callable when required fields are present
  build(
    this: TypeSafeUserBuilder<{ id: string; name: string; email: string } & Partial<User>>
  ): User {
    return this.data as User;
  }
}

// Usage
const user = new TypeSafeUserBuilder()
  .withId("123")
  .withName("Ada Lovelace")
  .withEmail("ada@example.com")
  .build(); // ✓ OK

// const incomplete = new TypeSafeUserBuilder().withId("1").build(); // ❌ Error

// Example 5: Variadic tuple types
type Func<T, U> = (arg: T) => U;

function compose<A, B>(f1: Func<A, B>): Func<A, B>;
function compose<A, B, C>(f1: Func<B, C>, f2: Func<A, B>): Func<A, C>;
function compose<A, B, C, D>(f1: Func<C, D>, f2: Func<B, C>, f3: Func<A, B>): Func<A, D>;
function compose(...fns: Func<any, any>[]): Func<any, any> {
  return (arg: any) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const toString = (x: number) => `Result: ${x}`;

const combined = compose(toString, double, addOne);
console.log(combined(5)); // "Result: 12"

// Example 6: Template literal types
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "users" | "posts" | "comments";
type APIRoute = `/${Endpoint}` | `/${Endpoint}/${string}`;

type RouteHandler = {
  [K in `${Lowercase<HTTPMethod>}${Capitalize<Endpoint>}`]: (
    id?: string
  ) => Promise<any>;
};

// Result type has: getUsers, postUsers, putUsers, deleteUsers, getPosts, etc.

// Example 7: Advanced infer patterns
type FunctionReturnDeep<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer U>
    ? U
    : R
  : never;

async function fetchUser() {
  return { id: "1", name: "Ada" };
}

type UserType = FunctionReturnDeep<typeof fetchUser>; // { id: string; name: string }

// Example 8: Conditional type inference
type IsArray<T> = T extends any[] ? true : false;
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

type ArrayCheck = IsArray<string[]>; // true
type FnCheck = IsFunction<() => void>; // true

export {
  Animal,
  Dog,
  DeepReadonly,
  TypeSafeUserBuilder,
  compose,
  HTTPMethod,
  APIRoute,
  FunctionReturnDeep,
};
