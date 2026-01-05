# Lesson 26: Architectural Patterns & Clean Architecture

## Objective
Master high-level architectural patterns including Layered Architecture, Clean Architecture, Hexagonal Architecture, CQRS, Event Sourcing, Microservices patterns, and Module patterns for building scalable TypeScript applications.

## Topics Covered

### 1. Layered Architecture (N-Tier)
- **Presentation Layer**: UI and user interaction
- **Application Layer**: Business logic orchestration
- **Domain Layer**: Core business rules and entities
- **Infrastructure Layer**: Database, external services

**Benefits**: Clear separation of concerns, testability, maintainability

### 2. Clean Architecture (Uncle Bob)
- **Entities**: Enterprise business rules
- **Use Cases**: Application business rules
- **Interface Adapters**: Controllers, presenters, gateways
- **Frameworks & Drivers**: UI, DB, external agencies

**Key Principle**: Dependency Rule - source code dependencies point inward toward higher-level policies.

### 3. Hexagonal Architecture (Ports & Adapters)
- **Domain**: Core business logic
- **Ports**: Interfaces defining how domain interacts with outside
- **Adapters**: Implementations of ports (HTTP, DB, Message Queue)

**Benefits**: Technology-agnostic domain, easy to swap implementations

### 4. CQRS (Command Query Responsibility Segregation)
- **Commands**: Change state (Write operations)
- **Queries**: Return data (Read operations)
- **Separate Models**: Different models for reading and writing

**When to Use**: Complex domains, different optimization needs for reads/writes

### 5. Event-Driven Architecture
- **Event Producers**: Emit domain events
- **Event Consumers**: React to events
- **Event Bus**: Transport mechanism

**Benefits**: Loose coupling, scalability, audit trail

### 6. Microservices Patterns
- **Service Discovery**: Find service instances
- **API Gateway**: Single entry point
- **Circuit Breaker**: Prevent cascade failures
- **Saga Pattern**: Distributed transactions

### 7. Module Pattern
- **Module**: Self-contained unit of functionality
- **Dependencies**: Explicit module dependencies
- **Encapsulation**: Hide implementation details

## Architecture Comparison

| Architecture | Complexity | Flexibility | When to Use |
|--------------|------------|-------------|-------------|
| Layered | Low | Medium | Most applications |
| Clean | Medium | High | Complex business logic |
| Hexagonal | Medium | High | Need technology independence |
| CQRS | High | High | Complex read/write patterns |
| Microservices | Very High | Very High | Distributed systems |

## Clean Architecture Example

```typescript
// Domain Layer (innermost)
export class Order {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public status: OrderStatus
  ) {}
  
  submit(): void {
    if (this.items.length === 0) {
      throw new Error("Cannot submit empty order");
    }
    this.status = "submitted";
  }
}

// Use Case Layer
export class SubmitOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private eventBus: IEventBus
  ) {}
  
  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    order.submit();
    await this.orderRepository.save(order);
    await this.eventBus.publish({ type: "OrderSubmitted", orderId });
  }
}

// Interface Adapters Layer
export class OrderController {
  constructor(private submitOrder: SubmitOrderUseCase) {}
  
  async handleSubmit(req: Request, res: Response): Promise<void> {
    await this.submitOrder.execute(req.params.id);
    res.json({ success: true });
  }
}

// Infrastructure Layer (outermost)
export class PostgresOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order> {
    // Postgres-specific implementation
  }
  async save(order: Order): Promise<void> {
    // Postgres-specific implementation
  }
}
```

## CQRS Pattern

```typescript
// Write side (Commands)
interface CreateOrderCommand {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
}

class CreateOrderHandler {
  async handle(command: CreateOrderCommand): Promise<string> {
    const order = new Order(command.customerId, command.items);
    await this.repository.save(order);
    return order.id;
  }
}

// Read side (Queries)
interface GetOrderQuery {
  orderId: string;
}

interface OrderDTO {
  id: string;
  customer: string;
  items: Array<{ product: string; quantity: number; price: number }>;
  total: number;
}

class GetOrderHandler {
  async handle(query: GetOrderQuery): Promise<OrderDTO> {
    // Query optimized read model
    return await this.readModel.findOrder(query.orderId);
  }
}
```

## Module Pattern

```typescript
// User Module
export const UserModule = {
  controllers: [UserController],
  services: [UserService],
  repositories: [UserRepository],
  exports: [UserService], // What other modules can use
};

// Order Module  
export const OrderModule = {
  imports: [UserModule], // Dependencies
  controllers: [OrderController],
  services: [OrderService],
  repositories: [OrderRepository],
};

// Application bootstrapping
class Application {
  private modules: Module[] = [];
  
  bootstrap(rootModule: Module): void {
    this.resolveModule(rootModule);
    this.startServer();
  }
  
  private resolveModule(module: Module): void {
    // Resolve dependencies, create instances, inject dependencies
  }
}
```

## Learning Outcomes
- Design scalable application architectures
- Apply Clean Architecture principles
- Implement CQRS and Event Sourcing
- Structure large TypeScript applications
- Choose appropriate architecture for project needs

## Practice Challenges

1. **E-Commerce System**: Implement Clean Architecture with Orders, Products, Customers
2. **Blog Platform**: Build with Layered Architecture, separate concerns
3. **Task Manager**: Apply Hexagonal Architecture with multiple adapters
4. **Analytics System**: Implement CQRS with separate read/write models
5. **Notification System**: Event-driven architecture with multiple consumers
6. **Modular Monolith**: Design module boundaries and dependencies

## Anti-Patterns to Avoid

### 1. Big Ball of Mud
Lack of architecture, everything depends on everything.

### 2. Lasagna Architecture
Too many layers, unnecessary indirection.

### 3. Tight Coupling
Concrete dependencies instead of abstractions.

### 4. Anemic Domain Model
All logic in services, domain objects are just data containers.

## Resources
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Microsoft Architecture Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/)
- [Martin Fowler on Architecture](https://martinfowler.com/architecture/)

## Next Steps
Complete the exercises to design and implement complete application architectures following best practices and proven patterns.
