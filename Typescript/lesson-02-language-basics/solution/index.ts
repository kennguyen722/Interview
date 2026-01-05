// Solution 1: formatUser function
interface FormatUserInput {
  id: string | number;
  name?: string;
}

function formatUser(user: FormatUserInput): string {
  const displayName = user.name ?? "Unknown";
  
  if (typeof user.id === "string") {
    return `User: ${displayName} (ID: ${user.id.toUpperCase()})`;
  } else {
    return `User: ${displayName} (ID: ${user.id})`;
  }
}

console.log(formatUser({ id: "123", name: "Ada" })); // User: Ada (ID: 123)
console.log(formatUser({ id: 456 })); // User: Unknown (ID: 456)
console.log(formatUser({ id: "user-789", name: "Bob" })); // User: Bob (ID: USER-789)

// Solution 2: API Response discriminated union
type ApiState =
  | { status: "pending" }
  | { status: "complete"; data: unknown }
  | { status: "failed"; error: string };

function renderApiState(state: ApiState): string {
  switch (state.status) {
    case "pending":
      return "Request in progress...";
    case "complete":
      return `Success! Data: ${JSON.stringify(state.data)}`;
    case "failed":
      return `Error occurred: ${state.error}`;
  }
}

console.log(renderApiState({ status: "pending" })); // Request in progress...
console.log(renderApiState({ status: "complete", data: { count: 42 } })); // Success! Data: {"count":42}
console.log(renderApiState({ status: "failed", error: "Network timeout" })); // Error occurred: Network timeout

// Solution 3: Parse function with tuple return
type ParseResult = [data: unknown, error: null] | [data: null, error: Error];

function parseJsonSafe(input: string): ParseResult {
  try {
    const data = JSON.parse(input);
    return [data, null];
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return [null, error];
  }
}

// Test parseJsonSafe
const [data1, err1] = parseJsonSafe('{"name":"Ada"}');
if (data1) {
  console.log("Parsed:", data1); // Parsed: { name: 'Ada' }
} else {
  console.log("Error:", err1);
}

const [data2, err2] = parseJsonSafe("invalid json");
if (data2) {
  console.log("Parsed:", data2);
} else {
  console.log("Parse error:", err2?.message); // Parse error: Unexpected token...
}

export { formatUser, renderApiState, parseJsonSafe };
