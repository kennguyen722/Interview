// Exercise 1: Initialize project structure and verify TypeScript works
// TODO: Create src/index.ts and log Node.js version

// Exercise 2: tsconfig exploration
// TODO: Create tsconfig.json with strict: true
// TODO: Try setting strict: false and observe which errors disappear
// TODO: Restore strict: true

// Exercise 3: Strict mode awareness
// Uncomment and fix these according to strict mode requirements:

// Problem 1: This function could receive undefined
// function greet(user: { name: string }) {
//   console.log(`Hello, ${user.name}`);
// }

// Problem 2: Array access could be undefined
// function getFirstItem(items: number[]) {
//   console.log(items[0].toString()); // ❌ Potential undefined
// }

// Problem 3: Missing return type leads to implicit any
// function calculate(x, y) {
//   return x + y;
// }

export {};
