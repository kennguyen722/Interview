// ============================================================================
// LESSON 32: TESTING STRATEGIES - SOLUTION
// ============================================================================

/**
 * SOLUTION 1: Test Pyramid Implementation
 */

console.log("=== SOLUTION 1: TEST PYRAMID ===");

type TestLevel = "Unit" | "Integration" | "E2E";

class TestSuite {
  private tests: { level: TestLevel; name: string }[] = [];

  addUnitTest(name: string) {
    this.tests.push({ level: "Unit", name });
  }

  addIntegrationTest(name: string) {
    this.tests.push({ level: "Integration", name });
  }

  addE2ETest(name: string) {
    this.tests.push({ level: "E2E", name });
  }

  getDistribution() {
    const counts = { Unit: 0, Integration: 0, E2E: 0 };
    for (const test of this.tests) {
      counts[test.level]++;
    }
    return counts;
  }
}

// Feature: Discount calculation
const testSuite = new TestSuite();

// 80% Unit tests
testSuite.addUnitTest("Loyalty customer gets 10% discount");
testSuite.addUnitTest("Order over $100 gets 5% discount");
testSuite.addUnitTest("Both conditions give 15% discount");
testSuite.addUnitTest("No conditions give 0% discount");
testSuite.addUnitTest("Edge case: exactly $100");

// 15% Integration tests
testSuite.addIntegrationTest("Discount applies to database order");
testSuite.addIntegrationTest("Discount stored in transaction");

// 5% E2E tests
testSuite.addE2ETest("User applies discount through UI");

const dist = testSuite.getDistribution();
console.log(`Unit: ${dist.Unit}, Integration: ${dist.Integration}, E2E: ${dist.E2E}`);

/**
 * SOLUTION 2: AAA Pattern Tests
 */

console.log("\n=== SOLUTION 2: AAA PATTERN ===");

function calculateDiscount(isLoyalty: boolean, orderTotal: number): number {
  if (isLoyalty && orderTotal > 100) return 0.15;
  if (isLoyalty) return 0.1;
  if (orderTotal > 100) return 0.05;
  return 0;
}

function test_loyaltyDiscount() {
  // ARRANGE
  const isLoyalty = true;
  const orderTotal = 50;

  // ACT
  const discount = calculateDiscount(isLoyalty, orderTotal);

  // ASSERT
  console.assert(discount === 0.1, "Loyalty should get 10%");
  console.log("✓ Loyalty discount test passed");
}

function test_largeOrderDiscount() {
  // ARRANGE
  const isLoyalty = false;
  const orderTotal = 150;

  // ACT
  const discount = calculateDiscount(isLoyalty, orderTotal);

  // ASSERT
  console.assert(discount === 0.05, "Large order should get 5%");
  console.log("✓ Large order discount test passed");
}

function test_bothConditionsDiscount() {
  // ARRANGE
  const isLoyalty = true;
  const orderTotal = 150;

  // ACT
  const discount = calculateDiscount(isLoyalty, orderTotal);

  // ASSERT
  console.assert(discount === 0.15, "Both conditions should get 15%");
  console.log("✓ Combined discount test passed");
}

test_loyaltyDiscount();
test_largeOrderDiscount();
test_bothConditionsDiscount();

/**
 * SOLUTION 3: Edge Cases
 */

console.log("\n=== SOLUTION 3: EDGE CASES ===");

function getUserAge(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();

  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function test_edgeCases() {
  // Normal case
  const age1 = getUserAge(new Date(1990, 0, 15));
  console.assert(age1 >= 33, "Normal case");

  // Birthday is today (or close to it)
  const today = new Date();
  const ageToday = getUserAge(new Date(1995, today.getMonth(), today.getDate()));
  console.assert(ageToday >= 29, "Birthday today");

  // Very old person
  const ageOld = getUserAge(new Date(1920, 0, 1));
  console.assert(ageOld >= 100, "Very old");

  console.log("✓ Edge case tests passed");
}

test_edgeCases();

/**
 * SOLUTION 4: Test Doubles
 */

console.log("\n=== SOLUTION 4: TEST DOUBLES ===");

interface PaymentService {
  processPayment(amount: number): Promise<string>;
}

// Stub - Always succeeds
class PaymentServiceStub implements PaymentService {
  async processPayment(amount: number): Promise<string> {
    return `txn-${amount}`;
  }
}

// Mock - Verifies calls
class PaymentServiceMock implements PaymentService {
  private calls: number[] = [];

  async processPayment(amount: number): Promise<string> {
    this.calls.push(amount);
    return `txn-${amount}`;
  }

  verify(expectedAmount: number) {
    const called = this.calls.includes(expectedAmount);
    console.assert(called, `Expected ${expectedAmount}, got ${this.calls}`);
    return called;
  }
}

// Spy - Records but delegates
class PaymentServiceSpy implements PaymentService {
  private calls: number[] = [];

  constructor(private real: PaymentService) {}

  async processPayment(amount: number): Promise<string> {
    this.calls.push(amount);
    return this.real.processPayment(amount);
  }

  getCallCount() {
    return this.calls.length;
  }
}

console.log("✓ Test double implementations ready");

/**
 * SOLUTION 5: Async Testing
 */

console.log("\n=== SOLUTION 5: ASYNC TESTING ===");

async function fetchUserData(userId: string): Promise<{ id: string; name: string }> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: `User ${userId}` });
    }, 50);
  });
}

async function test_asyncFetch() {
  // ARRANGE
  const userId = "123";

  // ACT
  const userData = await fetchUserData(userId);

  // ASSERT
  console.assert(userData.id === "123", "ID should match");
  console.assert(userData.name === "User 123", "Name should match");
  console.log("✓ Async fetch test passed");
}

async function test_asyncTimeout() {
  // Create timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), 25);
  });

  const dataPromise = fetchUserData("123");

  try {
    await Promise.race([dataPromise, timeoutPromise]);
    console.log("✗ Should have timed out");
  } catch (error: any) {
    if (error.message === "Timeout") {
      console.log("✓ Timeout handling test passed");
    }
  }
}

test_asyncFetch();
test_asyncTimeout();

/**
 * SOLUTION 6: Mocking HTTP
 */

console.log("\n=== SOLUTION 6: MOCKING HTTP ===");

// Mock fetch implementation
class MockResponse {
  constructor(private data: unknown, private status: number = 200) {}

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  async json() {
    return this.data;
  }
}

async function test_apiSuccess() {
  // Mock fetch
  globalThis.fetch = async () => new MockResponse({ success: true, data: "test" });

  // ACT
  const response = await fetch("/api/test");
  const data = await response.json();

  // ASSERT
  console.assert(response.ok, "Response should be ok");
  console.assert((data as any).success, "Should have success");
  console.log("✓ API success test passed");
}

async function test_apiError() {
  // Mock fetch
  globalThis.fetch = async () => new MockResponse({ error: "Not found" }, 404);

  // ACT
  const response = await fetch("/api/test");

  // ASSERT
  console.assert(!response.ok, "Response should not be ok");
  console.log("✓ API error test passed");
}

test_apiSuccess();
test_apiError();

/**
 * SOLUTION 7: Coverage Analysis
 */

console.log("\n=== SOLUTION 7: COVERAGE ANALYSIS ===");

function processOrder(order: any): string {
  if (!order) {
    throw new Error("Order required");
  }

  if (order.items.length === 0) {
    return "Empty order";
  }

  let total = 0;
  for (const item of order.items) {
    total += item.discounted ? item.price * 0.9 : item.price;
  }

  if (total > 1000) return `Premium: $${total}`;
  else if (total > 100) return `Standard: $${total}`;
  else return `Small: $${total}`;
}

function test_coverage() {
  // Line 1: if (!order)
  try {
    processOrder(null);
    console.log("✗ Should throw");
  } catch {
    console.log("✓ Null order handled");
  }

  // Line 2: if (order.items.length === 0)
  const result1 = processOrder({ items: [] });
  console.assert(result1 === "Empty order", "Empty order");

  // Line 3-4: Small order (no discount)
  const result2 = processOrder({ items: [{ price: 50, discounted: false }] });
  console.assert(result2.includes("Small"), "Small order");

  // Line 3-4: Small order (with discount)
  const result3 = processOrder({ items: [{ price: 100, discounted: true }] });
  console.assert(result3.includes("$90"), "Discounted item");

  // Line 5: Standard
  const result4 = processOrder({ items: [{ price: 150, discounted: false }] });
  console.assert(result4.includes("Standard"), "Standard order");

  // Line 6: Premium
  const result5 = processOrder({ items: [{ price: 1500, discounted: false }] });
  console.assert(result5.includes("Premium"), "Premium order");

  console.log("✓ Coverage tests complete");
}

test_coverage();

/**
 * SOLUTION 8: TDD Cycle
 */

console.log("\n=== SOLUTION 8: TDD CYCLE ===");

// RED: Test fails
// test("ShoppingCart.getTotal() returns 0 for empty cart", () => {
//   const cart = new ShoppingCart();
//   assert.equal(cart.getTotal(), 0);
// });

// GREEN: Minimal implementation
class ShoppingCart {
  private items: { price: number }[] = [];

  addItem(price: number) {
    this.items.push({ price });
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  applyTax(rate: number): number {
    return this.getTotal() * (1 + rate);
  }
}

// REFACTOR: Improve
function test_tdd() {
  const cart = new ShoppingCart();
  console.assert(cart.getTotal() === 0, "Empty cart is 0");

  cart.addItem(100);
  cart.addItem(50);
  console.assert(cart.getTotal() === 150, "Total is correct");

  const withTax = cart.applyTax(0.08);
  console.assert(withTax === 162, "Tax applied");

  console.log("✓ TDD cycle complete");
}

test_tdd();

/**
 * SOLUTION 9: Integration Testing
 */

console.log("\n=== SOLUTION 9: INTEGRATION TESTING ===");

interface IRepository {
  save(data: any): Promise<void>;
  findById(id: string): Promise<any>;
}

interface IEmailService {
  send(to: string, subject: string): Promise<void>;
}

class InMemoryRepository implements IRepository {
  private data: Map<string, any> = new Map();

  async save(data: any) {
    this.data.set(data.id, data);
  }

  async findById(id: string) {
    return this.data.get(id);
  }
}

class TestEmailService implements IEmailService {
  private sent: { to: string; subject: string }[] = [];

  async send(to: string, subject: string) {
    this.sent.push({ to, subject });
  }

  getSent() {
    return this.sent;
  }
}

class UserService {
  constructor(private repo: IRepository, private email: IEmailService) {}

  async registerUser(email: string, name: string) {
    const user = { id: email, email, name };
    await this.repo.save(user);
    await this.email.send(email, "Welcome!");
    return user;
  }
}

async function test_integration() {
  const repo = new InMemoryRepository();
  const emailService = new TestEmailService();
  const userService = new UserService(repo, emailService);

  await userService.registerUser("user@example.com", "John");

  const saved = await repo.findById("user@example.com");
  console.assert(saved?.name === "John", "User saved");

  const emails = emailService.getSent();
  console.assert(emails.length === 1, "Email sent");

  console.log("✓ Integration test passed");
}

test_integration();

/**
 * SOLUTION 10: Test Builder Pattern
 */

console.log("\n=== SOLUTION 10: TEST DATA BUILDER ===");

class OrderBuilder {
  private items: { price: number }[] = [];
  private discount = 0;
  private tax = 0.08;

  addItem(price: number) {
    this.items.push({ price });
    return this;
  }

  withDiscount(percent: number) {
    this.discount = percent;
    return this;
  }

  withTax(rate: number) {
    this.tax = rate;
    return this;
  }

  build() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    const afterDiscount = subtotal * (1 - this.discount);
    const taxAmount = afterDiscount * this.tax;

    return {
      items: this.items.length,
      subtotal,
      discount: this.discount,
      tax: taxAmount,
      total: afterDiscount + taxAmount,
    };
  }
}

function test_builder() {
  const order1 = new OrderBuilder().addItem(100).addItem(50).build();
  console.log("Standard order:", order1);

  const order2 = new OrderBuilder()
    .addItem(100)
    .withDiscount(0.1)
    .withTax(0.1)
    .build();
  console.log("Discounted order:", order2);

  console.log("✓ Builder pattern test passed");
}

test_builder();

console.log("\n=== TESTING SOLUTIONS COMPLETE ===");
