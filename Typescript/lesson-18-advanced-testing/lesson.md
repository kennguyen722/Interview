# Lesson 18: Advanced Testing Patterns & Strategies

## Objective
Master advanced testing techniques including property-based testing, contract testing, snapshot testing, test doubles (mocks, stubs, spies), and mutation testing for TypeScript applications.

## Topics Covered

### 1. Property-Based Testing
- Generating random test inputs
- Defining properties that should always hold
- Shrinking failing test cases
- Using fast-check library

### 2. Contract Testing
- Consumer-driven contracts
- Provider verification
- Pact framework integration
- API compatibility testing

### 3. Snapshot Testing
- Component snapshot testing
- Inline snapshots
- Snapshot diff analysis
- When to use and avoid snapshots

### 4. Advanced Test Doubles
- Mocks vs Stubs vs Spies vs Fakes
- Test double best practices
- Type-safe mocking with ts-mockito
- Avoiding test brittleness

### 5. Mutation Testing
- Code coverage vs mutation coverage
- Stryker framework
- Identifying weak tests
- Improving test quality

### 6. Integration Testing Strategies
- Testing pyramidvs Testing Trophy
- In-memory databases for tests
- Test containers
- API integration tests

### 7. Time and Async Testing
- Mocking timers and dates
- Testing debounce/throttle
- Promise testing patterns
- Testing retry logic

## Learning Outcomes
- Write property-based tests that explore edge cases
- Implement contract testing for microservices
- Use snapshots effectively without brittleness
- Create maintainable test doubles
- Measure and improve test quality with mutation testing
- Design comprehensive integration test strategies

## Key Concepts

### Property-Based Testing
```typescript
import fc from "fast-check";

test("reversing twice returns original", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const reversed = arr.reverse().reverse();
      expect(reversed).toEqual(arr);
    })
  );
});
```

### Contract Testing
```typescript
import { Pact } from "@pact-foundation/pact";

const provider = new Pact({
  consumer: "UserService",
  provider: "OrderService",
});

test("get order by id", async () => {
  await provider.addInteraction({
    state: "order exists",
    uponReceiving: "a request for order 123",
    withRequest: { method: "GET", path: "/orders/123" },
    willRespondWith: {
      status: 200,
      body: { id: 123, status: "shipped" },
    },
  });

  // Test consumer code
});
```

### Snapshot Testing
```typescript
test("renders user card correctly", () => {
  const user = { name: "Alice", age: 30 };
  const result = renderUserCard(user);
  expect(result).toMatchSnapshot();
});
```

## Hands-On Examples

See `examples/advanced-testing.ts` for:
- Property-based test suites
- Contract test examples
- Snapshot testing patterns
- Test double demonstrations
- Integration test setups

## Practice Challenges

1. **Property Test: Sorting Algorithm**: Write property tests for a sort function
2. **Contract Test: API Gateway**: Test contracts between gateway and services
3. **Snapshot Test: Component Library**: Snapshot test React components
4. **Mock Strategy: Database Layer**: Create type-safe database mocks
5. **Mutation Testing**: Run Stryker and improve test coverage
6. **Time Testing**: Test debounced search functionality
7. **Integration Test: Auth Flow**: Test full authentication workflow
8. **Async Testing**: Test concurrent operations with race conditions

## Testing Anti-Patterns to Avoid

### ❌ Testing Implementation Details
```typescript
// Bad: Testing internal state
expect(component.state.isLoading).toBe(true);

// Good: Testing observable behavior
expect(screen.getByText("Loading...")).toBeInTheDocument();
```

### ❌ Brittle Snapshots
```typescript
// Bad: Snapshotting timestamps
expect(result).toMatchSnapshot(); // { timestamp: 1642012345678 }

// Good: Normalize dynamic data
expect({ ...result, timestamp: expect.any(Number) }).toMatchSnapshot();
```

### ❌ Overusing Mocks
```typescript
// Bad: Mocking everything
const mockDb = mock<Database>();
const mockLogger = mock<Logger>();
const mockCache = mock<Cache>();

// Good: Use real implementations where possible
const db = new InMemoryDatabase();
const logger = new TestLogger();
```

## Testing Strategies

### Test Pyramid
```
       E2E Tests (Few)
      /            \
  Integration Tests (Some)
 /                      \
Unit Tests (Many)
```

### Testing Trophy (Modern Approach)
```
      E2E (Few)
     /        \
Integration (Most)
   /            \
Unit (Many)  Static (Lots)
```

## Tools and Libraries

- **fast-check**: Property-based testing
- **Pact**: Contract testing
- **Stryker**: Mutation testing
- **ts-mockito**: Type-safe mocking
- **Testcontainers**: Docker containers for integration tests
- **MSW**: API mocking for tests
- **Vitest/Jest**: Test runners

## Resources
- [Property-Based Testing with fast-check](https://github.com/dubzzz/fast-check)
- [Contract Testing with Pact](https://docs.pact.io/)
- [Mutation Testing with Stryker](https://stryker-mutator.io/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

## Next Steps
Complete the exercises in `exercises/starter.ts` to build a comprehensive test suite using advanced patterns. These techniques will help you catch bugs earlier and build more reliable software.
