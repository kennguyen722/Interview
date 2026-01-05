# Lesson 03: Objects and Classes

## Goals
- Model shapes with interfaces and type aliases.
- Use readonly, index signatures, and optional properties.
- Write idiomatic classes with visibility modifiers and implements.

## Interfaces and structural typing
TypeScript is structural: shapes matter more than names.
```ts
interface User { id: string; name: string; email?: string }
function sendEmail(u: User) { /* ... */ }
const admin = { id: "1", name: "Root", email: "root@example.com", role: "admin" };
sendEmail(admin); // OK: has required shape
```

## Readonly and exactness
```ts
interface Config {
  readonly apiKey: string;
  retries?: number;
}
const cfg: Config = { apiKey: "xyz" };
// cfg.apiKey = "abc"; // error
```

## Index signatures and records
```ts
interface StringMap { [key: string]: string }
const translations: Record<string, string> = { hello: "xin chao" };
```

## Classes and implements
```ts
interface Repo<T> {
  get(id: string): T | undefined;
  save(entity: T): void;
}

class MemoryRepo<T extends { id: string }> implements Repo<T> {
  #store = new Map<string, T>();

  get(id: string) {
    return this.#store.get(id);
  }

  save(entity: T) {
    this.#store.set(entity.id, entity);
  }
}
```
Private fields use `#` (runtime-enforced). Use `protected` for subclass access.

## Parameter properties and readonly fields
```ts
class Point {
  constructor(public readonly x: number, public readonly y: number) {}
}
```

## Getters/setters
```ts
class Person {
  #age = 0;
  get age() { return this.#age; }
  set age(value: number) {
    if (value < 0) throw new Error("age must be positive");
    this.#age = value;
  }
}
```

## Exercises
- Define `ServiceConfig` with required `url`, optional `timeout`, and readonly `token`.
- Implement a `Queue<T>` class with `enqueue`, `dequeue`, and `size` getters.
- Create a `Repository<T>` interface and a `FileRepo` stub that `implements Repository` but throws `Error` in methods (to be filled later).
