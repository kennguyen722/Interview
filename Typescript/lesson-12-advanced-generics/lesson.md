# Lesson 12: Advanced Generics and Type Constraints

## Goals
- Master variance, higher-kinded types, and generic constraints
- Build type-safe builders and fluent APIs
- Implement recursive types and variadic generics
- Use infer keyword patterns and template literal types

## Advanced Generic Constraints

### Variance (covariance and contravariance)
```ts
// Covariance: array of subtypes can be array of supertypes
interface Animal { name: string }
interface Dog extends Animal { breed: string }

const dogs: Dog[] = [{ name: "Rex", breed: "Labrador" }];
const animals: Animal[] = dogs; // ✓ OK: arrays are covariant

// Contravariance: function parameters
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

const handleAnimal: AnimalHandler = (animal) => console.log(animal.name);
const handleDog: DogHandler = handleAnimal; // ✓ OK: functions are contravariant in parameters
```

### Higher-order generics
```ts
type Container<T> = { value: T };
type Mapper<F> = F extends Container<infer T> ? (fn: (val: T) => any) => Container<ReturnType<typeof fn>> : never;
```

### Recursive type constraints
```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

## Builder Pattern with Type Safety

```ts
class UserBuilder<T extends Partial<User> = {}> {
  private data: T = {} as T;

  withName<N extends string>(name: N): UserBuilder<T & { name: N }> {
    return new UserBuilder<T & { name: N }>().merge({ ...this.data, name });
  }

  withEmail<E extends string>(email: E): UserBuilder<T & { email: E }> {
    return new UserBuilder<T & { email: E }>().merge({ ...this.data, email });
  }

  build(this: UserBuilder<User>): User {
    return this.data;
  }

  private merge<U>(data: U): UserBuilder<U> {
    const builder = new UserBuilder<U>();
    builder.data = data;
    return builder;
  }
}

// Usage: build() only available when all required fields are present
const user = new UserBuilder()
  .withName("Ada")
  .withEmail("ada@example.com")
  .build(); // ✓ OK
```

## Variadic Tuple Types

```ts
// Type-safe function composition
type Func<T, U> = (arg: T) => U;

function pipe<A, B>(f1: Func<A, B>): Func<A, B>;
function pipe<A, B, C>(f1: Func<A, B>, f2: Func<B, C>): Func<A, C>;
function pipe<A, B, C, D>(f1: Func<A, B>, f2: Func<B, C>, f3: Func<C, D>): Func<A, D>;
function pipe(...fns: Func<any, any>[]): Func<any, any> {
  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}
```

## Template Literal Types

```ts
type EventName = "click" | "focus" | "blur";
type EventHandler<E extends EventName> = `on${Capitalize<E>}`;
// Result: "onClick" | "onFocus" | "onBlur"

type Route = `/api/${"users" | "posts"}/${string}`;
// Matches: /api/users/123, /api/posts/abc, etc.
```

## Infer Patterns

```ts
// Extract function return type deeply
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Extract constructor parameters
type ConstructorParams<T> = T extends new (...args: infer P) => any ? P : never;
```

## Exercises
- Build a type-safe QueryBuilder with chainable `where`, `orderBy`, and `limit` methods
- Implement `Curry<F>` that converts a multi-param function to nested single-param functions
- Create `PathOf<T>` that generates union of all possible object paths like "user.address.city"
- Build a `Pipe` utility that infers types through 5+ function compositions
