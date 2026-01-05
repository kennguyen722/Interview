// ============================================================================
// CREATIONAL DESIGN PATTERNS - Working Examples
// ============================================================================

// ============================================================================
// 1. FACTORY METHOD PATTERN
// ============================================================================

// Product interface
interface Document {
  open(): void;
  save(): void;
  close(): void;
}

// Concrete products
class PDFDocument implements Document {
  open(): void {
    console.log("Opening PDF document...");
  }
  save(): void {
    console.log("Saving PDF with compression...");
  }
  close(): void {
    console.log("Closing PDF document");
  }
}

class WordDocument implements Document {
  open(): void {
    console.log("Opening Word document...");
  }
  save(): void {
    console.log("Saving Word document with formatting...");
  }
  close(): void {
    console.log("Closing Word document");
  }
}

class TextDocument implements Document {
  open(): void {
    console.log("Opening plain text document...");
  }
  save(): void {
    console.log("Saving text file...");
  }
  close(): void {
    console.log("Closing text document");
  }
}

// Creator (Factory Method)
abstract class DocumentCreator {
  // Factory method
  abstract createDocument(): Document;

  // Template method using factory method
  openDocument(): void {
    const doc = this.createDocument();
    doc.open();
  }
}

// Concrete creators
class PDFCreator extends DocumentCreator {
  createDocument(): Document {
    return new PDFDocument();
  }
}

class WordCreator extends DocumentCreator {
  createDocument(): Document {
    return new WordDocument();
  }
}

class TextCreator extends DocumentCreator {
  createDocument(): Document {
    return new TextDocument();
  }
}

// ============================================================================
// 2. ABSTRACT FACTORY PATTERN
// ============================================================================

// Abstract products
interface Button {
  render(): void;
  onClick(callback: () => void): void;
}

interface TextField {
  render(): void;
  onInput(callback: (value: string) => void): void;
}

interface Checkbox {
  render(): void;
  onChange(callback: (checked: boolean) => void): void;
}

// Concrete products - Windows
class WindowsButton implements Button {
  render(): void {
    console.log("Rendering Windows button");
  }
  onClick(callback: () => void): void {
    console.log("Windows button clicked");
    callback();
  }
}

class WindowsTextField implements TextField {
  render(): void {
    console.log("Rendering Windows text field");
  }
  onInput(callback: (value: string) => void): void {
    console.log("Windows text field input");
    callback("Windows input");
  }
}

class WindowsCheckbox implements Checkbox {
  render(): void {
    console.log("Rendering Windows checkbox");
  }
  onChange(callback: (checked: boolean) => void): void {
    console.log("Windows checkbox changed");
    callback(true);
  }
}

// Concrete products - macOS
class MacButton implements Button {
  render(): void {
    console.log("Rendering macOS button");
  }
  onClick(callback: () => void): void {
    console.log("macOS button clicked");
    callback();
  }
}

class MacTextField implements TextField {
  render(): void {
    console.log("Rendering macOS text field");
  }
  onInput(callback: (value: string) => void): void {
    console.log("macOS text field input");
    callback("macOS input");
  }
}

class MacCheckbox implements Checkbox {
  render(): void {
    console.log("Rendering macOS checkbox");
  }
  onChange(callback: (checked: boolean) => void): void {
    console.log("macOS checkbox changed");
    callback(true);
  }
}

// Abstract factory
interface UIFactory {
  createButton(): Button;
  createTextField(): TextField;
  createCheckbox(): Checkbox;
}

// Concrete factories
class WindowsUIFactory implements UIFactory {
  createButton(): Button {
    return new WindowsButton();
  }
  createTextField(): TextField {
    return new WindowsTextField();
  }
  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacUIFactory implements UIFactory {
  createButton(): Button {
    return new MacButton();
  }
  createTextField(): TextField {
    return new MacTextField();
  }
  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

// Client code
class Application {
  private button: Button;
  private textField: TextField;
  private checkbox: Checkbox;

  constructor(factory: UIFactory) {
    this.button = factory.createButton();
    this.textField = factory.createTextField();
    this.checkbox = factory.createCheckbox();
  }

  render(): void {
    this.button.render();
    this.textField.render();
    this.checkbox.render();
  }
}

// ============================================================================
// 3. BUILDER PATTERN
// ============================================================================

// Product
class HttpRequest {
  method: string = "GET";
  url: string = "";
  headers: Map<string, string> = new Map();
  queryParams: Map<string, string> = new Map();
  body?: any;
  timeout: number = 30000;
  retries: number = 0;

  toString(): string {
    return `${this.method} ${this.url}
Headers: ${JSON.stringify(Array.from(this.headers.entries()))}
Params: ${JSON.stringify(Array.from(this.queryParams.entries()))}
Body: ${JSON.stringify(this.body)}
Timeout: ${this.timeout}ms, Retries: ${this.retries}`;
  }
}

// Builder with fluent interface
class HttpRequestBuilder {
  private request: HttpRequest;

  constructor() {
    this.request = new HttpRequest();
  }

  setMethod(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"): this {
    this.request.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.request.url = url;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.request.headers.set(key, value);
    return this;
  }

  addQueryParam(key: string, value: string): this {
    this.request.queryParams.set(key, value);
    return this;
  }

  setBody(body: any): this {
    this.request.body = body;
    return this;
  }

  setTimeout(ms: number): this {
    this.request.timeout = ms;
    return this;
  }

  setRetries(count: number): this {
    this.request.retries = count;
    return this;
  }

  build(): HttpRequest {
    if (!this.request.url) {
      throw new Error("URL is required");
    }
    return this.request;
  }

  // Named constructors (alternative builder pattern)
  static get(): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod("GET");
  }

  static post(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod("POST").setUrl(url);
  }

  static put(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod("PUT").setUrl(url);
  }

  static delete(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod("DELETE").setUrl(url);
  }
}

// ============================================================================
// 4. PROTOTYPE PATTERN
// ============================================================================

// Prototype interface
interface Cloneable<T> {
  clone(): T;
}

// Complex object with nested structures
class Address {
  constructor(
    public street: string,
    public city: string,
    public country: string,
    public zipCode: string
  ) {}

  clone(): Address {
    return new Address(this.street, this.city, this.country, this.zipCode);
  }
}

class User implements Cloneable<User> {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public address: Address,
    public preferences: Map<string, any> = new Map()
  ) {}

  clone(): User {
    // Deep clone
    const clonedPreferences = new Map(this.preferences);
    const clonedAddress = this.address.clone();

    return new User(
      this.id,
      this.name,
      this.email,
      clonedAddress,
      clonedPreferences
    );
  }
}

// Prototype registry (manages common prototypes)
class UserPrototypeRegistry {
  private prototypes: Map<string, User> = new Map();

  register(key: string, prototype: User): void {
    this.prototypes.set(key, prototype);
  }

  get(key: string): User | undefined {
    const prototype = this.prototypes.get(key);
    return prototype?.clone();
  }

  unregister(key: string): void {
    this.prototypes.delete(key);
  }
}

// ============================================================================
// 5. SINGLETON PATTERN
// ============================================================================

// Classic Singleton
class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: Map<string, any>;

  private constructor() {
    this.config = new Map();
    console.log("ConfigurationManager initialized");
  }

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  get(key: string): any {
    return this.config.get(key);
  }

  getAll(): Map<string, any> {
    return new Map(this.config);
  }
}

// Thread-safe Singleton (simulated with async)
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private static creating: Promise<DatabaseConnection> | null = null;
  private connected: boolean = false;

  private constructor() {}

  static async getInstance(): Promise<DatabaseConnection> {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    if (DatabaseConnection.creating) {
      return DatabaseConnection.creating;
    }

    DatabaseConnection.creating = (async () => {
      const instance = new DatabaseConnection();
      await instance.connect();
      DatabaseConnection.instance = instance;
      DatabaseConnection.creating = null;
      return instance;
    })();

    return DatabaseConnection.creating;
  }

  private async connect(): Promise<void> {
    console.log("Connecting to database...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.connected = true;
    console.log("Database connected");
  }

  query(sql: string): void {
    if (!this.connected) {
      throw new Error("Database not connected");
    }
    console.log(`Executing query: ${sql}`);
  }
}

// Modern Singleton using module pattern
export const logger = (() => {
  const logs: string[] = [];

  return {
    log(message: string): void {
      const timestamp = new Date().toISOString();
      logs.push(`[${timestamp}] ${message}`);
      console.log(`[${timestamp}] ${message}`);
    },
    getLogs(): string[] {
      return [...logs];
    },
    clear(): void {
      logs.length = 0;
    },
  };
})();

// ============================================================================
// DEMONSTRATION
// ============================================================================

console.log("\n=== FACTORY METHOD PATTERN ===");
const pdfCreator = new PDFCreator();
pdfCreator.openDocument();

const wordCreator = new WordCreator();
wordCreator.openDocument();

console.log("\n=== ABSTRACT FACTORY PATTERN ===");
const windowsApp = new Application(new WindowsUIFactory());
windowsApp.render();

const macApp = new Application(new MacUIFactory());
macApp.render();

console.log("\n=== BUILDER PATTERN ===");
const getRequest = HttpRequestBuilder.get()
  .setUrl("https://api.example.com/users")
  .addHeader("Authorization", "Bearer token123")
  .addQueryParam("page", "1")
  .addQueryParam("limit", "10")
  .setTimeout(5000)
  .build();

console.log(getRequest.toString());

const postRequest = HttpRequestBuilder.post("https://api.example.com/users")
  .addHeader("Content-Type", "application/json")
  .setBody({ name: "John Doe", email: "john@example.com" })
  .setRetries(3)
  .build();

console.log(postRequest.toString());

console.log("\n=== PROTOTYPE PATTERN ===");
const prototypeRegistry = new UserPrototypeRegistry();

const defaultUser = new User(
  "default",
  "Default User",
  "default@example.com",
  new Address("", "", "USA", "")
);
defaultUser.preferences.set("theme", "light");
defaultUser.preferences.set("language", "en");

prototypeRegistry.register("default", defaultUser);

const user1 = prototypeRegistry.get("default")!;
user1.id = "user1";
user1.name = "Alice";
user1.address.city = "New York";

const user2 = prototypeRegistry.get("default")!;
user2.id = "user2";
user2.name = "Bob";
user2.address.city = "Los Angeles";

console.log("User 1:", user1);
console.log("User 2:", user2);
console.log("Changes don't affect prototype:", defaultUser);

console.log("\n=== SINGLETON PATTERN ===");
const config1 = ConfigurationManager.getInstance();
config1.set("apiUrl", "https://api.example.com");
config1.set("timeout", 5000);

const config2 = ConfigurationManager.getInstance();
console.log("Same instance?", config1 === config2);
console.log("Config from instance 2:", config2.getAll());

// Async singleton
(async () => {
  console.log("\n=== ASYNC SINGLETON ===");
  const db1Promise = DatabaseConnection.getInstance();
  const db2Promise = DatabaseConnection.getInstance(); // Called before first completes

  const [db1, db2] = await Promise.all([db1Promise, db2Promise]);
  console.log("Same database instance?", db1 === db2);

  db1.query("SELECT * FROM users");
})();

console.log("\n=== MODULE SINGLETON ===");
logger.log("Application started");
logger.log("User logged in");
console.log("All logs:", logger.getLogs());
