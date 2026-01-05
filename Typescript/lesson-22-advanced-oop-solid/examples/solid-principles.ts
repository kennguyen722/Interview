// Example 1: Single Responsibility Principle
// Each class has one reason to change

// ❌ Violates SRP
class BadUser {
  constructor(public name: string, public email: string) {}

  save() {
    // Database logic
    console.log("Saving to database...");
  }

  sendWelcomeEmail() {
    // Email logic
    console.log("Sending email...");
  }

  generateReport() {
    // Reporting logic
    console.log("Generating report...");
  }
}

// ✅ Follows SRP
class User {
  constructor(public readonly id: string, public name: string, public email: string) {}

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this.name = newName;
  }

  updateEmail(newEmail: string): void {
    if (!newEmail.includes("@")) {
      throw new Error("Invalid email format");
    }
    this.email = newEmail;
  }
}

class UserRepository {
  private users = new Map<string, User>();

  save(user: User): void {
    this.users.set(user.id, user);
    console.log(`User ${user.id} saved to database`);
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}

class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Sending welcome email to ${user.email}`);
  }

  sendPasswordResetEmail(user: User): void {
    console.log(`Sending password reset email to ${user.email}`);
  }
}

class UserReportGenerator {
  generate(user: User): string {
    return `Report for ${user.name} (${user.email})`;
  }

  generateBatch(users: User[]): string {
    return users.map((u) => this.generate(u)).join("\n");
  }
}

// Example 2: Open/Closed Principle
// Open for extension, closed for modification

abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number, private side1: number, private side2: number) {
    super();
  }

  area(): number {
    return (this.base * this.height) / 2;
  }

  perimeter(): number {
    return this.base + this.side1 + this.side2;
  }
}

// Calculator doesn't need modification when adding new shapes
class AreaCalculator {
  calculateTotal(shapes: Shape[]): number {
    return shapes.reduce((sum, shape) => sum + shape.area(), 0);
  }

  calculateAverage(shapes: Shape[]): number {
    if (shapes.length === 0) return 0;
    return this.calculateTotal(shapes) / shapes.length;
  }
}

// Example 3: Liskov Substitution Principle
// Subtypes must be substitutable for their base types

abstract class Bird {
  constructor(protected name: string) {}

  abstract move(): string;
}

class Sparrow extends Bird {
  move(): string {
    return `${this.name} is flying`;
  }
}

class Penguin extends Bird {
  move(): string {
    return `${this.name} is swimming`; // Doesn't fly, but still moves
  }
}

class Ostrich extends Bird {
  move(): string {
    return `${this.name} is running`; // Doesn't fly, but still moves
  }
}

// Works with any Bird subtype
function makeBirdMove(bird: Bird): void {
  console.log(bird.move());
}

// Example 4: Interface Segregation Principle
// Don't force clients to depend on interfaces they don't use

// ❌ Fat interface
interface BadWorker {
  work(): void;
  eat(): void;
  sleep(): void;
  code(): void;
  managePeople(): void;
}

// ✅ Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Codeable {
  code(): void;
}

interface Manageable {
  managePeople(): void;
}

class Developer implements Workable, Eatable, Sleepable, Codeable {
  work(): void {
    console.log("Working on features");
  }

  eat(): void {
    console.log("Eating lunch");
  }

  sleep(): void {
    console.log("Sleeping");
  }

  code(): void {
    console.log("Writing TypeScript code");
  }
}

class Manager implements Workable, Eatable, Sleepable, Manageable {
  work(): void {
    console.log("Working on strategy");
  }

  eat(): void {
    console.log("Eating lunch");
  }

  sleep(): void {
    console.log("Sleeping");
  }

  managePeople(): void {
    console.log("Managing team");
  }
}

class Robot implements Workable {
  work(): void {
    console.log("Executing tasks 24/7");
  }
}

// Example 5: Dependency Inversion Principle
// Depend on abstractions, not concretions

// Abstraction
interface ILogger {
  log(message: string): void;
  error(message: string): void;
}

interface IDatabase {
  save<T>(collection: string, data: T): Promise<void>;
  find<T>(collection: string, id: string): Promise<T | null>;
}

// Low-level modules (implementations)
class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class FileLogger implements ILogger {
  log(message: string): void {
    // Write to file
    console.log(`Writing to file: ${message}`);
  }

  error(message: string): void {
    console.error(`Writing error to file: ${message}`);
  }
}

class MongoDatabase implements IDatabase {
  async save<T>(collection: string, data: T): Promise<void> {
    console.log(`Saving to MongoDB collection ${collection}`);
  }

  async find<T>(collection: string, id: string): Promise<T | null> {
    console.log(`Finding in MongoDB collection ${collection} with id ${id}`);
    return null;
  }
}

class PostgresDatabase implements IDatabase {
  async save<T>(collection: string, data: T): Promise<void> {
    console.log(`Saving to Postgres table ${collection}`);
  }

  async find<T>(collection: string, id: string): Promise<T | null> {
    console.log(`Finding in Postgres table ${collection} with id ${id}`);
    return null;
  }
}

// High-level module depends on abstractions
class OrderService {
  constructor(private logger: ILogger, private database: IDatabase) {}

  async createOrder(order: any): Promise<void> {
    this.logger.log("Creating new order");
    try {
      await this.database.save("orders", order);
      this.logger.log("Order created successfully");
    } catch (error) {
      this.logger.error(`Failed to create order: ${error}`);
      throw error;
    }
  }

  async getOrder(id: string): Promise<any> {
    this.logger.log(`Fetching order ${id}`);
    return await this.database.find("orders", id);
  }
}

// Example 6: Composition over Inheritance

// Components (behaviors)
interface Engine {
  start(): void;
  stop(): void;
  status(): string;
}

interface GPS {
  getLocation(): { lat: number; lon: number };
  navigate(destination: string): void;
}

interface Radio {
  playMusic(): void;
  changeStation(): void;
}

// Implementations
class GasEngine implements Engine {
  private running = false;

  start(): void {
    this.running = true;
    console.log("Gas engine started: Vroom!");
  }

  stop(): void {
    this.running = false;
    console.log("Gas engine stopped");
  }

  status(): string {
    return this.running ? "Running" : "Stopped";
  }
}

class ElectricEngine implements Engine {
  private running = false;

  start(): void {
    this.running = true;
    console.log("Electric engine started: *silent*");
  }

  stop(): void {
    this.running = false;
    console.log("Electric engine stopped");
  }

  status(): string {
    return this.running ? "Running" : "Stopped";
  }
}

class BasicGPS implements GPS {
  getLocation(): { lat: number; lon: number } {
    return { lat: 40.7128, lon: -74.006 };
  }

  navigate(destination: string): void {
    console.log(`Navigating to ${destination}`);
  }
}

class FMRadio implements Radio {
  playMusic(): void {
    console.log("Playing FM radio");
  }

  changeStation(): void {
    console.log("Changing station");
  }
}

// Vehicle uses composition
class Vehicle {
  constructor(
    private engine: Engine,
    private gps?: GPS,
    private radio?: Radio
  ) {}

  start(): void {
    this.engine.start();
  }

  stop(): void {
    this.engine.stop();
  }

  navigate(destination: string): void {
    if (this.gps) {
      this.gps.navigate(destination);
    } else {
      console.log("GPS not available");
    }
  }

  playMusic(): void {
    if (this.radio) {
      this.radio.playMusic();
    } else {
      console.log("Radio not available");
    }
  }
}

// Easy to create different configurations
const basicCar = new Vehicle(new GasEngine());
const luxuryCar = new Vehicle(new GasEngine(), new BasicGPS(), new FMRadio());
const electricCar = new Vehicle(new ElectricEngine(), new BasicGPS());

// Example 7: Abstract Class Template Method Pattern

abstract class DataProcessor {
  // Template method
  public process(): void {
    this.loadData();
    this.validateData();
    this.transformData();
    this.saveData();
    this.cleanup();
  }

  protected abstract loadData(): void;
  protected abstract validateData(): void;
  protected abstract transformData(): void;
  protected abstract saveData(): void;

  // Hook method with default implementation
  protected cleanup(): void {
    console.log("Default cleanup");
  }
}

class CSVProcessor extends DataProcessor {
  protected loadData(): void {
    console.log("Loading CSV data");
  }

  protected validateData(): void {
    console.log("Validating CSV format");
  }

  protected transformData(): void {
    console.log("Transforming CSV to objects");
  }

  protected saveData(): void {
    console.log("Saving processed CSV data");
  }
}

class JSONProcessor extends DataProcessor {
  protected loadData(): void {
    console.log("Loading JSON data");
  }

  protected validateData(): void {
    console.log("Validating JSON schema");
  }

  protected transformData(): void {
    console.log("Transforming JSON structure");
  }

  protected saveData(): void {
    console.log("Saving processed JSON data");
  }

  protected cleanup(): void {
    console.log("Custom JSON cleanup");
  }
}

// Demo usage
console.log("=== SRP Demo ===");
const user = new User("1", "Alice", "alice@example.com");
const userRepo = new UserRepository();
const emailService = new EmailService();
const reportGen = new UserReportGenerator();

userRepo.save(user);
emailService.sendWelcomeEmail(user);
console.log(reportGen.generate(user));

console.log("\n=== OCP Demo ===");
const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4, 5, 5)];
const calculator = new AreaCalculator();
console.log("Total area:", calculator.calculateTotal(shapes));

console.log("\n=== LSP Demo ===");
const birds: Bird[] = [new Sparrow("Tweety"), new Penguin("Pingu"), new Ostrich("Big Bird")];
birds.forEach(makeBirdMove);

console.log("\n=== DIP Demo ===");
const orderService = new OrderService(new ConsoleLogger(), new MongoDatabase());
orderService.createOrder({ id: "1", total: 100 });

console.log("\n=== Composition Demo ===");
basicCar.start();
luxuryCar.navigate("New York");
luxuryCar.playMusic();

console.log("\n=== Template Method Demo ===");
const csvProcessor = new CSVProcessor();
csvProcessor.process();

export {
  User,
  UserRepository,
  EmailService,
  Shape,
  Circle,
  Rectangle,
  OrderService,
  Vehicle,
  DataProcessor,
};
