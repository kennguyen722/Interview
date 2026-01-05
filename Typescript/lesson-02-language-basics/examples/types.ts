// Example 1: Type annotations and inference
const count = 0; // Inferred as number
const userName: string = "Ada"; // Explicit annotation
const isActive: boolean = true;

// Example 2: Union types
type UserId = string | number;

function displayId(id: UserId) {
  console.log(`ID: ${id}`);
}

displayId("user-123"); // ✓ OK
displayId(456); // ✓ OK
// displayId(true); // ❌ Error: boolean is not UserId

// Example 3: Literal types
type Direction = "up" | "down" | "left" | "right";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const move: Direction = "up"; // ✓ OK
// const invalid: Direction = "forward"; // ❌ Error

// Example 4: Type aliases vs interfaces
type Point = { x: number; y: number };
interface PointInterface {
  x: number;
  y: number;
}

// Interfaces are more extensible:
interface Drawable {
  draw(): void;
}

interface Circle extends Drawable {
  radius: number;
}

// Type aliases work with unions:
type Shape = Point | Circle;

// Example 5: Narrowing
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(`String ID: ${id.toUpperCase()}`);
  } else {
    console.log(`Numeric ID: ${id.toFixed(2)}`);
  }
}

printId("user-123"); // String ID: USER-123
printId(456.789); // Numeric ID: 456.79

// Example 6: Discriminated unions
type ApiResponse =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; message: string };

function handleResponse(response: ApiResponse): string {
  switch (response.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Success: ${response.data}`;
    case "error":
      return `Error: ${response.message}`;
  }
}

console.log(handleResponse({ status: "loading" })); // Loading...
console.log(handleResponse({ status: "success", data: "Hello!" })); // Success: Hello!

// Example 7: Functions with types
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string = "Dev", greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

function fail(message: string): never {
  throw new Error(message);
}

// Example 8: Arrays and tuples
const numbers: number[] = [1, 2, 3];
const stringArray: Array<string> = ["a", "b", "c"];
const pair: [string, number] = ["age", 30];
const tuple: [string, number, boolean] = ["test", 42, true];

// Example 9: Optional properties
interface User {
  id: string;
  name: string;
  email?: string; // Optional
  age?: number;
}

const user1: User = { id: "1", name: "Ada" }; // ✓ OK
const user2: User = { id: "2", name: "Bob", email: "bob@example.com" }; // ✓ OK

export { displayId, printId, handleResponse, add, greet, User };
