# Lesson 13: Design Patterns in TypeScript

## Goals
- Implement classic Gang of Four patterns with TypeScript types
- Build type-safe factories, decorators, and strategies
- Use patterns for dependency injection and plugin systems
- Apply functional programming patterns (monads, lenses)

## Creational Patterns

### Factory Pattern with Type Guards
```ts
interface Shape {
  type: string;
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

type ShapeType = Circle | Rectangle;

class ShapeFactory {
  static create(type: "circle", radius: number): Circle;
  static create(type: "rectangle", width: number, height: number): Rectangle;
  static create(type: string, ...args: any[]): ShapeType {
    switch (type) {
      case "circle":
        return { type: "circle", radius: args[0], draw: () => {} };
      case "rectangle":
        return { type: "rectangle", width: args[0], height: args[1], draw: () => {} };
      default:
        throw new Error("Unknown shape");
    }
  }
}
```

### Builder Pattern (Already covered in lesson 12)
See advanced builder with type state pattern.

### Singleton with TypeScript
```ts
class ConfigService {
  private static instance: ConfigService;
  private config: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key);
  }

  set<T>(key: string, value: T): void {
    this.config.set(key, value);
  }
}
```

## Structural Patterns

### Adapter Pattern
```ts
// Legacy interface
interface LegacyUser {
  first_name: string;
  last_name: string;
  email_address: string;
}

// Modern interface
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

class UserAdapter {
  static toModern(legacy: LegacyUser): User {
    return {
      firstName: legacy.first_name,
      lastName: legacy.last_name,
      email: legacy.email_address,
    };
  }

  static toLegacy(modern: User): LegacyUser {
    return {
      first_name: modern.firstName,
      last_name: modern.lastName,
      email_address: modern.email,
    };
  }
}
```

### Decorator Pattern with TypeScript Decorators
```ts
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = original.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

### Proxy Pattern
```ts
interface DataService {
  getData(id: string): Promise<any>;
}

class RealDataService implements DataService {
  async getData(id: string): Promise<any> {
    // Expensive operation
    return { id, data: "..." };
  }
}

class CachingProxy implements DataService {
  private cache = new Map<string, any>();

  constructor(private real: DataService) {}

  async getData(id: string): Promise<any> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    const data = await this.real.getData(id);
    this.cache.set(id, data);
    return data;
  }
}
```

## Behavioral Patterns

### Strategy Pattern with Type Safety
```ts
interface SortStrategy<T> {
  sort(items: T[]): T[];
}

class QuickSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    // Quick sort implementation
    return items.sort();
  }
}

class MergeSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    // Merge sort implementation
    return items.sort();
  }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  sort(items: T[]): T[] {
    return this.strategy.sort(items);
  }
}
```

### Observer Pattern (Pub/Sub)
```ts
type EventHandler<T = any> = (data: T) => void;

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit<T>(event: string, data: T): void {
    this.handlers.get(event)?.forEach((handler) => handler(data));
  }
}
```

### Command Pattern
```ts
interface Command {
  execute(): void;
  undo(): void;
}

class AddTextCommand implements Command {
  private previousText: string;

  constructor(
    private editor: TextEditor,
    private text: string
  ) {
    this.previousText = editor.getText();
  }

  execute(): void {
    this.editor.setText(this.previousText + this.text);
  }

  undo(): void {
    this.editor.setText(this.previousText);
  }
}

class TextEditor {
  private history: Command[] = [];
  private text = "";

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    command?.undo();
  }
}
```

## Functional Patterns

### Maybe/Option Monad
```ts
class Maybe<T> {
  private constructor(private value: T | null) {}

  static of<T>(value: T | null): Maybe<T> {
    return new Maybe(value);
  }

  isNothing(): boolean {
    return this.value === null || this.value === undefined;
  }

  map<U>(fn: (val: T) => U): Maybe<U> {
    return this.isNothing() ? Maybe.of<U>(null) : Maybe.of(fn(this.value!));
  }

  flatMap<U>(fn: (val: T) => Maybe<U>): Maybe<U> {
    return this.isNothing() ? Maybe.of<U>(null) : fn(this.value!);
  }

  getOrElse(defaultValue: T): T {
    return this.isNothing() ? defaultValue : this.value!;
  }
}
```

## Exercises
- Implement a type-safe Plugin system with register/load/unload methods
- Create a Memento pattern for undo/redo with full type safety
- Build a Chain of Responsibility with typed handlers
- Implement Either monad for error handling (Left/Right pattern)
