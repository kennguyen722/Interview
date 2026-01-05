# Lesson 04: Advanced Types

## Goals
- Master generics and constraints.
- Use mapped, indexed access, and conditional types.
- Apply standard utility types.

## Generics
```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Mapped types
```ts
type Optional<T> = { [K in keyof T]?: T[K] };
type ReadonlyDeep<T> = { readonly [K in keyof T]: ReadonlyDeep<T[K]> };
```

## Indexed access and keyof
```ts
type User = { id: string; name: string; email?: string };
type UserId = User["id"]; // string
const keys: (keyof User)[] = ["id", "name", "email"];
```

## Conditional types
```ts
type Awaited<T> = T extends Promise<infer U> ? U : T;
type NonNullable<T> = T extends null | undefined ? never : T;
```

## Distributive conditionals
```ts
type ToArray<T> = T extends any ? T[] : never;
// ToArray<string | number> -> string[] | number[]
```

## Utility types (built-in)
- `Partial<T>`: all props optional.
- `Required<T>`: all props required.
- `Pick<T, K>` / `Omit<T, K>`: select or drop keys.
- `Record<K, V>`: map keys to values.
- `ReturnType<F>` and `Parameters<F>`: derive from functions.
- `Extract` / `Exclude`: filter unions.
- `Readonly<T>`: shallow readonly.

## Example: API DTO to domain model
```ts
type UserDto = { id: string; name: string; email?: string; created_at: string };

type CamelCaseUser = Pick<UserDto, "id" | "name" | "email"> & { createdAt: Date };

function mapUser(dto: UserDto): CamelCaseUser {
  const { created_at, ...rest } = dto;
  return { ...rest, createdAt: new Date(created_at) };
}
```

## Exercises
- Write `deepFreeze<T>(obj: T): Readonly<T>` and discuss why it is only shallowly typed.
- Implement `Values<T>` that produces a union of value types of an object.
- Create `Brand<T, B>` that intersects `T` with `{ __brand: B }` for nominal typing; use it for `UserId`.
