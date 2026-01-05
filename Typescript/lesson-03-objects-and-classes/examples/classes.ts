// Example 1: Interfaces and structural typing
interface User {
  id: string;
  name: string;
  email?: string;
}

function sendEmail(user: User): void {
  console.log(`Sending email to ${user.email || "no-email"}`);
}

// ✓ OK: This object has the required shape
const admin = { id: "1", name: "Root", email: "root@example.com", role: "admin" };
sendEmail(admin);

// Example 2: Readonly properties
interface Config {
  readonly apiKey: string;
  readonly baseUrl: string;
  retries?: number;
}

const config: Config = {
  apiKey: "secret",
  baseUrl: "https://api.example.com",
  retries: 3
};

// ❌ Error: cannot assign to readonly property
// config.apiKey = "new-secret";

// Example 3: Index signatures and Record
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  "hello": "hola",
  "goodbye": "adiós"
};

// Alternative using Record
const userRoles: Record<string, string> = {
  "admin": "Administrator",
  "user": "Regular User",
  "guest": "Guest"
};

// Example 4: Classes and implements
interface Repository<T> {
  get(id: string): T | undefined;
  save(entity: T): void;
  delete(id: string): boolean;
}

class MemoryRepository<T extends { id: string }> implements Repository<T> {
  #store = new Map<string, T>();

  get(id: string): T | undefined {
    return this.#store.get(id);
  }

  save(entity: T): void {
    this.#store.set(entity.id, entity);
  }

  delete(id: string): boolean {
    return this.#store.delete(id);
  }

  list(): T[] {
    return Array.from(this.#store.values());
  }
}

// Example 5: Parameter properties
class Point {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  distance(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

const p = new Point(3, 4);
console.log(`Distance from origin: ${p.distance()}`); // 5

// Example 6: Getters and setters with validation
class Person {
  private _age: number = 0;

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = value;
  }

  constructor(public name: string) {}
}

const person = new Person("Ada");
person.age = 30;
console.log(`${person.name} is ${person.age} years old`);
// person.age = -5; // ❌ Error: Age cannot be negative

// Example 7: Visibility modifiers
class BankAccount {
  public accountNumber: string;
  protected balance: number = 0; // Accessible to subclasses
  private pin: string; // Private field

  constructor(accountNumber: string, pin: string) {
    this.accountNumber = accountNumber;
    this.pin = pin;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  public getBalance(): number {
    return this.balance;
  }

  private validatePin(pin: string): boolean {
    return pin === this.pin;
  }
}

class SavingsAccount extends BankAccount {
  private interestRate: number = 0.02;

  applyInterest(): void {
    this.balance *= (1 + this.interestRate); // ✓ Can access protected balance
  }
}

export { User, Config, StringMap, Repository, MemoryRepository, Point, Person, BankAccount };
