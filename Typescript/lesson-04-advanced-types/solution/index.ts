// Solution 1: deepFreeze function
// NOTE: Readonly<T> is only shallowly typed - nested objects remain mutable
function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as Record<string, unknown>)[prop];
    if (value !== null && (typeof value === "object" || typeof value === "function")) {
      deepFreeze(value);
    }
  });
  return obj as Readonly<T>;
}

interface NestedUser {
  name: string;
  address: { street: string; city: string };
}

const user: NestedUser = {
  name: "Ada",
  address: { street: "123 Main St", city: "Seattle" }
};

const frozen = deepFreeze(user);
// frozen.name = "Bob"; // ❌ Runtime error (frozen)
// frozen.address.city = "Portland"; // ❌ Runtime error (nested frozen)

console.log("Frozen user:", frozen);

// Solution 2: Values type utility
type Values<T> = T[keyof T];

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

type ProductValue = Values<Product>; // string | number | boolean

// Test Values utility
const values: ProductValue[] = ["id-123", "Widget", 9.99, true];

// Solution 3: Brand type for nominal typing
type Brand<T, B> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type ProductId = Brand<string, "ProductId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

function getUserById(userId: UserId): string {
  return `Getting user: ${userId}`;
}

const userId = createUserId("user-123");
const productId = createProductId("prod-456");

console.log(getUserById(userId)); // ✓ OK
// console.log(getUserById(productId)); // ❌ Error: ProductId is not assignable to UserId
// console.log(getUserById("user-123")); // ❌ Error: string is not assignable to UserId

// Even though at runtime they're just strings, the type system keeps them separate!

export { deepFreeze, Values, Brand, UserId, ProductId, createUserId, createProductId };
