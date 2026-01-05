# Lesson 23: Creational Design Patterns - Deep Dive

## Objective
Master all creational design patterns in depth, understanding when and how to use Factory Method, Abstract Factory, Builder, Prototype, and Singleton patterns with TypeScript type safety.

## Topics Covered

### 1. Factory Method Pattern
**Intent**: Define an interface for creating objects, but let subclasses decide which class to instantiate.

**When to Use**:
- Class can't anticipate the type of objects it needs to create
- Subclasses should specify the objects they create
- Want to localize knowledge of which class gets created

```typescript
abstract class Creator {
  abstract factoryMethod(): Product;
  
  someOperation(): string {
    const product = this.factoryMethod();
    return `Creator: ${product.operation()}`;
  }
}

class ConcreteCreatorA extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductA();
  }
}
```

### 2. Abstract Factory Pattern
**Intent**: Provide an interface for creating families of related objects without specifying concrete classes.

**When to Use**:
- System should be independent of how products are created
- System should work with multiple families of products
- Family of related products must be used together
- Want to reveal only interfaces, not implementations

```typescript
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }
  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}
```

### 3. Builder Pattern
**Intent**: Separate construction of complex object from its representation, allowing same construction process to create different representations.

**When to Use**:
- Algorithm for creating object should be independent of parts
- Construction process must allow different representations
- Object has many optional parameters
- Need step-by-step construction

```typescript
class Product {
  private parts: string[] = [];
  
  add(part: string): void {
    this.parts.push(part);
  }
  
  listParts(): string {
    return this.parts.join(", ");
  }
}

interface Builder {
  buildPartA(): void;
  buildPartB(): void;
  buildPartC(): void;
}

class ConcreteBuilder implements Builder {
  private product: Product = new Product();
  
  reset(): void {
    this.product = new Product();
  }
  
  buildPartA(): void {
    this.product.add("PartA");
  }
  
  buildPartB(): void {
    this.product.add("PartB");
  }
  
  buildPartC(): void {
    this.product.add("PartC");
  }
  
  getProduct(): Product {
    const result = this.product;
    this.reset();
    return result;
  }
}

class Director {
  construct(builder: Builder): void {
    builder.buildPartA();
    builder.buildPartB();
  }
}
```

### 4. Prototype Pattern
**Intent**: Specify kinds of objects to create using prototypical instance, and create new objects by copying this prototype.

**When to Use**:
- Classes to instantiate are specified at runtime
- Avoid building class hierarchies of factories
- Instances of class have few different combinations of state
- Object creation is expensive

```typescript
interface Prototype {
  clone(): Prototype;
}

class ConcretePrototype implements Prototype {
  constructor(
    public field1: number,
    public field2: string,
    public field3: Date
  ) {}
  
  clone(): ConcretePrototype {
    return new ConcretePrototype(
      this.field1,
      this.field2,
      new Date(this.field3.getTime())
    );
  }
}
```

### 5. Singleton Pattern
**Intent**: Ensure class has only one instance and provide global point of access to it.

**When to Use**:
- Exactly one instance of class required
- Instance must be accessible from well-known access point
- Sole instance should be extensible by subclassing

```typescript
class Singleton {
  private static instance: Singleton;
  
  private constructor() {} // Private constructor
  
  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

## Advanced TypeScript Patterns

### Type-Safe Factory with Generics
```typescript
interface Product {
  operation(): string;
}

class Factory<T extends Product> {
  private creator: () => T;
  
  constructor(creator: () => T) {
    this.creator = creator;
  }
  
  create(): T {
    return this.creator();
  }
}
```

### Builder with Fluent Interface and Type State
```typescript
type Built<T> = T & { __built: true };

class TypeSafeBuilder<T extends {}> {
  private obj: Partial<T> = {};
  
  set<K extends keyof T>(key: K, value: T[K]): this {
    this.obj[key] = value;
    return this;
  }
  
  build(): Built<Required<T>> {
    // Validate all required fields are set
    return this.obj as Built<Required<T>>;
  }
}
```

## Learning Outcomes
- Choose appropriate creational pattern for each scenario
- Implement type-safe factories and builders
- Use prototype pattern for efficient cloning
- Apply singleton pattern correctly (and know its drawbacks)
- Combine creational patterns for complex scenarios

## Practice Challenges

1. **Document Parser Factory**: Create factory for different document types (PDF, DOCX, TXT)
2. **UI Theme Factory**: Abstract factory for light/dark themes with buttons, inputs, cards
3. **HTTP Request Builder**: Fluent builder for complex HTTP requests with headers, params
4. **Game Character Prototype**: Clone characters with different attributes
5. **Configuration Singleton**: Thread-safe config manager with lazy initialization
6. **Vehicle Factory**: Factory method for creating cars, trucks, motorcycles
7. **Query Builder**: Type-safe SQL query builder with fluent interface
8. **Notification Factory**: Factory for creating email, SMS, push notifications

## Common Pitfalls

### Singleton Anti-Patterns
```typescript
// ❌ Global state makes testing difficult
class GlobalConfig {
  private static instance: GlobalConfig;
  public settings: any = {};
}

// ✅ Better: Dependency injection
class Config {
  constructor(public settings: any) {}
}

class Service {
  constructor(private config: Config) {}
}
```

### Factory Overuse
```typescript
// ❌ Unnecessary abstraction
class StringFactory {
  create(value: string): string {
    return value; // Why?
  }
}

// ✅ Use factories when there's real complexity
```

## Pattern Comparison

| Pattern | Purpose | Complexity | Flexibility |
|---------|---------|------------|-------------|
| Factory Method | Delegate object creation to subclasses | Low | Medium |
| Abstract Factory | Create families of related objects | Medium | High |
| Builder | Construct complex objects step-by-step | Medium | High |
| Prototype | Clone existing objects | Low | Low |
| Singleton | Ensure single instance | Low | Low |

## Resources
- [Design Patterns by Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru - Creational Patterns](https://refactoring.guru/design-patterns/creational-patterns)
- [TypeScript Design Patterns](https://www.patterns.dev/posts/classic-design-patterns/)

## Next Steps
Complete the exercises in `exercises/starter.ts` to practice implementing creational patterns in real-world scenarios with TypeScript type safety.
