# Lesson 10: Patterns and Architecture

## Goals
- Model domains with rich types.
- Use error/result types for safer flows.
- Encode state machines and exhaustive checks.

## Domain modeling
```ts
type Money = { amount: number; currency: "USD" | "EUR" };
type User = { id: string; email: string; role: "admin" | "member" };
```
Prefer narrow literals and unions to avoid magic strings.

## Result/Either style
```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
function unwrap<T, E>(r: Result<T, E>): T {
  if (!r.ok) throw r.error;
  return r.value;
}
```

## Exhaustive switching
```ts
function renderStatus(status: "idle" | "loading" | "done") {
  switch (status) {
    case "idle": return "Idle";
    case "loading": return "Loading";
    case "done": return "Done";
    default: assertNever(status);
  }
}

function assertNever(x: never): never { throw new Error(`Unexpected: ${x}`); }
```

## State machines with discriminated unions
```ts
type AuthState =
  | { tag: "loggedOut" }
  | { tag: "loggingIn" }
  | { tag: "loggedIn"; user: { id: string } }
  | { tag: "error"; message: string };
```
Use reducers to transition between states; exhaustiveness catches missing cases.

## Dependency injection and interfaces
Inject abstractions for IO to keep domain pure.
```ts
interface EmailSender { send(to: string, body: string): Promise<void> }
function inviteUser(sender: EmailSender, email: string) {
  return sender.send(email, "welcome");
}
```

## Immutable data
Prefer object spreads and readonly arrays to avoid mutation bugs. Enable `noImplicitThis` and `noUncheckedIndexedAccess`.

## Exercises
- Implement `assertNever` and use it in a reducer over `AuthState` above.
- Define an interface `Cache` with `get/set/delete` and create an in-memory implementation.
- Model an order lifecycle (`created`, `paid`, `shipped`, `delivered`, `cancelled`) and ensure a `transition` function forbids invalid moves.
