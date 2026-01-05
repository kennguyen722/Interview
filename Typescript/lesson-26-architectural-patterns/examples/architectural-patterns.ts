// ============================================================================
// ARCHITECTURAL PATTERNS - Working Examples
// ============================================================================

// ============================================================================
// 1. CLEAN ARCHITECTURE
// ============================================================================

// Domain Layer (Core Business Logic)
namespace Domain {
  export class Order {
    constructor(
      public readonly id: string,
      public readonly customerId: string,
      public items: OrderItem[],
      public status: OrderStatus = "draft"
    ) {}

    addItem(item: OrderItem): void {
      this.items.push(item);
    }

    calculateTotal(): number {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    submit(): void {
      if (this.items.length === 0) {
        throw new Error("Cannot submit empty order");
      }
      this.status = "submitted";
    }

    canCancel(): boolean {
      return this.status === "submitted" || this.status === "draft";
    }
  }

  export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
  }

  export type OrderStatus = "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled";
}

// Use Case Layer
namespace UseCase {
  export interface IOrderRepository {
    findById(id: string): Promise<Domain.Order>;
    save(order: Domain.Order): Promise<void>;
  }

  export interface IEventBus {
    publish(event: DomainEvent): Promise<void>;
  }

  export type DomainEvent = { type: "OrderSubmitted"; orderId: string } | { type: "OrderCancelled"; orderId: string };

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
      console.log(`Order ${orderId} submitted successfully`);
    }
  }
}

// Interface Adapters Layer
namespace Adapters {
  export class OrderController {
    constructor(private submitOrder: UseCase.SubmitOrderUseCase) {}

    async handleSubmit(orderId: string): Promise<{ success: boolean }> {
      try {
        await this.submitOrder.execute(orderId);
        return { success: true };
      } catch (error) {
        console.error("Failed to submit order:", error);
        return { success: false };
      }
    }
  }

  export class InMemoryOrderRepository implements UseCase.IOrderRepository {
    private orders: Map<string, Domain.Order> = new Map();

    async findById(id: string): Promise<Domain.Order> {
      const order = this.orders.get(id);
      if (!order) {
        throw new Error(`Order ${id} not found`);
      }
      return order;
    }

    async save(order: Domain.Order): Promise<void> {
      this.orders.set(order.id, order);
    }
  }

  export class InMemoryEventBus implements UseCase.IEventBus {
    async publish(event: UseCase.DomainEvent): Promise<void> {
      console.log("Event published:", event);
    }
  }
}

// ============================================================================
// 2. HEXAGONAL ARCHITECTURE (Ports & Adapters)
// ============================================================================

// Domain (Core)
namespace HexagonalDomain {
  export interface User {
    id: string;
    email: string;
    name: string;
  }

  export class UserService {
    constructor(
      private userRepository: IUserRepository,
      private emailService: IEmailService
    ) {}

    async registerUser(email: string, name: string): Promise<User> {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name,
      };

      await this.userRepository.save(user);
      await this.emailService.sendWelcomeEmail(email, name);

      return user;
    }

    async getUser(id: string): Promise<User> {
      return this.userRepository.findById(id);
    }
  }

  // Ports (Interfaces)
  export interface IUserRepository {
    findById(id: string): Promise<User>;
    save(user: User): Promise<void>;
  }

  export interface IEmailService {
    sendWelcomeEmail(email: string, name: string): Promise<void>;
  }
}

// Adapters (Infrastructure)
namespace HexagonalAdapters {
  // Repository Adapter
  export class PostgresUserRepository implements HexagonalDomain.IUserRepository {
    async findById(id: string): Promise<HexagonalDomain.User> {
      console.log(`[PostgreSQL] Finding user ${id}`);
      return { id, email: "user@example.com", name: "John Doe" };
    }

    async save(user: HexagonalDomain.User): Promise<void> {
      console.log(`[PostgreSQL] Saving user:`, user);
    }
  }

  export class MongoUserRepository implements HexagonalDomain.IUserRepository {
    async findById(id: string): Promise<HexagonalDomain.User> {
      console.log(`[MongoDB] Finding user ${id}`);
      return { id, email: "user@example.com", name: "Jane Doe" };
    }

    async save(user: HexagonalDomain.User): Promise<void> {
      console.log(`[MongoDB] Saving user:`, user);
    }
  }

  // Email Service Adapter
  export class SendGridEmailService implements HexagonalDomain.IEmailService {
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
      console.log(`[SendGrid] Sending welcome email to ${email}`);
    }
  }

  export class MailgunEmailService implements HexagonalDomain.IEmailService {
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
      console.log(`[Mailgun] Sending welcome email to ${email}`);
    }
  }
}

// ============================================================================
// 3. CQRS PATTERN
// ============================================================================

namespace CQRS {
  // Write Model (Commands)
  export interface CreateProductCommand {
    name: string;
    price: number;
    quantity: number;
  }

  export interface UpdateInventoryCommand {
    productId: string;
    quantity: number;
  }

  export class ProductWriteModel {
    constructor(private eventStore: IEventStore) {}

    async createProduct(command: CreateProductCommand): Promise<string> {
      const productId = crypto.randomUUID();
      const event: ProductCreatedEvent = {
        type: "ProductCreated",
        productId,
        name: command.name,
        price: command.price,
        quantity: command.quantity,
        timestamp: new Date(),
      };

      await this.eventStore.append(event);
      console.log(`Product ${productId} created`);
      return productId;
    }

    async updateInventory(command: UpdateInventoryCommand): Promise<void> {
      const event: InventoryUpdatedEvent = {
        type: "InventoryUpdated",
        productId: command.productId,
        quantity: command.quantity,
        timestamp: new Date(),
      };

      await this.eventStore.append(event);
      console.log(`Inventory updated for product ${command.productId}`);
    }
  }

  // Read Model (Queries)
  export interface ProductDTO {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }

  export class ProductReadModel {
    private products: Map<string, ProductDTO> = new Map();

    constructor(private queryDatabase: IProductQueryDatabase) {
      // Subscribe to events to update read model
    }

    async getProduct(productId: string): Promise<ProductDTO | undefined> {
      console.log(`Querying product ${productId} from read model`);
      return this.queryDatabase.findById(productId);
    }

    async getAvailableProducts(): Promise<ProductDTO[]> {
      console.log("Querying available products from read model");
      return this.queryDatabase.findAvailable();
    }
  }

  // Infrastructure
  export interface IEventStore {
    append(event: DomainEvent): Promise<void>;
    getEvents(): Promise<DomainEvent[]>;
  }

  export interface IProductQueryDatabase {
    findById(id: string): Promise<ProductDTO | undefined>;
    findAvailable(): Promise<ProductDTO[]>;
  }

  export type DomainEvent = ProductCreatedEvent | InventoryUpdatedEvent;

  export interface ProductCreatedEvent {
    type: "ProductCreated";
    productId: string;
    name: string;
    price: number;
    quantity: number;
    timestamp: Date;
  }

  export interface InventoryUpdatedEvent {
    type: "InventoryUpdated";
    productId: string;
    quantity: number;
    timestamp: Date;
  }
}

// ============================================================================
// 4. LAYERED ARCHITECTURE
// ============================================================================

// Presentation Layer
namespace Presentation {
  export class UserController {
    constructor(private userService: Application.UserApplicationService) {}

    async registerUser(email: string, name: string): Promise<void> {
      try {
        const userId = await this.userService.registerUser(email, name);
        console.log(`User registered with ID: ${userId}`);
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  }
}

// Application Layer
namespace Application {
  export class UserApplicationService {
    constructor(
      private userRepository: DataAccess.IUserRepository,
      private emailService: Infrastructure.IEmailService
    ) {}

    async registerUser(email: string, name: string): Promise<string> {
      // Business logic
      if (!email.includes("@")) {
        throw new Error("Invalid email");
      }

      const userId = crypto.randomUUID();
      await this.userRepository.save({ id: userId, email, name });
      await this.emailService.send(email, "Welcome!", "Welcome to our platform");

      return userId;
    }
  }
}

// Data Access Layer
namespace DataAccess {
  export interface IUserRepository {
    save(user: { id: string; email: string; name: string }): Promise<void>;
    findById(id: string): Promise<any>;
  }

  export class UserRepository implements IUserRepository {
    async save(user: { id: string; email: string; name: string }): Promise<void> {
      console.log("[DB] Saving user:", user);
    }

    async findById(id: string): Promise<any> {
      console.log("[DB] Finding user:", id);
      return { id, email: "user@example.com", name: "User" };
    }
  }
}

// Infrastructure Layer
namespace Infrastructure {
  export interface IEmailService {
    send(to: string, subject: string, body: string): Promise<void>;
  }

  export class EmailService implements IEmailService {
    async send(to: string, subject: string, body: string): Promise<void> {
      console.log(`[Email] Sending to ${to}: ${subject}`);
    }
  }
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

console.log("\n=== CLEAN ARCHITECTURE ===");
(async () => {
  const repository = new Adapters.InMemoryOrderRepository();
  const eventBus = new Adapters.InMemoryEventBus();
  const useCase = new UseCase.SubmitOrderUseCase(repository, eventBus);
  const controller = new Adapters.OrderController(useCase);

  const order = new Domain.Order("order-1", "customer-1", [
    { productId: "prod-1", quantity: 2, price: 10 },
  ]);
  await repository.save(order);

  await controller.handleSubmit("order-1");
})();

console.log("\n=== HEXAGONAL ARCHITECTURE ===");
(async () => {
  const postgresRepo = new HexagonalAdapters.PostgresUserRepository();
  const sendgridEmail = new HexagonalAdapters.SendGridEmailService();

  const userService1 = new HexagonalDomain.UserService(postgresRepo, sendgridEmail);
  await userService1.registerUser("user1@example.com", "Alice");

  // Easy to swap adapters
  const mongoRepo = new HexagonalAdapters.MongoUserRepository();
  const mailgunEmail = new HexagonalAdapters.MailgunEmailService();

  const userService2 = new HexagonalDomain.UserService(mongoRepo, mailgunEmail);
  await userService2.registerUser("user2@example.com", "Bob");
})();

console.log("\n=== LAYERED ARCHITECTURE ===");
(async () => {
  const userRepo = new DataAccess.UserRepository();
  const emailService = new Infrastructure.EmailService();
  const userService = new Application.UserApplicationService(userRepo, emailService);
  const controller = new Presentation.UserController(userService);

  await controller.registerUser("newuser@example.com", "Charlie");
})();
