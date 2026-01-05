// Solution to Lesson 15 Exercises: DDD & Hexagonal Architecture

// Common utilities
declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

type Success<T> = { success: true; value: T };
type Failure<E> = { success: false; error: E };
type Result<T, E> = Success<T> | Failure<E>;

function success<T>(value: T): Success<T> {
  return { success: true, value };
}

function failure<E>(error: E): Failure<E> {
  return { success: false, error };
}

class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Exercise 1: User Management Bounded Context

type Email = Brand<string, "Email">;
type UserId = Brand<string, "UserId">;

function createEmail(value: string): Email | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? (value as Email) : null;
}

class Password {
  private constructor(private readonly hashedValue: string) {}

  static async create(plain: string): Promise<Password | null> {
    if (plain.length < 8) return null;
    if (!/[A-Z]/.test(plain)) return null;
    if (!/[a-z]/.test(plain)) return null;
    if (!/[0-9]/.test(plain)) return null;

    // In real implementation, use bcrypt
    const hashed = `hashed_${plain}`;
    return new Password(hashed);
  }

  async verify(plain: string): Promise<boolean> {
    const hashed = `hashed_${plain}`;
    return this.hashedValue === hashed;
  }
}

class WeakPasswordError extends DomainError {
  constructor() {
    super("Password must be at least 8 characters with uppercase, lowercase, and number");
  }
}

class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid email or password");
  }
}

class User {
  private constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private _password: Password,
    private readonly _createdAt: Date
  ) {}

  static async register(
    id: UserId,
    email: Email,
    password: Password
  ): Promise<Result<User, DomainError>> {
    const user = new User(id, email, password, new Date());
    return success(user);
  }

  async changePassword(
    oldPassword: string,
    newPassword: Password
  ): Promise<Result<void, DomainError>> {
    const isValid = await this._password.verify(oldPassword);
    if (!isValid) {
      return failure(new InvalidCredentialsError());
    }

    this._password = newPassword;
    return success(undefined);
  }

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }
}

interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  exists(email: Email): Promise<boolean>;
}

class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<Result<User, DomainError>> {
    const validEmail = createEmail(email);
    if (!validEmail) {
      return failure(new DomainError("Invalid email format"));
    }

    const exists = await this.userRepository.exists(validEmail);
    if (exists) {
      return failure(new DomainError("Email already registered"));
    }

    const validPassword = await Password.create(password);
    if (!validPassword) {
      return failure(new WeakPasswordError());
    }

    const userId = crypto.randomUUID() as UserId;
    const userResult = await User.register(userId, validEmail, validPassword);

    if (userResult.success) {
      await this.userRepository.save(userResult.value);
    }

    return userResult;
  }
}

// Exercise 2: Inventory Bounded Context

type SKU = Brand<string, "SKU">;
type ProductId = Brand<string, "ProductId">;

function createSKU(value: string): SKU | null {
  const regex = /^[A-Z]{3}-\d{3}-[A-Z]{3}$/;
  return regex.test(value) ? (value as SKU) : null;
}

class StockLevel {
  private constructor(private readonly _value: number) {}

  static create(value: number): StockLevel | null {
    if (value < 0) return null;
    return new StockLevel(value);
  }

  get value(): number {
    return this._value;
  }

  subtract(quantity: number): StockLevel | null {
    return StockLevel.create(this._value - quantity);
  }

  add(quantity: number): StockLevel | null {
    return StockLevel.create(this._value + quantity);
  }
}

class InsufficientStockError extends DomainError {
  constructor() {
    super("Insufficient stock available");
  }
}

class ProductAggregate {
  private reservedStock = 0;

  constructor(
    private readonly _id: ProductId,
    private readonly _sku: SKU,
    private availableStock: StockLevel
  ) {}

  reserveStock(quantity: number): Result<void, DomainError> {
    const newAvailable = this.availableStock.subtract(quantity);
    if (!newAvailable) {
      return failure(new InsufficientStockError());
    }

    this.availableStock = newAvailable;
    this.reservedStock += quantity;
    return success(undefined);
  }

  releaseStock(quantity: number): Result<void, DomainError> {
    if (quantity > this.reservedStock) {
      return failure(new DomainError("Cannot release more than reserved"));
    }

    const newAvailable = this.availableStock.add(quantity);
    if (!newAvailable) {
      return failure(new DomainError("Invalid stock operation"));
    }

    this.availableStock = newAvailable;
    this.reservedStock -= quantity;
    return success(undefined);
  }

  addStock(quantity: number): Result<void, DomainError> {
    const newAvailable = this.availableStock.add(quantity);
    if (!newAvailable) {
      return failure(new DomainError("Invalid stock quantity"));
    }

    this.availableStock = newAvailable;
    return success(undefined);
  }

  get id(): ProductId {
    return this._id;
  }

  get sku(): SKU {
    return this._sku;
  }

  get available(): number {
    return this.availableStock.value;
  }

  get reserved(): number {
    return this.reservedStock;
  }
}

interface IInventoryRepository {
  save(product: ProductAggregate): Promise<void>;
  findById(id: ProductId): Promise<ProductAggregate | null>;
  findBySKU(sku: SKU): Promise<ProductAggregate | null>;
}

// Exercise 3: Payment Processing Context

type PaymentMethod = 
  | { type: "CreditCard"; cardNumber: string; cvv: string }
  | { type: "PayPal"; email: Email }
  | { type: "BankTransfer"; accountNumber: string; routingNumber: string };

type PaymentId = Brand<string, "PaymentId">;
type TransactionId = Brand<string, "TransactionId">;
type OrderId = Brand<string, "OrderId">;

type PaymentStatus = "pending" | "processing" | "completed" | "failed";

class PaymentEntity {
  private _status: PaymentStatus = "pending";
  private _transactionId?: TransactionId;
  private _failureReason?: string;

  constructor(
    private readonly _id: PaymentId,
    private readonly _orderId: OrderId,
    private readonly _amount: number,
    private readonly _method: PaymentMethod
  ) {}

  process(): Result<void, DomainError> {
    if (this._status !== "pending") {
      return failure(new DomainError("Payment already processed"));
    }

    this._status = "processing";
    return success(undefined);
  }

  complete(transactionId: TransactionId): Result<void, DomainError> {
    if (this._status !== "processing") {
      return failure(new DomainError("Payment not in processing state"));
    }

    this._status = "completed";
    this._transactionId = transactionId;
    return success(undefined);
  }

  fail(reason: string): Result<void, DomainError> {
    if (this._status === "completed") {
      return failure(new DomainError("Cannot fail completed payment"));
    }

    this._status = "failed";
    this._failureReason = reason;
    return success(undefined);
  }

  get id(): PaymentId {
    return this._id;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get transactionId(): TransactionId | undefined {
    return this._transactionId;
  }
}

interface IPaymentGateway {
  authorize(amount: number, method: PaymentMethod): Promise<Result<TransactionId, string>>;
  capture(transactionId: TransactionId): Promise<Result<void, string>>;
}

interface IPaymentRepository {
  save(payment: PaymentEntity): Promise<void>;
  findById(id: PaymentId): Promise<PaymentEntity | null>;
}

class ProcessPaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private paymentGateway: IPaymentGateway
  ) {}

  async execute(paymentId: PaymentId): Promise<Result<TransactionId, DomainError>> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      return failure(new DomainError("Payment not found"));
    }

    const processResult = payment.process();
    if (!processResult.success) {
      return failure(processResult.error);
    }

    await this.paymentRepository.save(payment);

    // Call external gateway
    const authResult = await this.paymentGateway.authorize(100, { type: "CreditCard", cardNumber: "1234", cvv: "123" });

    if (!authResult.success) {
      payment.fail(authResult.error);
      await this.paymentRepository.save(payment);
      return failure(new DomainError(authResult.error));
    }

    const completeResult = payment.complete(authResult.value);
    if (!completeResult.success) {
      return failure(completeResult.error);
    }

    await this.paymentRepository.save(payment);
    return success(authResult.value);
  }
}

// Exercise 4: Notification Port with Multiple Adapters

interface INotificationPort {
  send(recipient: string, subject: string, body: string): Promise<void>;
}

class EmailAdapter implements INotificationPort {
  async send(recipient: string, subject: string, body: string): Promise<void> {
    console.log(`📧 Email to ${recipient}: ${subject}`);
    console.log(body);
  }
}

class SMSAdapter implements INotificationPort {
  async send(recipient: string, subject: string, body: string): Promise<void> {
    console.log(`📱 SMS to ${recipient}: ${body}`);
  }
}

class CompositeNotificationAdapter implements INotificationPort {
  constructor(private adapters: INotificationPort[]) {}

  async send(recipient: string, subject: string, body: string): Promise<void> {
    await Promise.all(
      this.adapters.map((adapter) => adapter.send(recipient, subject, body))
    );
  }
}

// Exercise 5: Domain Events and Event Handlers

type OrderDomainEvent =
  | { type: "OrderCreated"; orderId: OrderId; customerId: string; timestamp: Date }
  | { type: "OrderSubmitted"; orderId: OrderId; items: string[]; total: number; timestamp: Date }
  | { type: "OrderCancelled"; orderId: OrderId; reason: string; timestamp: Date };

interface IEventHandler<T> {
  handle(event: T): Promise<void>;
}

class SendConfirmationEmailHandler implements IEventHandler<OrderDomainEvent> {
  constructor(private notificationPort: INotificationPort) {}

  async handle(event: OrderDomainEvent): Promise<void> {
    if (event.type === "OrderSubmitted") {
      await this.notificationPort.send(
        "customer@example.com",
        "Order Confirmation",
        `Your order ${event.orderId} has been submitted. Total: $${event.total}`
      );
    }
  }
}

class ReserveInventoryHandler implements IEventHandler<OrderDomainEvent> {
  constructor(private inventoryRepo: IInventoryRepository) {}

  async handle(event: OrderDomainEvent): Promise<void> {
    if (event.type === "OrderSubmitted") {
      console.log(`📦 Reserving inventory for order ${event.orderId}`);
      // In real implementation, iterate over items and reserve stock
    }
  }
}

class DomainEventBus {
  private handlers = new Map<string, IEventHandler<any>[]>();

  subscribe<T>(eventType: string, handler: IEventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish<T extends { type: string }>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map((handler) => handler.handle(event)));
  }
}

// Exercise 6: Anti-Corruption Layer

interface ModernProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface LegacyProductDTO {
  product_id: string;
  product_name: string;
  price_cents: number;
  price_currency_code: string;
}

class ProductAntiCorruptionLayer {
  toDomain(legacy: LegacyProductDTO): ModernProduct {
    return {
      id: legacy.product_id,
      name: legacy.product_name,
      price: legacy.price_cents / 100,
      currency: legacy.price_currency_code,
    };
  }

  fromDomain(modern: ModernProduct): LegacyProductDTO {
    return {
      product_id: modern.id,
      product_name: modern.name,
      price_cents: Math.round(modern.price * 100),
      price_currency_code: modern.currency,
    };
  }
}

// Demo
async function demoSolutions() {
  // User registration
  const userRepo = {} as IUserRepository;
  const registerUseCase = new RegisterUserUseCase(userRepo);

  // Payment processing
  const paymentRepo = {} as IPaymentRepository;
  const paymentGateway = {} as IPaymentGateway;
  const processPaymentUseCase = new ProcessPaymentUseCase(paymentRepo, paymentGateway);

  // Event handling
  const emailAdapter = new EmailAdapter();
  const smsAdapter = new SMSAdapter();
  const compositeNotification = new CompositeNotificationAdapter([emailAdapter, smsAdapter]);

  const eventBus = new DomainEventBus();
  eventBus.subscribe("OrderSubmitted", new SendConfirmationEmailHandler(compositeNotification));
  eventBus.subscribe("OrderSubmitted", new ReserveInventoryHandler({} as IInventoryRepository));

  // Publish event
  await eventBus.publish({
    type: "OrderSubmitted",
    orderId: "order-123" as OrderId,
    items: ["item1", "item2"],
    total: 99.99,
    timestamp: new Date(),
  });

  // Anti-corruption layer
  const acl = new ProductAntiCorruptionLayer();
  const legacyProduct: LegacyProductDTO = {
    product_id: "123",
    product_name: "Widget",
    price_cents: 1999,
    price_currency_code: "USD",
  };

  const modernProduct = acl.toDomain(legacyProduct);
  console.log(modernProduct); // { id: "123", name: "Widget", price: 19.99, currency: "USD" }
}

export {
  User,
  RegisterUserUseCase,
  ProductAggregate,
  PaymentEntity,
  ProcessPaymentUseCase,
  EmailAdapter,
  SMSAdapter,
  CompositeNotificationAdapter,
  DomainEventBus,
  SendConfirmationEmailHandler,
  ReserveInventoryHandler,
  ProductAntiCorruptionLayer,
  demoSolutions,
};
