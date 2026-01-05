# Lesson 15: Domain-Driven Design & Hexagonal Architecture

## Objective
Apply Domain-Driven Design principles and Hexagonal Architecture patterns using TypeScript's type system to build maintainable, testable enterprise applications.

## Topics Covered

### 1. DDD Building Blocks
- **Value Objects**: Immutable types with validation
- **Entities**: Objects with identity and lifecycle
- **Aggregates**: Consistency boundaries and invariants
- **Domain Events**: Capturing business state changes
- **Repositories**: Persistence abstraction

### 2. Hexagonal Architecture (Ports & Adapters)
- **Domain Layer**: Pure business logic
- **Application Layer**: Use cases and orchestration
- **Infrastructure Layer**: External concerns (DB, HTTP, etc.)
- **Ports**: Interfaces defining boundaries
- **Adapters**: Implementations of ports

### 3. Strategic Design Patterns
- **Bounded Contexts**: Explicit boundaries
- **Context Mapping**: Relationships between contexts
- **Shared Kernel**: Common types and utilities
- **Anti-Corruption Layer**: Translation between contexts

### 4. TypeScript DDD Patterns
- Branded types for value objects
- Discriminated unions for domain events
- Builder pattern for aggregates
- Result types for domain operations

## Learning Outcomes
- Model complex domains with type-safe value objects and entities
- Implement hexagonal architecture with clear separation
- Design aggregate boundaries and enforce invariants
- Use domain events for decoupled communication
- Build testable business logic independent of infrastructure

## Key Concepts

### Value Object Pattern
```typescript
declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

type Email = Brand<string, "Email">;
type PositiveInt = Brand<number, "PositiveInt">;

function createEmail(value: string): Email | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? (value as Email) : null;
}
```

### Entity Pattern
```typescript
abstract class Entity<T> {
  protected constructor(private readonly _id: T, private readonly _createdAt: Date) {}

  get id(): T {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  equals(other: Entity<T>): boolean {
    return this._id === other._id;
  }
}
```

### Aggregate Pattern
```typescript
class Order extends Entity<OrderId> {
  private constructor(
    id: OrderId,
    createdAt: Date,
    private customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {
    super(id, createdAt);
  }

  addItem(item: OrderItem): Result<void, DomainError> {
    if (this.status !== "draft") {
      return failure(new OrderNotModifiableError());
    }
    this.items.push(item);
    return success(undefined);
  }

  // Invariants enforced within aggregate
  submit(): Result<void, DomainError> {
    if (this.items.length === 0) {
      return failure(new EmptyOrderError());
    }
    this.status = "submitted";
    return success(undefined);
  }
}
```

## Hands-On Examples

See `examples/ddd-ecommerce.ts` for a complete e-commerce domain model with:
- Value objects: Email, Money, ProductId, OrderId
- Entities: Customer, Product, OrderItem
- Aggregates: Order (with invariants)
- Domain events: OrderCreated, OrderSubmitted, PaymentProcessed
- Repository interfaces: IOrderRepository, ICustomerRepository

## Practice Challenges

1. **User Management Context**: Model User aggregate with Email, Password (value objects), and registration/password change use cases
2. **Inventory Context**: Product catalog with SKU, StockLevel, and ReserveStock/ReleaseStock operations
3. **Payment Context**: Payment entity with PaymentMethod value object and ProcessPayment use case
4. **Port & Adapter**: Implement INotificationPort with EmailAdapter and SMSAdapter
5. **Domain Events**: Create EventBus and event handlers for OrderSubmitted → SendConfirmationEmail

## Architectural Layers

```
┌─────────────────────────────────────────────┐
│           API Layer (HTTP/CLI)              │
│         (Presentation/Adapters)             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        Application Layer (Use Cases)        │
│    SubmitOrderUseCase, ProcessPayment       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│     Domain Layer (Business Logic)           │
│  Entities, Value Objects, Aggregates        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│    Infrastructure Layer (Adapters)          │
│  DB Repositories, External APIs, Events     │
└─────────────────────────────────────────────┘
```

## Testing Strategies
- **Unit Tests**: Domain logic without infrastructure
- **Integration Tests**: Use cases with in-memory repositories
- **Contract Tests**: Verify port implementations match interfaces

## Additional Resources
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing DDD by Vaughn Vernon](https://vaughnvernon.co/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

## Next Steps
Complete the exercises in `exercises/starter.ts` to practice modeling domains with DDD patterns and hexagonal architecture.
