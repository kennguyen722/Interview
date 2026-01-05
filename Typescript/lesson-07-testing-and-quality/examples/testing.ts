// Example 1: Unit tests with Vitest
import { describe, it, expect, beforeEach } from "vitest";

function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

describe("math functions", () => {
  describe("add", () => {
    it("adds two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("handles negative numbers", () => {
      expect(add(-1, 1)).toBe(0);
    });

    it("handles zero", () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe("subtract", () => {
    it("subtracts two numbers", () => {
      expect(subtract(5, 3)).toBe(2);
    });
  });
});

// Example 2: Type-level tests with expectTypeOf
import { expectTypeOf } from "vitest";

interface User {
  id: string;
  name: string;
  email?: string;
}

function createUser(id: string, name: string): User {
  return { id, name };
}

describe("type assertions", () => {
  it("infers User type correctly", () => {
    const user = createUser("1", "Ada");
    expectTypeOf(user).toMatchTypeOf<User>();
    expectTypeOf(user.id).toBeString();
    expectTypeOf(user.email).toBeUndefined();
  });

  it("handles as const correctly", () => {
    const user = { id: "1", name: "Ada" } as const;
    expectTypeOf(user.id).toMatchTypeOf<"1">();
    expectTypeOf(user.name).toMatchTypeOf<"Ada">();
  });
});

// Example 3: Mocking and fixtures
interface ApiResponse {
  success: boolean;
  data?: { id: string; name: string };
  error?: string;
}

async function fetchUser(id: string): Promise<ApiResponse> {
  // Simulate API call
  return {
    success: true,
    data: { id, name: "Test User" },
  };
}

describe("API mocking", () => {
  it("handles successful response", async () => {
    const response = await fetchUser("123");
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBe("123");
  });
});

// Example 4: vitest.config.ts setup
const vitestConfig = {
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
};

export { add, subtract, createUser, fetchUser, User };
