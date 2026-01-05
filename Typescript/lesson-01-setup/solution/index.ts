// Solution 1: Create index.ts that logs Node version
import * as os from "os";

console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`CPU count: ${os.cpus().length}`);

// Solution 2: Fixed tsconfig.json structure (in file, not here)
// Strict mode: true, with all recommended options enabled

// Solution 3: Strict mode fixes

// Problem 1: Handle optional/undefined user
interface User {
  name: string;
}

function greet(user: User | undefined) {
  if (!user) {
    console.log("Hello, Guest!");
    return;
  }
  console.log(`Hello, ${user.name}`);
}

// Problem 2: Handle optional array access
function getFirstItem(items: number[]): number | undefined {
  const first = items[0];
  if (first === undefined) {
    return undefined;
  }
  return first;
}

// Alternative using optional chaining:
function getFirstItemAlt(items: number[]): number | undefined {
  return items[0];
}

// Problem 3: Add explicit return type
function calculate(x: number, y: number): number {
  return x + y;
}

// Test the solutions
greet(undefined); // Hello, Guest!
greet({ name: "Ada" }); // Hello, Ada!

const numbers = [1, 2, 3];
const firstNum = getFirstItem(numbers); // 1
console.log(`First number: ${firstNum}`);

const sum = calculate(5, 3); // 8
console.log(`Sum: ${sum}`);

export { greet, getFirstItem, calculate };
