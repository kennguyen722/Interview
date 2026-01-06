// ============================================================================
// TESTING STRATEGIES EXERCISES
// ============================================================================

/**
 * EXERCISE 1: Test Pyramid
 * 
 * For a feature, write tests at each level:
 */

// Feature: Discount calculation
// - Loyalty customer: 10% discount
// - Orders over $100: 5% discount
// - Both conditions: 15% discount (not stacked)

interface DiscountInput {
  isLoyalty: boolean;
  orderTotal: number;
}

function calculateDiscount(input: DiscountInput): number {
  if (input.isLoyalty && input.orderTotal > 100) {
    return 0.15;
  }
  if (input.isLoyalty) {
    return 0.1;
  }
  if (input.orderTotal > 100) {
    return 0.05;
  }
  return 0;
}

// TODO: Write tests (80% unit, 15% integration, 5% E2E)

// Unit tests (80%):
// - Test loyalty customer discount
// - Test order amount discount
// - Test both conditions
// - Test edge cases: $100 exactly, $99.99, $100.01

// Integration tests (15%):
// - Test with actual database
// - Test with price service
// - Test with different currencies

// E2E tests (5%):
// - Full user journey: Add items, apply discount, checkout

/**
 * EXERCISE 2: AAA Pattern (Arrange-Act-Assert)
 * 
 * Write tests following the AAA pattern:
 */

// TODO: Implement unit tests for calculateDiscount using AAA:

// Example structure:
// function test_calculateDiscount_WithLoyaltyCustomer() {
//   // Arrange
//   const input: DiscountInput = { isLoyalty: true, orderTotal: 50 };
//
//   // Act
//   const discount = calculateDiscount(input);
//
//   // Assert
//   assertEquals(discount, 0.1);
// }

/**
 * EXERCISE 3: Edge Cases and Boundary Conditions
 * 
 * Identify edge cases and write tests for:
 */

function getUserAge(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();

  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// TODO: Write tests for edge cases:
// - Birthday is today
// - Birthday is tomorrow
// - Birthday was yesterday
// - Leap year birth date (Feb 29)
// - Person is 0 years old
// - Very old person (100+ years)
// - Future birth date (invalid)

/**
 * EXERCISE 4: Test Doubles
 * 
 * Implement stubs, mocks, and spies:
 */

interface PaymentService {
  processPayment(amount: number, cardToken: string): Promise<string>;
  refund(transactionId: string): Promise<boolean>;
}

class OrderService {
  constructor(private paymentService: PaymentService) {}

  async createOrder(items: any[], cardToken: string): Promise<string> {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const transactionId = await this.paymentService.processPayment(total, cardToken);
    return `Order-${transactionId}`;
  }
}

// TODO: Implement:
// 1. PaymentServiceStub - always succeeds
// 2. PaymentServiceMock - verifies it was called correctly
// 3. PaymentServiceSpy - records calls but delegates to real
// 4. Write tests using each

/**
 * EXERCISE 5: Async Testing
 * 
 * Test asynchronous code properly:
 */

async function fetchUserData(userId: string): Promise<any> {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
}

// TODO: Write tests that:
// 1. Test success case with promise
// 2. Test failure case - handle rejection
// 3. Use proper async/await
// 4. Test timeout scenarios
// 5. Mock fetch API

/**
 * EXERCISE 6: Testing Async Functions
 * 
 * Write proper tests for this async function:
 */

async function validateEmail(email: string): Promise<boolean> {
  // Simulate API call
  const response = await fetch(`/api/validate-email?email=${email}`);
  return response.ok;
}

// TODO: Implement tests using:
// 1. Mocked fetch API
// 2. Promise resolution
// 3. Error handling
// 4. Timeout testing

/**
 * EXERCISE 7: Coverage Guidelines
 * 
 * Analyze this code and identify coverage needs:
 */

function processOrder(order: any): string {
  if (!order) {
    throw new Error("Order is required");
  }

  if (order.items.length === 0) {
    return "Empty order";
  }

  let total = 0;
  for (const item of order.items) {
    if (item.discounted) {
      total += item.price * 0.9;
    } else {
      total += item.price;
    }
  }

  if (total > 1000) {
    return `Order value: $${total} (Premium)`;
  } else if (total > 100) {
    return `Order value: $${total} (Standard)`;
  } else {
    return `Order value: $${total} (Small)`;
  }
}

// TODO: Coverage checklist:
// [ ] Test line coverage: ___% target
// [ ] Test branch coverage: ___% target
// [ ] Test path coverage: ___% target
// [ ] Write test for each branch
// [ ] Verify all paths tested

/**
 * EXERCISE 8: Mocking HTTP Requests
 * 
 * Mock external API calls:
 */

// TODO: Implement tests that:
// 1. Mock successful API response
// 2. Mock error response
// 3. Mock timeout
// 4. Mock network error
// 5. Verify correct URL called
// 6. Verify correct headers sent

/**
 * EXERCISE 9: Database Testing
 * 
 * Test database interactions:
 */

class UserRepository {
  async findById(id: string): Promise<any> {
    // Database query
    return null;
  }

  async save(user: any): Promise<void> {
    // Save to database
  }
}

// TODO: Write tests:
// 1. Using in-memory database
// 2. Using test database
// 3. Using mocked repository
// 4. Test transactions
// 5. Test rollback on error

/**
 * EXERCISE 10: TDD - Red-Green-Refactor
 * 
 * Implement a feature using TDD:
 * 
 * Feature: Shopping Cart Total Calculation
 * - Add items to cart
 * - Calculate subtotal
 * - Apply tax (8%)
 * - Apply coupon discounts
 * - Calculate final total
 */

// TODO: Following TDD:
// 
// RED: Write failing test
// - Test: addItem() adds item to cart
// 
// GREEN: Write minimal code to pass
// - Implement addItem()
//
// REFACTOR: Clean up
// - Extract to method
// - Add types
//
// Repeat for:
// - getSubtotal()
// - getTax()
// - applyCoupon()
// - getTotal()

/**
 * EXERCISE 11: Integration Testing
 * 
 * Test multiple components together:
 */

// TODO: Write integration test that:
// 1. Creates a user in database
// 2. Calls authentication service
// 3. Makes API request with token
// 4. Verifies database state changed
// 5. Cleans up test data
// 6. Tests error scenarios

/**
 * EXERCISE 12: Interview Question - Comprehensive Testing
 * 
 * "How would you test this payment processing function?
 *  Describe your test strategy."
 */

async function processPayment(
  amount: number,
  cardToken: string,
  userId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // Validate amount
  if (amount <= 0) {
    return { success: false, error: "Invalid amount" };
  }

  // Charge card
  try {
    const response = await stripeAPI.charge(amount, cardToken);
    
    // Save transaction
    await database.saveTransaction({
      userId,
      amount,
      transactionId: response.id,
      timestamp: new Date(),
    });

    // Send confirmation email
    await emailService.sendConfirmation(userId, amount);

    return { success: true, transactionId: response.id };
  } catch (error) {
    // Log error
    logger.error("Payment failed", { userId, amount, error });
    return { success: false, error: "Payment processing failed" };
  }
}

// TODO: Write test plan covering:
// 1. Unit tests - mock all dependencies
//    [ ] Successful payment
//    [ ] Invalid amount
//    [ ] Card declined
//    [ ] Network error
//
// 2. Integration tests - with real database
//    [ ] Transaction saved correctly
//    [ ] Transaction state verified
//    [ ] Idempotency (same transaction twice)
//
// 3. E2E tests - full flow
//    [ ] User sees confirmation
//    [ ] Email sent
//    [ ] Transaction visible in dashboard
//
// 4. Edge cases
//    [ ] Concurrent payments
//    [ ] Database failure
//    [ ] Email service failure
//    [ ] Partial failure (charged but DB fails)
//
// 5. Test data
//    [ ] Test cards for different scenarios
//    [ ] Test amounts
//    [ ] Test user types
//
// 6. Cleanup
//    [ ] Rollback test transactions
//    [ ] Delete test users
//    [ ] Clean logs
