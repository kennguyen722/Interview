import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fc from "fast-check";

// Example 1: Property-Based Testing - Array Operations
describe("Array property tests", () => {
  test("reversing twice returns original array", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const original = [...arr];
        const reversed = arr.reverse().reverse();
        expect(reversed).toEqual(original);
      })
    );
  });

  test("concatenation length equals sum of lengths", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (arr1, arr2) => {
        const concatenated = [...arr1, ...arr2];
        expect(concatenated.length).toBe(arr1.length + arr2.length);
      })
    );
  });

  test("sorting is idempotent", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const sorted1 = [...arr].sort((a, b) => a - b);
        const sorted2 = [...sorted1].sort((a, b) => a - b);
        expect(sorted1).toEqual(sorted2);
      })
    );
  });
});

// Example 2: Property Testing - String Operations
describe("String property tests", () => {
  test("trimming removes only leading/trailing whitespace", () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const trimmed = str.trim();
        expect(trimmed.length).toBeLessThanOrEqual(str.length);
        if (trimmed.length > 0) {
          expect(trimmed[0]).not.toBe(" ");
          expect(trimmed[trimmed.length - 1]).not.toBe(" ");
        }
      })
    );
  });

  test("toLowerCase and toUpperCase are inverses", () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const lower = str.toLowerCase();
        const upper = lower.toUpperCase();
        expect(upper.toLowerCase()).toBe(lower);
      })
    );
  });
});

// Example 3: Contract Testing Pattern
interface UserService {
  getUser(id: string): Promise<{ id: string; name: string; email: string }>;
  createUser(data: { name: string; email: string }): Promise<{ id: string }>;
}

// Consumer test (defines expected contract)
describe("UserService Contract (Consumer)", () => {
  test("getUser returns user with required fields", async () => {
    const mockService: UserService = {
      getUser: vi.fn().mockResolvedValue({
        id: "123",
        name: "Alice",
        email: "alice@example.com",
      }),
      createUser: vi.fn(),
    };

    const user = await mockService.getUser("123");
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
  });
});

// Provider test (verifies it meets contract)
describe("UserService Contract (Provider)", () => {
  test("real service matches contract", async () => {
    // Would test against real implementation
    // This is where you'd verify the actual API matches expected shape
  });
});

// Example 4: Snapshot Testing
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

function renderTodoList(todos: TodoItem[]): string {
  return todos
    .map((todo) => {
      const checkbox = todo.completed ? "[x]" : "[ ]";
      return `${checkbox} ${todo.title}`;
    })
    .join("\n");
}

describe("Snapshot tests", () => {
  test("renders todo list correctly", () => {
    const todos: TodoItem[] = [
      { id: 1, title: "Buy milk", completed: false, createdAt: new Date("2024-01-01") },
      { id: 2, title: "Walk dog", completed: true, createdAt: new Date("2024-01-02") },
    ];

    expect(renderTodoList(todos)).toMatchSnapshot();
  });

  test("inline snapshot example", () => {
    const result = { name: "Test", value: 42 };
    expect(result).toMatchInlineSnapshot(`
      {
        "name": "Test",
        "value": 42,
      }
    `);
  });
});

// Example 5: Test Doubles - Mocks, Stubs, Spies
interface PaymentGateway {
  charge(amount: number, currency: string): Promise<{ transactionId: string; success: boolean }>;
}

class OrderService {
  constructor(private gateway: PaymentGateway) {}

  async processOrder(amount: number): Promise<boolean> {
    const result = await this.gateway.charge(amount, "USD");
    return result.success;
  }
}

describe("Test Doubles", () => {
  test("Mock: full replacement with controlled behavior", async () => {
    const mockGateway: PaymentGateway = {
      charge: vi.fn().mockResolvedValue({ transactionId: "tx-123", success: true }),
    };

    const service = new OrderService(mockGateway);
    const result = await service.processOrder(100);

    expect(result).toBe(true);
    expect(mockGateway.charge).toHaveBeenCalledWith(100, "USD");
  });

  test("Spy: observe calls on real object", () => {
    const realGateway = {
      charge: async (amount: number) => ({ transactionId: "real-tx", success: amount > 0 }),
    };

    const spy = vi.spyOn(realGateway, "charge");
    realGateway.charge(50);

    expect(spy).toHaveBeenCalledWith(50);
  });

  test("Stub: partial implementation", async () => {
    const stubGateway: PaymentGateway = {
      charge: async () => ({ transactionId: "stub-tx", success: true }),
    };

    // Just returns predefined data, doesn't verify interactions
    const result = await stubGateway.charge(100, "USD");
    expect(result.success).toBe(true);
  });
});

// Example 6: Time-Based Testing
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

describe("Time-based tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("debounce delays execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 1000);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("debounce cancels previous calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 1000);

    debounced();
    debounced();
    debounced();

    vi.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1); // Only last call executes
  });
});

// Example 7: Async Testing with Retries
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, i)));
    }
  }

  throw lastError;
}

describe("Async retry tests", () => {
  test("retries on failure", async () => {
    const mockFetch = vi.fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValueOnce({ ok: true } as Response);

    globalThis.fetch = mockFetch;

    const result = await fetchWithRetry("https://api.example.com");
    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  test("throws after max retries", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Always fails"));
    globalThis.fetch = mockFetch;

    await expect(fetchWithRetry("https://api.example.com", 2)).rejects.toThrow("Always fails");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

// Example 8: Integration Test Pattern
class UserRepository {
  private users = new Map<string, { id: string; name: string; email: string }>();

  async save(user: { id: string; name: string; email: string }): Promise<void> {
    this.users.set(user.id, user);
  }

  async findById(id: string): Promise<{ id: string; name: string; email: string } | null> {
    return this.users.get(id) || null;
  }

  async deleteAll(): Promise<void> {
    this.users.clear();
  }
}

describe("Integration tests with in-memory repository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
  });

  afterEach(async () => {
    await repository.deleteAll();
  });

  test("full user lifecycle", async () => {
    // Create
    await repository.save({ id: "1", name: "Alice", email: "alice@example.com" });

    // Read
    const user = await repository.findById("1");
    expect(user).toEqual({ id: "1", name: "Alice", email: "alice@example.com" });

    // Not found
    const notFound = await repository.findById("999");
    expect(notFound).toBeNull();
  });
});

// Example 9: Custom Matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

declare module "vitest" {
  interface Matchers<R = unknown> {
    toBeWithinRange(floor: number, ceiling: number): R;
  }
}

test("custom matcher example", () => {
  expect(15).toBeWithinRange(10, 20);
});

// Example 10: Parameterized Tests
describe.each([
  { input: "hello", expected: "HELLO" },
  { input: "world", expected: "WORLD" },
  { input: "TypeScript", expected: "TYPESCRIPT" },
])("toUpperCase parameterized tests", ({ input, expected }) => {
  test(`converts "${input}" to "${expected}"`, () => {
    expect(input.toUpperCase()).toBe(expected);
  });
});

export { debounce, fetchWithRetry, UserRepository, renderTodoList };
