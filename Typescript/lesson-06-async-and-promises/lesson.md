# Lesson 06: Async and Promises

## Goals
- Type Promises and async functions correctly.
- Model errors and results explicitly.
- Handle concurrency patterns.

## Promise typing
```ts
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
```
`Promise<T>` resolves to `T`; rejected paths are not typed—use Result types to model errors explicitly.

## Result pattern
```ts
type Ok<T> = { ok: true; value: T };
type Err<E = Error> = { ok: false; error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: new Error(res.statusText) };
    return { ok: true, value: (await res.json()) as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
```

## Concurrency helpers
- `Promise.all` returns `Promise<[T1, T2, ...]>`; rejects fast on first error.
- `Promise.allSettled` returns statuses—good for best-effort tasks.
- `Promise.race` / `Promise.any` for first-completer scenarios.

```ts
const [user, posts] = await Promise.all([
  fetchUser("1"),
  fetchPosts("1"),
]);
```

## Cancellation (cooperative)
Use `AbortController` with fetch and pass `signal` to downstream functions.
```ts
const ac = new AbortController();
setTimeout(() => ac.abort(), 5000);
const res = await fetch(url, { signal: ac.signal });
```

## Error typing tips
- Narrow errors with `instanceof Error` or custom guards.
- Provide richer error objects instead of strings.
- Avoid `any` in catch clauses: `catch (err: unknown) { ... }`.

## Exercises
- Implement `withTimeout<T>(p: Promise<T>, ms: number): Promise<T>` that rejects with `Error` after `ms`.
- Create a typed `retry` helper with a max attempt count and exponential backoff.
- Use `Result` to wrap a pair of API calls and render either combined data or a friendly error message.
