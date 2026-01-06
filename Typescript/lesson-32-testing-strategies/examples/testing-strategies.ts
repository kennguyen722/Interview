// ============================================================================
// TESTING STRATEGIES - PRACTICAL EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Testing Pyramid
 */

console.log("=== TESTING PYRAMID ===");

// Test pyramid distribution: 80% Unit, 15% Integration, 5% E2E

type TestLevel = "Unit" | "Integration" | "E2E";

class TestPyramid {
  private tests: { level: TestLevel; description: string }[] = [];

  addTest(level: TestLevel, description: string) {
    this.tests.push({ level, description });
  }

  getStats() {
    const counts = { Unit: 0, Integration: 0, E2E: 0 };
    for (const test of this.tests) {
      counts[test.level]++;
    }
    return counts;
  }

  report() {
    const stats = this.getStats();
    const total = stats.Unit + stats.Integration + stats.E2E;

    console.log("Test Distribution:");
    console.log(`  Unit: ${stats.Unit} (${((stats.Unit / total) * 100).toFixed(1)}%)`);
    console.log(`  Integration: ${stats.Integration} (${((stats.Integration / total) * 100).toFixed(1)}%)`);
    console.log(`  E2E: ${stats.E2E} (${((stats.E2E / total) * 100).toFixed(1)}%)`);
  }
}

const pyramid = new TestPyramid();

// Add tests (80% unit, 15% integration, 5% E2E)
for (let i = 0; i < 80; i++) pyramid.addTest("Unit", `Unit test ${i}`);
for (let i = 0; i < 15; i++) pyramid.addTest("Integration", `Integration test ${i}`);
for (let i = 0; i < 5; i++) pyramid.addTest("E2E", `E2E test ${i}`);

pyramid.report();

/**
 * EXAMPLE 2: AAA Pattern (Arrange-Act-Assert)
 */

console.log("\n=== AAA PATTERN ===");

// Discount calculation function to test
function calculateDiscount(isLoyalty: boolean, orderTotal: number): number {
  if (isLoyalty && orderTotal > 100) return 0.15;
  if (isLoyalty) return 0.1;
  if (orderTotal > 100) return 0.05;
  return 0;
}

// Test using AAA pattern
function test_calculateDiscount_WithLoyaltyCustomer() {
  // ARRANGE
  const isLoyalty = true;
  const orderTotal = 50;

  // ACT
  const discount = calculateDiscount(isLoyalty, orderTotal);

  // ASSERT
  console.assert(discount === 0.1, "Loyalty customer should get 10% discount");
  console.log("✓ Test: Loyalty customer discount");
}

function test_calculateDiscount_WithHighOrder() {
  // ARRANGE
  const isLoyalty = false;
  const orderTotal = 150;

  // ACT
  const discount = calculateDiscount(isLoyalty, orderTotal);

  // ASSERT
  console.assert(discount === 0.05, "Orders over $100 should get 5% discount");
  console.log("✓ Test: High order discount");
}

function test_calculateDiscount_WithBothConditions() {
  // ARRANGE
  const isLoyalty = true;
  const orderTotal = 150;

  // ACT
  const discount = calculateDiscount(isLoyalty, orderTotal);

  // ASSERT
  console.assert(discount === 0.15, "Both conditions should get 15% discount");
  console.log("✓ Test: Combined discount");
}

test_calculateDiscount_WithLoyaltyCustomer();
test_calculateDiscount_WithHighOrder();
test_calculateDiscount_WithBothConditions();

/**
 * EXAMPLE 3: Edge Cases and Boundary Testing
 */

console.log("\n=== EDGE CASES ===");

function getUserAge(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();

  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Test edge cases
const testCases = [
  {
    name: "Normal case",
    birthDate: new Date(1990, 0, 15),
    expected: 34, // Approximate
  },
  {
    name: "Birthday is today",
    birthDate: new Date(1995, new Date().getMonth(), new Date().getDate()),
    expected: 29, // Approximate
  },
  {
    name: "Very old person",
    birthDate: new Date(1920, 0, 1),
    expected: 104, // Approximate
  },
];

console.log("Testing age calculation:");
testCases.forEach((test) => {
  const age = getUserAge(test.birthDate);
  const valid = Math.abs(age - test.expected) <= 1; // Allow 1 year tolerance
  console.log(`${valid ? "✓" : "✗"} ${test.name}: ${age} years`);
});

/**
 * EXAMPLE 4: Test Doubles (Mock, Stub, Spy)
 */

console.log("\n=== TEST DOUBLES ===");

interface PaymentService {
  processPayment(amount: number): Promise<string>;
}

// Test Stub - Always returns success
class PaymentServiceStub implements PaymentService {
  async processPayment(amount: number): Promise<string> {
    return `txn-${amount}`;
  }
}

// Test Mock - Verifies it was called correctly
class PaymentServiceMock implements PaymentService {
  private calls: number[] = [];

  async processPayment(amount: number): Promise<string> {
    this.calls.push(amount);
    return `txn-${amount}`;
  }

  verifyCalledWith(amount: number) {
    const called = this.calls.includes(amount);
    console.assert(called, `Expected processPayment to be called with ${amount}`);
    return called;
  }

  getCallCount() {
    return this.calls.length;
  }
}

// Test Spy - Records calls but delegates
class PaymentServiceSpy implements PaymentService {
  private calls: { amount: number; timestamp: Date }[] = [];

  constructor(private real: PaymentService) {}

  async processPayment(amount: number): Promise<string> {
    this.calls.push({ amount, timestamp: new Date() });
    return this.real.processPayment(amount);
  }

  getCallHistory() {
    return this.calls;
  }
}

// Example: OrderService using payment
class OrderService {
  constructor(private paymentService: PaymentService) {}

  async processOrder(items: { price: number }[], cardToken: string): Promise<string> {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const transactionId = await this.paymentService.processPayment(total);
    return `Order-${transactionId}`;
  }
}

console.log("Using Test Stub:");
const stub = new PaymentServiceStub();
const orderServiceWithStub = new OrderService(stub);
orderServiceWithStub.processOrder([{ price: 100 }, { price: 50 }], "token").then((result) => {
  console.log(`✓ Order created: ${result}`);
});

console.log("\nUsing Test Mock:");
const mock = new PaymentServiceMock();
const orderServiceWithMock = new OrderService(mock);
orderServiceWithMock.processOrder([{ price: 100 }], "token").then(() => {
  const verified = mock.verifyCalledWith(100);
  console.log(`✓ Mock verified: ${verified}`);
  console.log(`Call count: ${mock.getCallCount()}`);
});

/**
 * EXAMPLE 5: Async Testing
 */

console.log("\n=== ASYNC TESTING ===");

async function fetchUserData(userId: string): Promise<{ id: string; name: string }> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: `User ${userId}` });
    }, 100);
  });
}

async function test_fetchUserData_Success() {
  // ARRANGE
  const userId = "123";

  // ACT
  const userData = await fetchUserData(userId);

  // ASSERT
  console.assert(userData.id === "123", "Should return correct user ID");
  console.assert(userData.name === "User 123", "Should return correct user name");
  console.log("✓ Test: Fetch user data - success");
}

async function test_fetchUserData_WithTimeout() {
  // ARRANGE & ACT
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), 50);
  });

  const dataPromise = fetchUserData("123");

  try {
    await Promise.race([dataPromise, timeoutPromise]);
  } catch (error: any) {
    console.log(`✓ Test: Timeout handling - ${error.message}`);
  }
}

test_fetchUserData_Success();
test_fetchUserData_WithTimeout();

/**
 * EXAMPLE 6: Mocking HTTP Requests
 */

console.log("\n=== MOCKING HTTP REQUESTS ===");

// Mock fetch
class MockFetch {
  static setupSuccessResponse(data: unknown) {
    globalThis.fetch = async () =>
      ({
        ok: true,
        json: async () => data,
      } as Response);
  }

  static setupErrorResponse(status: number, message: string) {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status,
        statusText: message,
      } as Response);
  }
}

async function test_apiCall_Success() {
  // ARRANGE
  MockFetch.setupSuccessResponse({ success: true, data: "test" });

  // ACT
  const response = await fetch("/api/test");
  const data = await response.json();

  // ASSERT
  console.assert(response.ok === true, "Response should be OK");
  console.assert((data as any).success === true, "Data should have success flag");
  console.log("✓ Test: API call - success");
}

async function test_apiCall_Error() {
  // ARRANGE
  MockFetch.setupErrorResponse(404, "Not Found");

  // ACT
  const response = await fetch("/api/test");

  // ASSERT
  console.assert(response.ok === false, "Response should not be OK");
  console.assert(response.status === 404, "Should return 404");
  console.log("✓ Test: API call - error handling");
}

test_apiCall_Success();
test_apiCall_Error();

/**
 * EXAMPLE 7: Coverage Analysis
 */

console.log("\n=== COVERAGE ANALYSIS ===");

function processOrder(order: any): string {
  if (!order) {
    throw new Error("Order is required");
  }

  if (order.items.length === 0) {
    return "Empty order";
  }

  let total = 0;
  for (const item of order.items) {
    total += item.discounted ? item.price * 0.9 : item.price;
  }

  if (total > 1000) return `Order value: $${total} (Premium)`;
  else if (total > 100) return `Order value: $${total} (Standard)`;
  else return `Order value: $${total} (Small)`;
}

// Coverage tests
console.log("Testing all branches:");
console.log(
  "✓ Null order:",
  (() => {
    try {
      processOrder(null);
      return "FAIL";
    } catch (e) {
      return "OK";
    }
  })()
);

console.log("✓ Empty order:", processOrder({ items: [] }));
console.log("✓ Small order:", processOrder({ items: [{ price: 50, discounted: false }] }));
console.log("✓ Standard order:", processOrder({ items: [{ price: 150, discounted: false }] }));
console.log("✓ Premium order:", processOrder({ items: [{ price: 1500, discounted: false }] }));
console.log("✓ Discounted item:", processOrder({ items: [{ price: 100, discounted: true }] }));

/**
 * EXAMPLE 8: TDD - Red-Green-Refactor
 */

console.log("\n=== TDD CYCLE ===");

console.log("RED phase: Write failing test");
console.log("  - Test: ShoppingCart.getTotal() should return 0 for empty cart");
console.log("  - FAIL: ShoppingCart is not defined");

// GREEN phase: Minimal implementation
class ShoppingCart {
  private items: { price: number }[] = [];

  addItem(price: number) {
    this.items.push({ price });
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

console.log("GREEN phase: Implement to pass test");
const cart = new ShoppingCart();
console.assert(cart.getTotal() === 0, "Empty cart should return 0");
console.log("  - PASS: Test passes");

console.log("REFACTOR phase: Improve code quality");
cart.addItem(100);
cart.addItem(50);
console.assert(cart.getTotal() === 150, "Total should be 150");
console.log("  - PASS: Refactored code still passes");

/**
 * EXAMPLE 9: Integration Testing Patterns
 */

console.log("\n=== INTEGRATION TESTING ===");

interface IUserRepository {
  save(user: any): Promise<void>;
  findById(id: string): Promise<any>;
}

interface IEmailService {
  send(to: string, subject: string): Promise<void>;
}

class UserService {
  constructor(private repo: IUserRepository, private email: IEmailService) {}

  async registerUser(email: string, name: string) {
    const user = { email, name, createdAt: new Date() };
    await this.repo.save(user);
    await this.email.send(email, "Welcome!");
    return user;
  }
}

// Mock implementations for testing
class InMemoryUserRepository implements IUserRepository {
  private users: any[] = [];

  async save(user: any) {
    this.users.push(user);
  }

  async findById(id: string) {
    return this.users.find((u) => u.email === id);
  }
}

class MockEmailService implements IEmailService {
  async send(to: string, subject: string) {
    console.log(`📧 Email sent to ${to}: ${subject}`);
  }
}

// Integration test
async function test_userRegistration_Integration() {
  const repo = new InMemoryUserRepository();
  const email = new MockEmailService();
  const userService = new UserService(repo, email);

  const user = await userService.registerUser("user@example.com", "John Doe");

  console.assert(user.email === "user@example.com", "User email should be saved");
  console.assert(user.name === "John Doe", "User name should be saved");
  console.log("✓ Integration test: User registration complete");
}

test_userRegistration_Integration();

/**
 * EXAMPLE 10: Test Data Builders
 */

console.log("\n=== TEST DATA BUILDERS ===");

class OrderBuilder {
  private items: { name: string; price: number }[] = [];
  private discount = 0;
  private taxRate = 0.08;

  addItem(name: string, price: number) {
    this.items.push({ name, price });
    return this;
  }

  withDiscount(percent: number) {
    this.discount = percent;
    return this;
  }

  withTaxRate(rate: number) {
    this.taxRate = rate;
    return this;
  }

  build() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = subtotal * this.discount;
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * this.taxRate;

    return {
      items: this.items,
      subtotal,
      discount: this.discount,
      tax,
      total: afterDiscount + tax,
    };
  }
}

console.log("Building test orders:");
const order1 = new OrderBuilder().addItem("Item A", 100).addItem("Item B", 50).build();
console.log("Standard order:", order1);

const order2 = new OrderBuilder().addItem("Item A", 100).withDiscount(0.1).withTaxRate(0.1).build();
console.log("Order with discount:", order2);
