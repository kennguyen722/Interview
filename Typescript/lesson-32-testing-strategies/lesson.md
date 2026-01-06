# Lesson 32: Testing Strategies for Interviews & Production

## Objective
Master comprehensive testing strategies that demonstrate code quality and reliability in both interviews and production systems. Learn what to test, how to structure tests effectively, and when to use different testing approaches.

## Topics Covered

### 1. Testing Pyramid

```
        /\
       /  \  E2E Tests (5%)
      /____\
     /      \
    /  API   \ Integration Tests (15%)
   /  Tests  \
  /___________\
 /             \
/   Unit Tests  \ Unit Tests (80%)
/_______________\
```

**Unit Tests (80%)**
- Test individual functions/methods in isolation
- Fast, focused, deterministic
- Should comprise majority of tests

**Integration Tests (15%)**
- Test multiple components together
- Database interactions, API calls
- More complex but fewer tests

**E2E Tests (5%)**
- Test complete user workflows
- Slow, expensive, fewer tests
- Critical paths only

### 2. Unit Testing Patterns

#### Pattern 1: Arrange-Act-Assert
```typescript
describe("calculateDiscount", () => {
  it("should apply 10% discount for quantity > 10", () => {
    // Arrange
    const price = 100;
    const quantity = 15;

    // Act
    const result = calculateDiscount(price, quantity);

    // Assert
    expect(result).toBe(1350);
  });

  it("should return full price for quantity <= 10", () => {
    // Arrange
    const price = 100;
    const quantity = 5;

    // Act
    const result = calculateDiscount(price, quantity);

    // Assert
    expect(result).toBe(500);
  });
});
```

#### Pattern 2: Test Edge Cases
```typescript
describe("getUserAge", () => {
  it("should calculate age correctly", () => {
    expect(getUserAge("2000-01-01")).toBeGreaterThanOrEqual(24);
  });

  it("should handle leap year birthdays", () => {
    const age = getUserAge("1996-02-29"); // Leap year
    expect(age).toBeGreaterThanOrEqual(29);
  });

  it("should handle today's birthday", () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate()
    );
    expect(getUserAge(birthDate.toISOString())).toBe(25);
  });

  it("should throw for future dates", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(() => getUserAge(tomorrow.toISOString())).toThrow();
  });
});
```

#### Pattern 3: Test Error Handling
```typescript
describe("parseJSON", () => {
  it("should parse valid JSON", () => {
    const result = parseJSON('{"name": "John"}');
    expect(result).toEqual({ name: "John" });
  });

  it("should throw for invalid JSON", () => {
    expect(() => parseJSON("invalid json")).toThrow(SyntaxError);
  });

  it("should throw with helpful message", () => {
    try {
      parseJSON("{ bad json }");
    } catch (error) {
      expect(error.message).toContain("position");
    }
  });

  it("should handle empty string", () => {
    expect(() => parseJSON("")).toThrow();
  });

  it("should handle null/undefined", () => {
    expect(() => parseJSON(null as any)).toThrow();
    expect(() => parseJSON(undefined as any)).toThrow();
  });
});
```

### 3. Testing Async Code

```typescript
describe("fetchUser", () => {
  it("should fetch user successfully", async () => {
    // Arrange
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 1, name: "John" }))
      );

    global.fetch = mockFetch;

    // Act
    const user = await fetchUser("1");

    // Assert
    expect(user).toEqual({ id: 1, name: "John" });
    expect(mockFetch).toHaveBeenCalledWith("/api/users/1");
  });

  it("should retry on failure", async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 1, name: "John" }))
      );

    global.fetch = mockFetch;

    const user = await fetchUserWithRetry("1", { maxAttempts: 2, delay: 10 });

    expect(user).toEqual({ id: 1, name: "John" });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should timeout after duration", async () => {
    const mockFetch = jest.fn(
      () => new Promise(resolve => setTimeout(resolve, 5000))
    );

    global.fetch = mockFetch;

    await expect(
      fetchUserWithTimeout("1", 100)
    ).rejects.toThrow("Timeout");
  });
});
```

### 4. Mocking & Test Doubles

#### Test Double: Stub
```typescript
// Stub: Replace with fixed response
class UserRepositoryStub implements IUserRepository {
  async findById(id: string): Promise<User> {
    return { id: "1", name: "John", email: "john@example.com" };
  }
}

describe("UserService", () => {
  it("should get user by id", async () => {
    const repository = new UserRepositoryStub();
    const service = new UserService(repository);

    const user = await service.getUser("1");

    expect(user.name).toBe("John");
  });
});
```

#### Test Double: Mock
```typescript
// Mock: Verify interactions
describe("OrderService", () => {
  it("should send email on order creation", async () => {
    const emailServiceMock = jest.fn();
    const service = new OrderService(emailServiceMock);

    await service.createOrder({ items: [], customer: "john@example.com" });

    expect(emailServiceMock).toHaveBeenCalledWith({
      to: "john@example.com",
      subject: "Order Confirmation",
    });
  });
});
```

#### Test Double: Spy
```typescript
// Spy: Verify original method was called
describe("Logger", () => {
  it("should log to console", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const logger = new Logger();

    logger.info("Test message");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Test message")
    );

    consoleLogSpy.mockRestore();
  });
});
```

### 5. Coverage Guidelines

**Target Coverage Metrics**
```
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%
```

**What to Test**
✅ Business logic
✅ Error paths
✅ Edge cases
✅ Public APIs
✅ Integrations

**What Not to Test**
❌ Getters/setters (obvious)
❌ Third-party libraries
❌ Boilerplate code
❌ UI implementation details

### 6. Interview Testing Questions

#### Question 1: Function Testing
```typescript
/**
 * Write unit tests for this function:
 * 
 * function getLeapYearDays(year: number): number {
 *   return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
 * }
 */

describe("getLeapYearDays", () => {
  it("should return 366 for leap years", () => {
    expect(getLeapYearDays(2020)).toBe(366); // Divisible by 4
    expect(getLeapYearDays(2000)).toBe(366); // Divisible by 400
  });

  it("should return 365 for non-leap years", () => {
    expect(getLeapYearDays(2021)).toBe(365); // Not divisible by 4
    expect(getLeapYearDays(1900)).toBe(365); // Divisible by 100 but not 400
  });

  it("should handle century years", () => {
    expect(getLeapYearDays(1600)).toBe(366); // Leap
    expect(getLeapYearDays(1700)).toBe(365); // Not leap
  });
});
```

#### Question 2: Integration Testing
```typescript
/**
 * Write an integration test for user registration:
 * 
 * interface RegisterRequest {
 *   email: string;
 *   password: string;
 *   name: string;
 * }
 * 
 * class UserService {
 *   constructor(private db: Database, private email: EmailService) {}
 *   
 *   async register(req: RegisterRequest): Promise<User> {
 *     // Validate, create user in DB, send email
 *   }
 * }
 */

describe("UserService.register", () => {
  let db: Database;
  let emailService: EmailService;
  let userService: UserService;

  beforeEach(() => {
    db = new TestDatabase();
    emailService = new MockEmailService();
    userService = new UserService(db, emailService);
  });

  it("should create user and send welcome email", async () => {
    const user = await userService.register({
      email: "john@example.com",
      password: "password123",
      name: "John Doe",
    });

    // Verify user was created
    const savedUser = await db.getUserByEmail("john@example.com");
    expect(savedUser).toEqual(expect.objectContaining({ name: "John Doe" }));

    // Verify email was sent
    expect(emailService.lastEmail).toEqual(
      expect.objectContaining({ to: "john@example.com" })
    );

    // Verify return value
    expect(user.id).toBeDefined();
  });

  it("should reject duplicate email", async () => {
    await userService.register({
      email: "john@example.com",
      password: "password123",
      name: "John",
    });

    await expect(
      userService.register({
        email: "john@example.com",
        password: "different123",
        name: "Jane",
      })
    ).rejects.toThrow("Email already exists");
  });

  it("should validate input", async () => {
    await expect(
      userService.register({
        email: "invalid-email",
        password: "123", // Too short
        name: "",
      })
    ).rejects.toThrow();
  });
});
```

### 7. Test-Driven Development (TDD)

**Red-Green-Refactor Cycle**

```typescript
// Step 1: RED - Write failing test
describe("Stack", () => {
  it("should push and pop items", () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });
});
// Run: FAIL (Stack doesn't exist)

// Step 2: GREEN - Write minimal code to pass
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}
// Run: PASS

// Step 3: REFACTOR - Improve code
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T { 
    if (this.items.length === 0) throw new Error("Stack underflow");
    return this.items.pop()!;
  }
  size(): number { return this.items.length; }
}
```

## Testing Checklist for Interviews

✅ **Before Writing Tests**
- [ ] Understand requirements
- [ ] Identify test cases
- [ ] Plan edge cases
- [ ] Think about error scenarios

✅ **While Writing Tests**
- [ ] Use clear test names
- [ ] Follow AAA pattern
- [ ] Test one thing per test
- [ ] Avoid test interdependencies
- [ ] Use meaningful assertions

✅ **After Writing Tests**
- [ ] Verify all tests pass
- [ ] Check coverage
- [ ] Refactor test code
- [ ] Peer review tests
- [ ] Maintain tests with code

## Learning Outcomes
- Write comprehensive unit tests
- Test async code effectively
- Use mocks and stubs appropriately
- Achieve meaningful coverage
- Apply TDD in interviews
- Test error scenarios

## Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Doubles](https://martinfowler.com/bliki/TestDouble.html)
- [Growing Object-Oriented Software, Guided by Tests](http://www.growing-object-oriented-software.com/)
