// ============================================================================
// STRUCTURAL DESIGN PATTERNS - Working Examples
// ============================================================================

// ============================================================================
// 1. ADAPTER PATTERN
// ============================================================================

// Legacy payment system
class LegacyPaymentGateway {
  processPayment(amount: number, cardNumber: string): boolean {
    console.log(`Legacy: Processing $${amount} with card ${cardNumber}`);
    return true;
  }
}

// New payment interface
interface IPaymentProcessor {
  pay(amount: number, paymentDetails: PaymentDetails): Promise<PaymentResult>;
}

interface PaymentDetails {
  method: "card" | "paypal" | "crypto";
  accountId: string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
}

// Adapter
class LegacyPaymentAdapter implements IPaymentProcessor {
  constructor(private legacyGateway: LegacyPaymentGateway) {}

  async pay(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    // Adapt new interface to legacy system
    const success = this.legacyGateway.processPayment(
      amount,
      details.accountId
    );

    return {
      success,
      transactionId: `TXN-${Date.now()}`,
    };
  }
}

// ============================================================================
// 2. BRIDGE PATTERN
// ============================================================================

// Implementation interface
interface MessageSender {
  sendMessage(recipient: string, message: string): void;
}

// Concrete implementations
class EmailSender implements MessageSender {
  sendMessage(recipient: string, message: string): void {
    console.log(`Email to ${recipient}: ${message}`);
  }
}

class SMSSender implements MessageSender {
  sendMessage(recipient: string, message: string): void {
    console.log(`SMS to ${recipient}: ${message}`);
  }
}

class PushNotificationSender implements MessageSender {
  sendMessage(recipient: string, message: string): void {
    console.log(`Push notification to ${recipient}: ${message}`);
  }
}

// Abstraction
abstract class Notification {
  constructor(protected sender: MessageSender) {}

  abstract send(recipient: string): void;
}

// Refined abstractions
class UrgentNotification extends Notification {
  send(recipient: string): void {
    this.sender.sendMessage(recipient, "[URGENT] Critical system alert!");
  }
}

class ReminderNotification extends Notification {
  send(recipient: string): void {
    this.sender.sendMessage(recipient, "Reminder: Task due today");
  }
}

class WelcomeNotification extends Notification {
  send(recipient: string): void {
    this.sender.sendMessage(recipient, "Welcome to our service!");
  }
}

// ============================================================================
// 3. COMPOSITE PATTERN
// ============================================================================

// Component
interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  print(indent: string): void;
}

// Leaf
class File implements FileSystemComponent {
  constructor(private name: string, private size: number) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  print(indent: string = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.size} bytes)`);
  }
}

// Composite
class Directory implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  constructor(private name: string) {}

  add(component: FileSystemComponent): void {
    this.children.push(component);
  }

  remove(component: FileSystemComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  print(indent: string = ""): void {
    console.log(`${indent}📁 ${this.name}/`);
    this.children.forEach((child) => child.print(indent + "  "));
  }
}

// ============================================================================
// 4. DECORATOR PATTERN
// ============================================================================

// Component interface
interface Coffee {
  getCost(): number;
  getDescription(): string;
}

// Concrete component
class SimpleCoffee implements Coffee {
  getCost(): number {
    return 2.0;
  }

  getDescription(): string {
    return "Simple coffee";
  }
}

// Decorator base class
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract getCost(): number;
  abstract getDescription(): string;
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.5;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.2;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", sugar";
  }
}

class WhipDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.7;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", whip";
  }
}

// ============================================================================
// 5. FACADE PATTERN
// ============================================================================

// Complex subsystem
class VideoFile {
  constructor(public filename: string) {}
}

class AudioMixer {
  fix(video: VideoFile): void {
    console.log("AudioMixer: fixing audio...");
  }
}

class VideoCodec {
  encode(video: VideoFile, format: string): void {
    console.log(`VideoCodec: encoding to ${format}...`);
  }
}

class BitrateReader {
  read(video: VideoFile): string {
    console.log("BitrateReader: reading bitrate...");
    return "1080p";
  }

  convert(video: VideoFile, bitrate: string): void {
    console.log(`BitrateReader: converting to ${bitrate}...`);
  }
}

// Facade
class VideoConverter {
  convert(filename: string, format: string): void {
    console.log(`\nConverting ${filename} to ${format}...`);

    const video = new VideoFile(filename);
    const audio = new AudioMixer();
    const codec = new VideoCodec();
    const bitrate = new BitrateReader();

    audio.fix(video);
    const quality = bitrate.read(video);
    bitrate.convert(video, quality);
    codec.encode(video, format);

    console.log("Conversion complete!\n");
  }
}

// ============================================================================
// 6. FLYWEIGHT PATTERN
// ============================================================================

// Flyweight (intrinsic state - shared)
class TreeType {
  constructor(
    public name: string,
    public color: string,
    public texture: string
  ) {}

  draw(x: number, y: number): void {
    console.log(
      `Drawing ${this.name} tree at (${x}, ${y}) with ${this.color} color`
    );
  }
}

// Flyweight Factory
class TreeFactory {
  private static treeTypes: Map<string, TreeType> = new Map();

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;
    let type = this.treeTypes.get(key);

    if (!type) {
      type = new TreeType(name, color, texture);
      this.treeTypes.set(key, type);
      console.log(`Creating new TreeType: ${key}`);
    }

    return type;
  }

  static getTreeTypeCount(): number {
    return this.treeTypes.size;
  }
}

// Context (extrinsic state - unique)
class Tree {
  constructor(
    private x: number,
    private y: number,
    private type: TreeType
  ) {}

  draw(): void {
    this.type.draw(this.x, this.y);
  }
}

// Client
class Forest {
  private trees: Tree[] = [];

  plantTree(
    x: number,
    y: number,
    name: string,
    color: string,
    texture: string
  ): void {
    const type = TreeFactory.getTreeType(name, color, texture);
    const tree = new Tree(x, y, type);
    this.trees.push(tree);
  }

  draw(): void {
    this.trees.forEach((tree) => tree.draw());
  }

  getTreeCount(): number {
    return this.trees.length;
  }
}

// ============================================================================
// 7. PROXY PATTERN
// ============================================================================

// Subject interface
interface IImage {
  display(): void;
  getSize(): number;
}

// Real subject
class RealImage implements IImage {
  private size: number;

  constructor(private filename: string) {
    this.loadFromDisk();
    this.size = Math.random() * 1000000; // Simulate file size
  }

  private loadFromDisk(): void {
    console.log(`Loading image from disk: ${this.filename}`);
  }

  display(): void {
    console.log(`Displaying: ${this.filename}`);
  }

  getSize(): number {
    return this.size;
  }
}

// Virtual Proxy (lazy loading)
class ImageProxy implements IImage {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }

  getSize(): number {
    if (!this.realImage) {
      return 0; // Don't load just to get size
    }
    return this.realImage.getSize();
  }
}

// Protection Proxy (access control)
class ProtectedImage implements IImage {
  private realImage: RealImage;

  constructor(filename: string, private userRole: "admin" | "user") {
    this.realImage = new RealImage(filename);
  }

  display(): void {
    if (this.userRole === "admin") {
      this.realImage.display();
    } else {
      console.log("Access denied: insufficient permissions");
    }
  }

  getSize(): number {
    return this.realImage.getSize();
  }
}

// Caching Proxy
class CachedImageProxy implements IImage {
  private realImage: RealImage | null = null;
  private cache: Map<string, any> = new Map();

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }

  getSize(): number {
    if (this.cache.has("size")) {
      console.log("Returning cached size");
      return this.cache.get("size");
    }

    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }

    const size = this.realImage.getSize();
    this.cache.set("size", size);
    return size;
  }
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

console.log("\n=== ADAPTER PATTERN ===");
const legacyGateway = new LegacyPaymentGateway();
const paymentProcessor: IPaymentProcessor = new LegacyPaymentAdapter(
  legacyGateway
);
paymentProcessor.pay(100, { method: "card", accountId: "4111111111111111" });

console.log("\n=== BRIDGE PATTERN ===");
const urgentEmail = new UrgentNotification(new EmailSender());
urgentEmail.send("admin@example.com");

const reminderSMS = new ReminderNotification(new SMSSender());
reminderSMS.send("+1234567890");

const welcomePush = new WelcomeNotification(new PushNotificationSender());
welcomePush.send("user123");

console.log("\n=== COMPOSITE PATTERN ===");
const root = new Directory("root");
const documents = new Directory("documents");
const pictures = new Directory("pictures");

documents.add(new File("resume.pdf", 1024));
documents.add(new File("cover-letter.docx", 512));

pictures.add(new File("vacation.jpg", 2048));
pictures.add(new File("family.png", 1536));

root.add(documents);
root.add(pictures);
root.add(new File("readme.txt", 256));

root.print();
console.log(`Total size: ${root.getSize()} bytes`);

console.log("\n=== DECORATOR PATTERN ===");
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new WhipDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

console.log("\n=== FACADE PATTERN ===");
const converter = new VideoConverter();
converter.convert("video.mp4", "avi");

console.log("\n=== FLYWEIGHT PATTERN ===");
const forest = new Forest();

// Plant 1000 trees with only 3 types
for (let i = 0; i < 1000; i++) {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);

  if (i % 3 === 0) {
    forest.plantTree(x, y, "Oak", "Green", "Oak texture");
  } else if (i % 3 === 1) {
    forest.plantTree(x, y, "Pine", "Dark Green", "Pine texture");
  } else {
    forest.plantTree(x, y, "Birch", "White", "Birch texture");
  }
}

console.log(`Total trees: ${forest.getTreeCount()}`);
console.log(`Tree types created: ${TreeFactory.getTreeTypeCount()}`);
console.log("Memory saved by sharing tree types!");

console.log("\n=== PROXY PATTERN ===");
console.log("-- Virtual Proxy (Lazy Loading) --");
const image1 = new ImageProxy("photo1.jpg");
console.log("Image proxy created (not loaded yet)");
image1.display(); // Loads now
image1.display(); // Already loaded

console.log("\n-- Protection Proxy --");
const adminImage = new ProtectedImage("secret.jpg", "admin");
adminImage.display(); // Allowed

const userImage = new ProtectedImage("secret.jpg", "user");
userImage.display(); // Denied

console.log("\n-- Caching Proxy --");
const cachedImage = new CachedImageProxy("large.jpg");
console.log(`Size: ${cachedImage.getSize()}`);
console.log(`Size: ${cachedImage.getSize()}`); // From cache
