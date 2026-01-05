// Example 1: Factory Pattern with overloads
interface Shape {
  type: string;
  area(): number;
  draw(): void;
}

interface Circle extends Shape {
  type: "circle";
  radius: number;
}

interface Rectangle extends Shape {
  type: "rectangle";
  width: number;
  height: number;
}

interface Triangle extends Shape {
  type: "triangle";
  base: number;
  height: number;
}

type ShapeType = Circle | Rectangle | Triangle;

class ShapeFactory {
  static create(type: "circle", radius: number): Circle;
  static create(type: "rectangle", width: number, height: number): Rectangle;
  static create(type: "triangle", base: number, height: number): Triangle;
  static create(type: string, ...args: number[]): ShapeType {
    switch (type) {
      case "circle":
        return {
          type: "circle",
          radius: args[0],
          area: () => Math.PI * args[0] ** 2,
          draw: () => console.log(`Drawing circle with radius ${args[0]}`),
        };
      case "rectangle":
        return {
          type: "rectangle",
          width: args[0],
          height: args[1],
          area: () => args[0] * args[1],
          draw: () => console.log(`Drawing rectangle ${args[0]}x${args[1]}`),
        };
      case "triangle":
        return {
          type: "triangle",
          base: args[0],
          height: args[1],
          area: () => (args[0] * args[1]) / 2,
          draw: () => console.log(`Drawing triangle base=${args[0]} height=${args[1]}`),
        };
      default:
        throw new Error(`Unknown shape type: ${type}`);
    }
  }
}

const circle = ShapeFactory.create("circle", 5);
const rect = ShapeFactory.create("rectangle", 4, 6);

// Example 2: Singleton Pattern
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private connected = false;

  private constructor() {
    console.log("Database connection created");
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  connect(): void {
    if (!this.connected) {
      this.connected = true;
      console.log("Connected to database");
    }
  }

  query<T>(sql: string): T[] {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    return [] as T[];
  }
}

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true

// Example 3: Adapter Pattern
interface ModernPaymentGateway {
  processPayment(amount: number, currency: string): Promise<{ success: boolean; transactionId: string }>;
}

interface LegacyPaymentAPI {
  make_payment(amt: number, curr: string): { status: string; id: string };
}

class PaymentAdapter implements ModernPaymentGateway {
  constructor(private legacy: LegacyPaymentAPI) {}

  async processPayment(amount: number, currency: string): Promise<{ success: boolean; transactionId: string }> {
    const result = this.legacy.make_payment(amount, currency);
    return {
      success: result.status === "ok",
      transactionId: result.id,
    };
  }
}

// Example 4: Decorator Pattern (Composition-based)
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number {
    return 2;
  }

  description(): string {
    return "Simple coffee";
  }
}

class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return `${this.coffee.description()}, milk`;
  }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 0.2;
  }

  description(): string {
    return `${this.coffee.description()}, sugar`;
  }
}

let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()} costs $${coffee.cost()}`);

// Example 5: Strategy Pattern
interface CompressionStrategy {
  compress(data: string): string;
}

class ZipCompression implements CompressionStrategy {
  compress(data: string): string {
    return `ZIP[${data}]`;
  }
}

class GzipCompression implements CompressionStrategy {
  compress(data: string): string {
    return `GZIP[${data}]`;
  }
}

class FileCompressor {
  constructor(private strategy: CompressionStrategy) {}

  setStrategy(strategy: CompressionStrategy): void {
    this.strategy = strategy;
  }

  compress(file: string): string {
    return this.strategy.compress(file);
  }
}

const compressor = new FileCompressor(new ZipCompression());
console.log(compressor.compress("data.txt")); // ZIP[data.txt]

compressor.setStrategy(new GzipCompression());
console.log(compressor.compress("data.txt")); // GZIP[data.txt]

// Example 6: Observer Pattern (Event Bus)
type Listener<T = any> = (event: T) => void;

class TypedEventBus {
  private listeners = new Map<string, Set<Listener>>();

  subscribe<T>(eventName: string, listener: Listener<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(listener);

    return () => this.unsubscribe(eventName, listener);
  }

  unsubscribe<T>(eventName: string, listener: Listener<T>): void {
    this.listeners.get(eventName)?.delete(listener);
  }

  publish<T>(eventName: string, event: T): void {
    this.listeners.get(eventName)?.forEach((listener) => listener(event));
  }
}

const bus = new TypedEventBus();
const unsubscribe = bus.subscribe<{ userId: string }>("userLoggedIn", (event) => {
  console.log(`User ${event.userId} logged in`);
});

bus.publish("userLoggedIn", { userId: "123" });

// Example 7: Command Pattern
interface Command {
  execute(): void;
  undo(): void;
}

class InvoiceState {
  constructor(public total: number) {}
}

class AddLineItemCommand implements Command {
  private previousState: number;

  constructor(
    private invoice: InvoiceState,
    private amount: number
  ) {
    this.previousState = invoice.total;
  }

  execute(): void {
    this.invoice.total += this.amount;
  }

  undo(): void {
    this.invoice.total = this.previousState;
  }
}

class CommandInvoker {
  private history: Command[] = [];
  private currentIndex = -1;

  execute(command: Command): void {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo(): void {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
}

const invoice = new InvoiceState(0);
const invoker = new CommandInvoker();

invoker.execute(new AddLineItemCommand(invoice, 100));
invoker.execute(new AddLineItemCommand(invoice, 50));
console.log(`Total: ${invoice.total}`); // 150

invoker.undo();
console.log(`After undo: ${invoice.total}`); // 100

// Example 8: Maybe Monad
class Maybe<T> {
  private constructor(private value: T | null | undefined) {}

  static of<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe(value);
  }

  static just<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static nothing<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  isNothing(): boolean {
    return this.value === null || this.value === undefined;
  }

  map<U>(fn: (val: T) => U): Maybe<U> {
    return this.isNothing() ? Maybe.nothing<U>() : Maybe.of(fn(this.value!));
  }

  flatMap<U>(fn: (val: T) => Maybe<U>): Maybe<U> {
    return this.isNothing() ? Maybe.nothing<U>() : fn(this.value!);
  }

  getOrElse(defaultValue: T): T {
    return this.isNothing() ? defaultValue : this.value!;
  }

  filter(predicate: (val: T) => boolean): Maybe<T> {
    return this.isNothing() || !predicate(this.value!)
      ? Maybe.nothing<T>()
      : this;
  }
}

const user = Maybe.of({ name: "Ada", email: "ada@example.com" });
const userName = user.map((u) => u.name).getOrElse("Anonymous");
console.log(userName); // Ada

export {
  ShapeFactory,
  DatabaseConnection,
  PaymentAdapter,
  Coffee,
  SimpleCoffee,
  MilkDecorator,
  FileCompressor,
  TypedEventBus,
  CommandInvoker,
  Maybe,
};
