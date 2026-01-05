// Exercise 1: Refactor to Single Responsibility Principle
// This class violates SRP by handling multiple concerns
// TODO: Split into separate classes

class BlogPost {
  constructor(public title: string, public content: string, public author: string) {}

  // TODO: Move to separate class
  save() {
    console.log("Saving to database...");
  }

  // TODO: Move to separate class
  sendNotification() {
    console.log("Sending notification...");
  }

  // TODO: Move to separate class
  generateHTML() {
    return `<article><h1>${this.title}</h1><p>${this.content}</p></article>`;
  }

  // TODO: Move to separate class
  calculateReadingTime() {
    const wordsPerMinute = 200;
    const words = this.content.split(" ").length;
    return Math.ceil(words / wordsPerMinute);
  }
}

// Exercise 2: Open/Closed Principle
// Create a discount system that's open for extension
// Add new discount types without modifying existing code

// TODO: Create abstract Discount class
// TODO: Implement PercentageDiscount, FixedAmountDiscount, BuyOneGetOne discounts
// TODO: Create DiscountCalculator that works with any discount type

class Order {
  constructor(public items: Array<{ name: string; price: number }>) {}

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// Exercise 3: Liskov Substitution Principle
// Fix the LSP violation in this code

abstract class PaymentMethod {
  abstract process(amount: number): boolean;
}

class CreditCard extends PaymentMethod {
  process(amount: number): boolean {
    console.log(`Processing $${amount} via credit card`);
    return true;
  }
}

class Cash extends PaymentMethod {
  process(amount: number): boolean {
    console.log(`Processing $${amount} via cash`);
    return true;
  }
}

// TODO: Fix this - it violates LSP by throwing instead of following contract
class Cryptocurrency extends PaymentMethod {
  process(amount: number): boolean {
    if (amount > 1000) {
      throw new Error("Crypto payments limited to $1000");
    }
    console.log(`Processing $${amount} via cryptocurrency`);
    return true;
  }
}

// Exercise 4: Interface Segregation Principle
// This fat interface forces implementers to implement methods they don't need
// TODO: Split into smaller, role-specific interfaces

interface Printer {
  print(document: string): void;
  scan(document: string): void;
  fax(document: string): void;
  staple(document: string): void;
  email(document: string, recipient: string): void;
}

// TODO: Create segregated interfaces and update implementations
// class SimplePrinter implements ??? { }
// class MultiFunctionPrinter implements ??? { }
// class NetworkPrinter implements ??? { }

// Exercise 5: Dependency Inversion Principle
// Refactor this code to depend on abstractions

// TODO: Create INotificationService interface
// TODO: Make NotificationManager depend on abstraction

class EmailNotifier {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class SMSNotifier {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}

// Depends on concrete classes (violation of DIP)
class NotificationManager {
  private emailNotifier = new EmailNotifier();
  private smsNotifier = new SMSNotifier();

  notifyByEmail(message: string): void {
    this.emailNotifier.send(message);
  }

  notifyBySMS(message: string): void {
    this.smsNotifier.send(message);
  }
}

// Exercise 6: Composition over Inheritance
// Refactor this rigid inheritance hierarchy to use composition

class Animal {
  eat() {
    console.log("Eating");
  }
  sleep() {
    console.log("Sleeping");
  }
}

class FlyingAnimal extends Animal {
  fly() {
    console.log("Flying");
  }
}

class SwimmingAnimal extends Animal {
  swim() {
    console.log("Swimming");
  }
}

// Problem: What about animals that both fly and swim?
// TODO: Refactor to use composition with Flyable and Swimmable behaviors

// Exercise 7: Abstract Class with Template Method
// Implement a game framework using template method pattern

// TODO: Create abstract Game class with template method
// TODO: Implement Chess and Poker games

abstract class Game {
  // TODO: Implement template method that calls:
  // initialize(), startPlay(), endPlay()
}

// Exercise 8: Rich Domain Model vs Anemic Model
// Convert this anemic model to a rich domain model

// Anemic model (just data)
class ProductAnemic {
  id: string = "";
  name: string = "";
  price: number = 0;
  stock: number = 0;
}

class ProductServiceAnemic {
  decreaseStock(product: ProductAnemic, quantity: number): void {
    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }
    product.stock -= quantity;
  }

  increasePrice(product: ProductAnemic, amount: number): void {
    product.price += amount;
  }
}

// TODO: Create rich Product class that encapsulates behavior
// Methods: decreaseStock, increaseStock, updatePrice, isInStock, etc.

// Exercise 9: Design by Contract
// Implement a Stack with preconditions, postconditions, and invariants

class Stack<T> {
  // TODO: Implement with:
  // - Precondition: push requires non-null item
  // - Precondition: pop requires non-empty stack
  // - Postcondition: push increases size by 1
  // - Postcondition: pop decreases size by 1
  // - Invariant: size >= 0
  // - Invariant: size <= capacity
}

// Exercise 10: Polymorphism with Strategy Pattern
// Create a sorting context that can use different sorting strategies

// TODO: Create ISortStrategy interface
// TODO: Implement BubbleSort, QuickSort, MergeSort strategies
// TODO: Create Sorter class that accepts any strategy

interface ISortStrategy {
  sort(array: number[]): number[];
}

class Sorter {
  constructor(private strategy: ISortStrategy) {}

  sort(array: number[]): number[] {
    return this.strategy.sort(array);
  }

  setStrategy(strategy: ISortStrategy): void {
    this.strategy = strategy;
  }
}

export {};
