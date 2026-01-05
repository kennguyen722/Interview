// Example 1: Promise typing and async functions
async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  // In real code, would use fetch
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Ada" }), 100);
  });
}

// Example 2: Result pattern for error handling
type Ok<T> = { ok: true; value: T };
type Err<E = Error> = { ok: false; error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    // Simulated fetch
    await new Promise((resolve) => setTimeout(resolve, 50));
    const data = { id: "1" } as T;
    return { ok: true, value: data };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { ok: false, error };
  }
}

// Example 3: Promise.all for concurrent operations
async function fetchUserWithPosts(userId: string) {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
  ]);
  return { user, posts };
}

async function fetchPosts(userId: string): Promise<Array<{ id: string; title: string }>> {
  return [
    { id: "1", title: "First Post" },
    { id: "2", title: "Second Post" },
  ];
}

// Example 4: Promise.allSettled for best-effort
async function fetchMultipleUsers(ids: string[]) {
  const results = await Promise.allSettled(ids.map((id) => fetchUser(id)));
  return results.filter((r) => r.status === "fulfilled").map((r) => (r as PromiseFulfilledResult<any>).value);
}

// Example 5: AbortController for cancellation
async function fetchWithAbort(url: string, timeoutMs: number) {
  const ac = new AbortController();
  const timeoutId = setTimeout(() => ac.abort(), timeoutMs);
  try {
    // return await fetch(url, { signal: ac.signal });
    return "fetched";
  } finally {
    clearTimeout(timeoutId);
  }
}

// Example 6: Error handling in async/await
async function riskyOperation(): Promise<string> {
  try {
    await new Promise((_, reject) => reject(new Error("Something went wrong")));
    return "success";
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error("Unknown error");
    }
    throw err;
  }
}

// Example 7: Race conditions
async function fetchFirstAvailable(urls: string[]): Promise<string> {
  try {
    // return await Promise.race(urls.map((url) => fetch(url)));
    return "first result";
  } catch (err) {
    throw new Error("All fetches failed");
  }
}

export { fetchUser, fetchPosts, fetchUserWithPosts, fetchMultipleUsers, fetchWithAbort, Result, isOk };
