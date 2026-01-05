// Solution 1: Migrate math functions to TypeScript
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

export { add, multiply };

// Solution 2: Replace any with proper types
// ❌ Before:
// function process(data: any): any { ... }
// const result: any = await fetch(...);
// const items: any[] = [];

// ✅ After with generics:
function process<T>(data: T): T {
  return data;
}

// ✅ After with proper response typing:
interface ApiResponse {
  status: number;
  data: unknown;
}

async function fetchData(url: string): Promise<ApiResponse> {
  const response = await fetch(url);
  return response.json() as ApiResponse;
}

// ✅ After with type parameter:
function createItems<T>(items: T[]): T[] {
  return items;
}

// Solution 3: Interview question answers

/**
 * 1. Structural vs Nominal Typing
 * 
 * Structural: Two types are compatible if they have the same shape
 * - TypeScript uses structural typing
 * - interface User { name: string } and type Person = { name: string } are compatible
 * - Pros: flexible, less boilerplate
 * - Cons: accidental compatibility
 * 
 * Nominal: Types are compatible only if explicitly related
 * - Languages like Java, C# use nominal typing
 * - Can use branded types in TypeScript to simulate nominal typing
 * - type UserId = string & { __brand: "UserId" }
 */

/**
 * 2. unknown vs any vs never vs void
 * 
 * any: Bypass type checking completely (avoid!)
 * unknown: Safe, requires type guard before use
 *   - catch (err: unknown) { if (err instanceof Error) ... }
 * 
 * void: Function returns no value (used in return type)
 *   - function log(msg: string): void { console.log(msg); }
 * 
 * never: Impossible type, function never returns
 *   - function fail(msg: string): never { throw new Error(msg); }
 *   - Used in exhaustive switch statements: default: assertNever(x);
 */

/**
 * 3. Discriminated unions and exhaustiveness
 * 
 * Use a common property to distinguish union members
 * Type system ensures all cases are handled:
 * 
 * type Result = { status: "ok"; value: string } | { status: "error"; message: string };
 * 
 * switch (result.status) {
 *   case "ok": return result.value;
 *   case "error": return result.message;
 *   default: assertNever(result.status); // Compile error if case missing
 * }
 */

/**
 * 4. Typing function that accepts key and returns value
 * 
 * function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
 *   return obj[key];
 * }
 * 
 * const user = { id: "1", name: "Ada" };
 * const id = getProperty(user, "id"); // type: string
 * getProperty(user, "invalid"); // ❌ Error: not a key of user
 */

/**
 * 5. as const usage and effects
 * 
 * const x = "hello"; // type: string
 * const y = "hello" as const; // type: "hello"
 * 
 * Literal types: enables precise type narrowing
 * Makes object properties readonly: const cfg = { port: 3000 } as const;
 * Useful for: literal unions, branded types, readonly tuples
 */

/**
 * 6. Promise.all vs Promise.allSettled
 * 
 * Promise.all<[Promise<A>, Promise<B>]>: Promise<[A, B]>
 * - Rejects immediately on first error
 * - Result is tuple of values
 * 
 * Promise.allSettled<[Promise<A>, Promise<B>]>: Promise<[PromiseSettledResult<A>, PromiseSettledResult<B>]>
 * - Never rejects, returns status + result/reason for each
 * - Better for best-effort operations
 */

/**
 * 7. Typed useFetch hook
 * 
 * function useFetch<T>(url: string) {
 *   const [state, setState] = useState<
 *     | { status: "idle" }
 *     | { status: "loading" }
 *     | { status: "success"; data: T }
 *     | { status: "error"; error: Error }
 *   >({ status: "idle" });
 * 
 *   return state;
 * }
 * 
 * Usage: const { status, data } = useFetch<User>("/api/user");
 */

export { add, multiply, process, fetchData, createItems };
