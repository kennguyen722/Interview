// Example: E-Commerce Domain with DDD & Hexagonal Architecture

// ============================================================
// DOMAIN LAYER - Pure Business Logic
// ============================================================

// Branded Types for Value Objects
declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

// Value Objects
type Email = Brand<string, "Email">;
type CustomerId = Brand<string, "CustomerId">;
type ProductId = Brand<string, "ProductId">;
type OrderId = Brand<string, "OrderId">;

// Money Value Object
class Money {
  private constructor(private readonly _amount: number, private readonly _currency: string) {}

  static create(amount: number, currency: string): Money | null {
    if (amount < 0) return null;
    return new Money(amount, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money | null {
    if (this._currency !== other._currency) return null;
    return new Money(this._amount + other._amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }
}

// Result Type for Domain Operations
type Success<T> = { success: true; value: T };
type Failure<E> = { success: false; error: E };
type Result<T, E> = Success<T> | Failure<E>;

function success<T>(value: T): Success<T> {
  return { success: true, value };
}

function failure<E>(error: E): Failure<E> {
  return { success: false, error };
}

// Domain Errors
class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class OrderNotModifiableError extends DomainError {
  constructor() {
    super("Cannot modify order in current status");
  }
}

class EmptyOrderError extends DomainError {
  constructor() {
    super("Cannot submit empty order");
  }
}

class InsufficientStockError extends DomainError {
  constructor(productId: string) {
    super(`Insufficient stock for product ${productId}`);
  }
}

// Entity Base Class
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

// Domain Events
type DomainEvent =
  | { type: "OrderCreated"; orderId: OrderId; customerId: CustomerId; timestamp: Date }
  | { type: "OrderSubmitted"; orderId: OrderId; total: Money; timestamp: Date }
  | { type: "OrderCancelled"; orderId: OrderId; reason: string; timestamp: Date }
  | { type: "PaymentProcessed"; orderId: OrderId; amount: Money; timestamp: Date };

// OrderItem Entity
class OrderItem {
  constructor(
    private readonly _productId: ProductId,
    private readonly _quantity: number,
    private readonly _unitPrice: Money
  ) {}

  get productId(): ProductId {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  get totalPrice(): Money {
    return this._unitPrice.multiply(this._quantity);
  }
}

// Order Status
type OrderStatus = "draft" | "submitted" | "paid" | "shipped" | "cancelled";

// Order Aggregate Root
class Order extends Entity<OrderId> {
  private events: DomainEvent[] = [];

  private constructor(
    id: OrderId,
    createdAt: Date,
    private customerId: CustomerId,
    private items: OrderItem[],
    private _status: OrderStatus
  ) {
    super(id, createdAt);
  }

  static create(orderId: OrderId, customerId: CustomerId): Order {
    const order = new Order(orderId, new Date(), customerId, [], "draft");
    order.addEvent({
      type: "OrderCreated",
      orderId,
      customerId,
      timestamp: new Date(),
    });
    return order;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get total(): Money {
    if (this.items.length === 0) {
      return Money.create(0, "USD")!;
    }
    return this.items.reduce((sum, item) => sum.add(item.totalPrice)!, this.items[0].totalPrice);
  }

  addItem(item: OrderItem): Result<void, DomainError> {
    if (this._status !== "draft") {
      return failure(new OrderNotModifiableError());
    }
    this.items.push(item);
    return success(undefined);
  }

  submit(): Result<void, DomainError> {
    if (this.items.length === 0) {
      return failure(new EmptyOrderError());
    }
    if (this._status !== "draft") {
      return failure(new OrderNotModifiableError());
    }

    this._status = "submitted";
    this.addEvent({
      type: "OrderSubmitted",
      orderId: this.id,
      total: this.total,
      timestamp: new Date(),
    });
    return success(undefined);
  }

  cancel(reason: string): Result<void, DomainError> {
    if (this._status === "shipped") {
      return failure(new DomainError("Cannot cancel shipped order"));
    }

    this._status = "cancelled";
    this.addEvent({
      type: "OrderCancelled",
      orderId: this.id,
      reason,
      timestamp: new Date(),
    });
    return success(undefined);
  }

  markAsPaid(amount: Money): Result<void, DomainError> {
    if (this._status !== "submitted") {
      return failure(new DomainError("Order must be submitted before payment"));
    }

    this._status = "paid";
    this.addEvent({
      type: "PaymentProcessed",
      orderId: this.id,
      amount,
      timestamp: new Date(),
    });
    return success(undefined);
  }

  private addEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

// ============================================================
// APPLICATION LAYER - Use Cases
// ============================================================

// Ports (Interfaces)
interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findByCustomerId(customerId: CustomerId): Promise<Order[]>;
}

interface IProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  checkStock(productId: ProductId, quantity: number): Promise<boolean>;
}

interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
}

interface INotificationPort {
  send(recipient: Email, subject: string, body: string): Promise<void>;
}

// Product Entity (simplified)
class Product extends Entity<ProductId> {
  constructor(
    id: ProductId,
    createdAt: Date,
    private _name: string,
    private _price: Money,
    private _stock: number
  ) {
    super(id, createdAt);
  }

  get name(): string {
    return this._name;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  hasStock(quantity: number): boolean {
    return this._stock >= quantity;
  }
}

// Use Case: Submit Order
class SubmitOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private eventBus: IEventBus
  ) {}

  async execute(orderId: OrderId): Promise<Result<void, DomainError>> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      return failure(new DomainError("Order not found"));
    }

    // Validate stock availability
    // (In real system, this would be more sophisticated)

    const result = order.submit();
    if (!result.success) {
      return result;
    }

    await this.orderRepository.save(order);

    // Publish domain events
    const events = order.getDomainEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
    order.clearEvents();

    return success(undefined);
  }
}

// ============================================================
// INFRASTRUCTURE LAYER - Adapters
// ============================================================

// In-Memory Repository Adapter
class InMemoryOrderRepository implements IOrderRepository {
  private orders = new Map<OrderId, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async findByCustomerId(customerId: CustomerId): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((order) => order.equals(order));
  }
}

// Email Notification Adapter
class EmailNotificationAdapter implements INotificationPort {
  async send(recipient: Email, subject: string, body: string): Promise<void> {
    console.log(`📧 Sending email to ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}

// Event Bus Adapter
class InMemoryEventBus implements IEventBus {
  private handlers = new Map<DomainEvent["type"], ((event: DomainEvent) => Promise<void>)[]>();

  subscribe(eventType: DomainEvent["type"], handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map((handler) => handler(event)));
  }
}

// Demo Usage
async function demo() {
  // Setup infrastructure
  const orderRepo = new InMemoryOrderRepository();
  const productRepo = {} as IProductRepository; // Mock
  const eventBus = new InMemoryEventBus();
  const emailAdapter = new EmailNotificationAdapter();

  // Subscribe to domain events
  eventBus.subscribe("OrderSubmitted", async (event) => {
    if (event.type === "OrderSubmitted") {
      console.log(`✅ Order ${event.orderId} submitted with total ${event.total.amount}`);
      // Trigger notification
      await emailAdapter.send("customer@example.com" as Email, "Order Confirmed", "Thanks!");
    }
  });

  // Create and submit order
  const orderId = "order-123" as OrderId;
  const customerId = "cust-456" as CustomerId;
  const productId = "prod-789" as ProductId;

  const order = Order.create(orderId, customerId);
  const item = new OrderItem(productId, 2, Money.create(50, "USD")!);

  order.addItem(item);
  await orderRepo.save(order);

  // Execute use case
  const useCase = new SubmitOrderUseCase(orderRepo, productRepo, eventBus);
  const result = await useCase.execute(orderId);

  if (result.success) {
    console.log("Order submitted successfully!");
  } else {
    console.error(`Error: ${result.error.message}`);
  }
}

export {
  Money,
  Order,
  OrderItem,
  Product,
  SubmitOrderUseCase,
  InMemoryOrderRepository,
  EmailNotificationAdapter,
  InMemoryEventBus,
  demo,
};
