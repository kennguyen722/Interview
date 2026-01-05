// Example 1: Gradual migration from JavaScript
// Original JS code (before migration)
/*
function formatUser(user) {
  return `${user.name} <${user.email}>`;
}

function getUserAge(user) {
  return new Date().getFullYear() - user.birthYear;
}

module.exports = { formatUser, getUserAge };
*/

// Step 1: Enable checkJs in tsconfig, types appear as hints
// Step 2: Convert to .ts and add minimal types
interface User {
  name: string;
  email: string;
  birthYear: number;
}

function formatUser(user: User): string {
  return `${user.name} <${user.email}>`;
}

function getUserAge(user: User): number {
  return new Date().getFullYear() - user.birthYear;
}

export { formatUser, getUserAge, User };

// Example 2: Pitfalls to avoid
// ❌ Avoid: overly wide types
type BadConfig = object; // Too wide, loses structure
type BadData = any; // Loses all type safety

// ✅ Good: specific types
interface Config {
  debug: boolean;
  port: number;
}

interface Data {
  id: string;
  value: unknown; // Use unknown when you need to check at runtime
}

// ❌ Avoid: forgetting error types in catch
// function risky() {
//   try {
//     // ...
//   } catch (err) {
//     // err has type 'any' here!
//   }
// }

// ✅ Good: type errors properly
function safeRisky() {
  try {
    // ...
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(message);
  }
}

// Example 3: Refactoring patterns
// Avoid repeating types
// ❌ Bad: scattered type definitions
function api1() {
  return { id: "1", name: "test" };
}
function api2() {
  return { id: "2", name: "test" };
}

// ✅ Good: centralized types
interface Entity {
  id: string;
  name: string;
}

function goodApi1(): Entity {
  return { id: "1", name: "test" };
}
function goodApi2(): Entity {
  return { id: "2", name: "test" };
}

// Example 4: as const for literal types
const direction1 = "up"; // type: string
const direction2 = "up" as const; // type: "up"

type Direction = typeof direction2; // "up"

// Example 5: Branded types to avoid ID confusion
type UserId = string & { readonly __brand: "UserId" };
type ProductId = string & { readonly __brand: "ProductId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

function getUser(id: UserId) {
  console.log(`Getting user ${id}`);
}

// getUser(createProductId("123")); // ❌ Error: ProductId is not UserId

export { Config, Data, safeRisky, Entity, Direction, UserId, ProductId, createUserId, createProductId, getUser };
