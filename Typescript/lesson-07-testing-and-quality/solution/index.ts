// Solution 1: Sum function with tests
function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Tests for sum
import { describe, it, expect } from "vitest";

describe("sum", () => {
  it("returns 0 for empty array", () => {
    expect(sum([])).toBe(0);
  });

  it("returns the number for single element", () => {
    expect(sum([5])).toBe(5);
  });

  it("sums multiple positive numbers", () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
  });

  it("handles negative numbers", () => {
    expect(sum([-1, 1, -2, 2])).toBe(0);
  });

  it("handles mix of positive and negative", () => {
    expect(sum([10, -5, 3, -2])).toBe(6);
  });
});

// Solution 2: Type-level testing
import { expectTypeOf } from "vitest";

interface User {
  id: string;
  name: string;
}

function createUserType(id: string, name: string): User {
  return { id, name };
}

describe("type-level assertions", () => {
  it("verifies User type structure", () => {
    const user = createUserType("123", "Ada");
    
    expectTypeOf(user).toMatchTypeOf<User>();
    expectTypeOf(user.id).toBeString();
    expectTypeOf(user.name).toBeString();
  });

  it("handles as const literals", () => {
    const user = { id: "user-123", name: "Ada" } as const;
    
    // With as const, types become literal types
    expectTypeOf(user.id).toMatchTypeOf<"user-123">();
    expectTypeOf(user.name).toMatchTypeOf<"Ada">();
  });
});

// Solution 3: Runtime validation with zod
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name cannot be empty"),
});

type UserInput = z.infer<typeof UserSchema>;

describe("zod validation", () => {
  it("validates correct user data", () => {
    const validData = {
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
    };

    const result = UserSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rejects invalid email", () => {
    const invalidData = {
      id: "user-1",
      email: "not-an-email",
      name: "Ada",
    };

    const result = UserSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid email");
    }
  });

  it("rejects empty name", () => {
    const invalidData = {
      id: "user-1",
      email: "ada@example.com",
      name: "",
    };

    const result = UserSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("cannot be empty");
    }
  });

  it("rejects missing fields", () => {
    const incompleteData = {
      id: "user-1",
      // missing email and name
    };

    const result = UserSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);
  });
});

export { sum, createUserType, UserSchema, UserInput };
