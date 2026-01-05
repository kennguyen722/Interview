# Lesson 02: Language Basics

## Goals
- Build intuition for type annotations and inference.
- Use unions, intersections, and literal types.
- Perform control-flow narrowing safely.

## Concepts and examples
### Annotation vs inference
```ts
let count = 0; // inferred number
const userName: string = "Ada"; // explicit annotation
```

### Primitive and literal types
```ts
let id: string | number;
const direction: "up" | "down" = "up";
```

### Unions and intersections
```ts
type ApiId = string | number;
type Timestamped = { createdAt: Date };
type Entity = { id: ApiId } & Timestamped;
```

### Type aliases vs interfaces
```ts
type Point = { x: number; y: number };
interface HasId { id: string }
```
Use `interface` for extensible object shapes; use `type` for unions, primitives, and utility composition.

### Narrowing
```ts
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```
Other narrowing tools: truthiness checks, `in` operator, discriminated unions.

### Discriminated unions
```ts
type Result =
  | { kind: "ok"; value: string }
  | { kind: "error"; message: string };

function handle(r: Result) {
  if (r.kind === "ok") return r.value;
  return `Failed: ${r.message}`;
}
```

### Functions
- Parameter/return types: `function add(a: number, b: number): number { ... }`
- Optional params: `function log(msg: string, meta?: object) { ... }`
- Default params inherit type: `function greet(name = "dev") { ... }`
- Never-returning functions use `never`: `function fail(msg: string): never { throw new Error(msg); }`

### Arrays and tuples
```ts
const nums: number[] = [1, 2, 3];
const pair: [string, number] = ["age", 42];
```

## Exercises
- Write a `formatUser` that accepts `{ id: string|number, name?: string }` and returns a friendly string using narrowing.
- Create a discriminated union for API responses (`loading`, `success`, `error`) and a function that renders a message per state.
- Use a tuple to return `[result, error]` from a function that can fail.
