// Solution 1: ServiceConfig interface
interface ServiceConfig {
  url: string;
  timeout?: number;
  readonly token: string;
}

const config: ServiceConfig = {
  url: "https://api.example.com",
  timeout: 5000,
  token: "secret-token"
};

// config.token = "new-token"; // ❌ Error: readonly property
// config.url = ""; // ✓ OK: not readonly

// Solution 2: Queue<T> generic class
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get size(): number {
    return this.items.length;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Test Queue
const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
queue.enqueue("third");

console.log(`Queue size: ${queue.size}`); // 3
console.log(`Dequeue: ${queue.dequeue()}`); // first
console.log(`Queue size: ${queue.size}`); // 2
console.log(`Peek: ${queue.peek()}`); // second

// Solution 3: Repository interface and FileRepo stub
interface Repository<T extends { id: string }> {
  get(id: string): Promise<T | undefined>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<boolean>;
  list(): Promise<T[]>;
}

class FileRepository<T extends { id: string }> implements Repository<T> {
  constructor(private filePath: string) {}

  async get(id: string): Promise<T | undefined> {
    throw new Error("FileRepository.get() not implemented");
  }

  async save(entity: T): Promise<void> {
    throw new Error("FileRepository.save() not implemented");
  }

  async delete(id: string): Promise<boolean> {
    throw new Error("FileRepository.delete() not implemented");
  }

  async list(): Promise<T[]> {
    throw new Error("FileRepository.list() not implemented");
  }
}

// Usage example (would work once implemented)
interface Product {
  id: string;
  name: string;
  price: number;
}

const repo = new FileRepository<Product>("./products.json");
// await repo.save({ id: "1", name: "Widget", price: 9.99 });
// const product = await repo.get("1");

export { ServiceConfig, Queue, Repository, FileRepository };
