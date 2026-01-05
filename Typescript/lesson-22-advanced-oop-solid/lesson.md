# Lesson 22: Advanced OOP & SOLID Principles

## Objective
Master advanced Object-Oriented Programming concepts, SOLID principles, and best practices for designing maintainable, extensible TypeScript applications with proper abstraction and encapsulation.

## Topics Covered

### 1. Advanced OOP Concepts
- **Encapsulation**: Private implementation details, public contracts
- **Inheritance**: Base classes, method overriding, `super` keyword
- **Polymorphism**: Interface-based and subtype polymorphism
- **Abstraction**: Abstract classes, interfaces, contracts
- **Composition over Inheritance**: Favor composition for flexibility

### 2. SOLID Principles

#### S - Single Responsibility Principle (SRP)
A class should have only one reason to change. Each class should have a single, well-defined purpose.

```typescript
// ❌ Bad: Multiple responsibilities
class User {
  saveToDatabase() { }
  sendEmail() { }
  generateReport() { }
}

// ✅ Good: Single responsibility
class User { }
class UserRepository { save(user: User) { } }
class EmailService { send(to: string, message: string) { } }
class ReportGenerator { generate(user: User) { } }
```

#### O - Open/Closed Principle (OCP)
Software entities should be open for extension but closed for modification.

```typescript
// ✅ Open for extension via inheritance/composition
abstract class Shape {
  abstract area(): number;
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) { super(); }
  area(): number { return this.width * this.height; }
}
```

#### L - Liskov Substitution Principle (LSP)
Subtypes must be substitutable for their base types without altering program correctness.

```typescript
// ✅ Rectangle can be substituted wherever Shape is expected
function calculateArea(shape: Shape): number {
  return shape.area(); // Works for Circle, Rectangle, Triangle, etc.
}
```

#### I - Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they don't use.

```typescript
// ❌ Bad: Fat interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// ✅ Good: Segregated interfaces
interface Workable { work(): void; }
interface Eatable { eat(): void; }
interface Sleepable { sleep(): void; }

class Human implements Workable, Eatable, Sleepable {
  work() { }
  eat() { }
  sleep() { }
}

class Robot implements Workable {
  work() { } // Robots don't eat or sleep
}
```

#### D - Dependency Inversion Principle (DIP)
High-level modules should not depend on low-level modules. Both should depend on abstractions.

```typescript
// ✅ Depend on abstraction
interface IDatabase {
  save(data: any): Promise<void>;
}

class UserService {
  constructor(private database: IDatabase) { } // Depends on abstraction
  
  async createUser(user: any) {
    await this.database.save(user);
  }
}

class PostgresDatabase implements IDatabase {
  async save(data: any) { /* postgres implementation */ }
}

class MongoDatabase implements IDatabase {
  async save(data: any) { /* mongo implementation */ }
}
```

### 3. Abstract Classes vs Interfaces

**Abstract Classes**:
- Can contain implementation
- Single inheritance only
- Can have constructors
- Can have access modifiers

**Interfaces**:
- Pure contracts (no implementation)
- Multiple inheritance supported
- No constructors
- All members implicitly public

```typescript
// Abstract class with partial implementation
abstract class Animal {
  constructor(protected name: string) { }
  
  abstract makeSound(): string; // Must be implemented
  
  move(): void { // Shared implementation
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  makeSound(): string {
    return "Woof!";
  }
}

// Interface for pure contract
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Swimmable {
  swim(): void;
}

class Duck extends Animal implements Flyable, Swimmable {
  altitude = 0;
  
  makeSound(): string { return "Quack!"; }
  fly(): void { this.altitude += 10; }
  swim(): void { console.log("Swimming"); }
}
```

### 4. Composition over Inheritance

```typescript
// ❌ Inheritance can lead to rigid hierarchies
class Vehicle {
  start() { }
  stop() { }
}

class Car extends Vehicle {
  openTrunk() { }
}

class Boat extends Vehicle {
  sail() { }
}

// ✅ Composition is more flexible
interface Engine {
  start(): void;
  stop(): void;
}

interface Storage {
  open(): void;
  close(): void;
}

class GasEngine implements Engine {
  start() { console.log("Vroom!"); }
  stop() { console.log("Engine off"); }
}

class Car {
  constructor(
    private engine: Engine,
    private trunk: Storage
  ) { }
  
  start() { this.engine.start(); }
  openTrunk() { this.trunk.open(); }
}
```

### 5. Design by Contract

```typescript
class BankAccount {
  private balance: number = 0;
  
  // Preconditions: amount must be positive
  // Postconditions: balance increases
  // Invariants: balance >= 0
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Precondition: amount must be positive");
    
    this.balance += amount;
    
    if (this.balance < 0) throw new Error("Invariant violated: balance must be non-negative");
  }
  
  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Precondition: amount must be positive");
    if (amount > this.balance) throw new Error("Precondition: insufficient funds");
    
    this.balance -= amount;
    
    if (this.balance < 0) throw new Error("Invariant violated");
  }
  
  getBalance(): number {
    return this.balance;
  }
}
```

## Learning Outcomes
- Apply SOLID principles to real-world designs
- Choose between abstract classes and interfaces appropriately
- Use composition to create flexible architectures
- Design type-safe OOP hierarchies
- Implement proper encapsulation and abstraction
- Write maintainable, extensible object-oriented code

## Practice Challenges

1. **Refactor to SRP**: Take a "God class" and split it into focused classes
2. **OCP Implementation**: Design a plugin system open for extension
3. **LSP Validation**: Ensure subtypes don't violate base class contracts
4. **ISP Refactoring**: Break apart fat interfaces into role-based ones
5. **DIP Architecture**: Convert concrete dependencies to abstractions
6. **Composition Example**: Refactor inheritance hierarchy to use composition
7. **Abstract Class Design**: Create a template method pattern
8. **Contract Design**: Implement preconditions, postconditions, and invariants

## Anti-Patterns to Avoid

### 1. God Object
```typescript
// ❌ Doing too much
class Application {
  connectToDatabase() { }
  handleHTTPRequest() { }
  renderUI() { }
  sendEmail() { }
  processPayment() { }
  generateReport() { }
}
```

### 2. Anemic Domain Model
```typescript
// ❌ Data without behavior
class User {
  name: string;
  email: string;
}

class UserService {
  validateUser(user: User) { }
  saveUser(user: User) { }
}

// ✅ Rich domain model
class User {
  constructor(private name: string, private email: string) {
    this.validate();
  }
  
  private validate() {
    if (!this.email.includes("@")) throw new Error("Invalid email");
  }
  
  changeName(newName: string) {
    this.name = newName;
  }
}
```

### 3. Circular Dependencies
```typescript
// ❌ A depends on B, B depends on A
class OrderService {
  constructor(private inventoryService: InventoryService) { }
}

class InventoryService {
  constructor(private orderService: OrderService) { } // Circular!
}

// ✅ Use events or mediator pattern
```

## Resources
- [SOLID Principles by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)
- [Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)
- [Design by Contract](https://en.wikipedia.org/wiki/Design_by_contract)

## Next Steps
Complete the exercises in `exercises/starter.ts` to practice applying SOLID principles and advanced OOP concepts to real-world scenarios.
