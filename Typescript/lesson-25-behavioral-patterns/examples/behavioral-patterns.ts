// ============================================================================
// BEHAVIORAL DESIGN PATTERNS - Working Examples
// ============================================================================

// ============================================================================
// 1. STRATEGY PATTERN
// ============================================================================

interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string, private cvv: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using PayPal account ${this.email}`);
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Crypto wallet ${this.walletAddress}`);
  }
}

class ShoppingCart {
  private items: Array<{ name: string; price: number }> = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`\nCheckout: ${this.items.length} items, Total: $${total}`);

    if (!this.paymentStrategy) {
      console.log("Please select a payment method");
      return;
    }

    this.paymentStrategy.pay(total);
  }
}

// ============================================================================
// 2. OBSERVER PATTERN
// ============================================================================

interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;
  private humidity: number = 0;

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    this.observers.forEach((observer) => {
      observer.update({ temperature: this.temperature, humidity: this.humidity });
    });
  }

  setMeasurements(temperature: number, humidity: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.notify();
  }
}

class PhoneDisplay implements Observer {
  update(data: { temperature: number; humidity: number }): void {
    console.log(`📱 Phone: ${data.temperature}°C, ${data.humidity}% humidity`);
  }
}

class WindowDisplay implements Observer {
  update(data: { temperature: number; humidity: number }): void {
    console.log(`🪟 Window: Temperature is ${data.temperature}°C`);
  }
}

class StatisticsDisplay implements Observer {
  private temperatures: number[] = [];

  update(data: { temperature: number; humidity: number }): void {
    this.temperatures.push(data.temperature);
    const avg =
      this.temperatures.reduce((a, b) => a + b, 0) / this.temperatures.length;
    console.log(`📊 Stats: Avg temperature: ${avg.toFixed(1)}°C`);
  }
}

// ============================================================================
// 3. COMMAND PATTERN
// ============================================================================

interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  private isOn: boolean = false;

  turnOn(): void {
    this.isOn = true;
    console.log("Light is ON");
  }

  turnOff(): void {
    this.isOn = false;
    console.log("Light is OFF");
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
  }
}

class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

// ============================================================================
// 4. CHAIN OF RESPONSIBILITY PATTERN
// ============================================================================

interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

abstract class AbstractHandler implements Handler {
  private nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: string): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

class AuthenticationHandler extends AbstractHandler {
  handle(request: string): string | null {
    if (request.includes("auth_token")) {
      console.log("✓ Authentication successful");
      return super.handle(request);
    }
    console.log("✗ Authentication failed");
    return null;
  }
}

class AuthorizationHandler extends AbstractHandler {
  handle(request: string): string | null {
    if (request.includes("admin")) {
      console.log("✓ Authorization successful");
      return super.handle(request);
    }
    console.log("✗ Authorization failed");
    return null;
  }
}

class ValidationHandler extends AbstractHandler {
  handle(request: string): string | null {
    if (request.length > 10) {
      console.log("✓ Validation successful");
      return super.handle(request);
    }
    console.log("✗ Validation failed");
    return null;
  }
}

class ProcessingHandler extends AbstractHandler {
  handle(request: string): string | null {
    console.log("✓ Request processed successfully");
    return "Success";
  }
}

// ============================================================================
// 5. STATE PATTERN
// ============================================================================

interface State {
  insertCoin(): void;
  ejectCoin(): void;
  dispense(): void;
}

class VendingMachine {
  private state: State;

  constructor(
    private noCoinState: State,
    private hasCoinState: State,
    private soldState: State
  ) {
    this.state = noCoinState;
  }

  setState(state: State): void {
    this.state = state;
  }

  insertCoin(): void {
    this.state.insertCoin();
  }

  ejectCoin(): void {
    this.state.ejectCoin();
  }

  dispense(): void {
    this.state.dispense();
  }
}

class NoCoinState implements State {
  constructor(private machine: VendingMachine) {}

  insertCoin(): void {
    console.log("Coin inserted");
    this.machine.setState(
      new HasCoinState(this.machine, this, new SoldState(this.machine, this))
    );
  }

  ejectCoin(): void {
    console.log("No coin to eject");
  }

  dispense(): void {
    console.log("Insert coin first");
  }
}

class HasCoinState implements State {
  constructor(
    private machine: VendingMachine,
    private noCoinState: State,
    private soldState: State
  ) {}

  insertCoin(): void {
    console.log("Coin already inserted");
  }

  ejectCoin(): void {
    console.log("Coin ejected");
    this.machine.setState(this.noCoinState);
  }

  dispense(): void {
    console.log("Dispensing product...");
    this.machine.setState(this.soldState);
  }
}

class SoldState implements State {
  constructor(private machine: VendingMachine, private noCoinState: State) {}

  insertCoin(): void {
    console.log("Please wait, dispensing product");
  }

  ejectCoin(): void {
    console.log("Cannot eject, already dispensing");
  }

  dispense(): void {
    console.log("Product dispensed!");
    this.machine.setState(this.noCoinState);
  }
}

// ============================================================================
// 6. TEMPLATE METHOD PATTERN
// ============================================================================

abstract class DataParser {
  // Template method
  parse(filePath: string): void {
    this.openFile(filePath);
    this.extractData();
    this.parseData();
    this.closeFile();
    this.sendReport();
  }

  private openFile(filePath: string): void {
    console.log(`Opening file: ${filePath}`);
  }

  protected abstract extractData(): void;
  protected abstract parseData(): void;

  private closeFile(): void {
    console.log("Closing file");
  }

  // Hook method (optional override)
  protected sendReport(): void {
    console.log("Report sent");
  }
}

class CSVParser extends DataParser {
  protected extractData(): void {
    console.log("Extracting CSV data...");
  }

  protected parseData(): void {
    console.log("Parsing CSV format");
  }
}

class JSONParser extends DataParser {
  protected extractData(): void {
    console.log("Extracting JSON data...");
  }

  protected parseData(): void {
    console.log("Parsing JSON format");
  }

  protected sendReport(): void {
    console.log("Sending detailed JSON report");
  }
}

// ============================================================================
// 7. ITERATOR PATTERN
// ============================================================================

interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  reset(): void;
}

interface Aggregator<T> {
  createIterator(): Iterator<T>;
}

class BookCollection implements Aggregator<string> {
  private books: string[] = [];

  addBook(book: string): void {
    this.books.push(book);
  }

  createIterator(): Iterator<string> {
    return new BookIterator(this.books);
  }
}

class BookIterator implements Iterator<string> {
  private position: number = 0;

  constructor(private books: string[]) {}

  hasNext(): boolean {
    return this.position < this.books.length;
  }

  next(): string {
    return this.books[this.position++];
  }

  reset(): void {
    this.position = 0;
  }
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

console.log("\n=== STRATEGY PATTERN ===");
const cart = new ShoppingCart();
cart.addItem("Laptop", 999);
cart.addItem("Mouse", 25);

cart.setPaymentStrategy(new CreditCardPayment("1234-5678-9012-3456", "123"));
cart.checkout();

cart.setPaymentStrategy(new PayPalPayment("user@example.com"));
cart.checkout();

console.log("\n=== OBSERVER PATTERN ===");
const weatherStation = new WeatherStation();
const phoneDisplay = new PhoneDisplay();
const windowDisplay = new WindowDisplay();
const statsDisplay = new StatisticsDisplay();

weatherStation.attach(phoneDisplay);
weatherStation.attach(windowDisplay);
weatherStation.attach(statsDisplay);

weatherStation.setMeasurements(25, 60);
weatherStation.setMeasurements(27, 55);

console.log("\n=== COMMAND PATTERN ===");
const light = new Light();
const remote = new RemoteControl();

remote.executeCommand(new LightOnCommand(light));
remote.executeCommand(new LightOffCommand(light));
remote.undo(); // Turn light back on

console.log("\n=== CHAIN OF RESPONSIBILITY ===");
const auth = new AuthenticationHandler();
const authz = new AuthorizationHandler();
const validation = new ValidationHandler();
const processing = new ProcessingHandler();

auth.setNext(authz).setNext(validation).setNext(processing);

console.log("Request 1:");
auth.handle("auth_token=xyz123&role=admin&data=abcdefghijk");

console.log("\nRequest 2:");
auth.handle("no_token");

console.log("\n=== STATE PATTERN ===");
const noCoin = new NoCoinState(null as any);
const hasCoin = new HasCoinState(null as any, noCoin, null as any);
const sold = new SoldState(null as any, noCoin);

const vendingMachine = new VendingMachine(noCoin, hasCoin, sold);
(noCoin as any).machine = vendingMachine;

vendingMachine.insertCoin();
vendingMachine.dispense();
vendingMachine.dispense(); // Product dispensed, back to no coin state
vendingMachine.dispense(); // Insert coin first

console.log("\n=== TEMPLATE METHOD ===");
const csvParser = new CSVParser();
csvParser.parse("data.csv");

console.log();
const jsonParser = new JSONParser();
jsonParser.parse("data.json");

console.log("\n=== ITERATOR PATTERN ===");
const collection = new BookCollection();
collection.addBook("Design Patterns");
collection.addBook("Clean Code");
collection.addBook("Refactoring");

const iterator = collection.createIterator();
console.log("Books in collection:");
while (iterator.hasNext()) {
  console.log(`- ${iterator.next()}`);
}
