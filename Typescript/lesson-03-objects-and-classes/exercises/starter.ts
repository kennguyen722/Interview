// Exercise 1: ServiceConfig interface
// TODO: Define interface with:
// - url: required string
// - timeout: optional number
// - token: readonly string

// Exercise 2: Queue<T> generic class
// TODO: Implement with:
// - enqueue(item: T): void
// - dequeue(): T | undefined
// - size property (getter)
// - private array to store items

// Exercise 3: Repository interface and FileRepo implementation
// TODO: Create Repository<T> interface with:
// - get(id: string): Promise<T | undefined>
// - save(entity: T): Promise<void>
// - delete(id: string): Promise<boolean>

// TODO: Create FileRepo<T> stub that implements Repository<T>
// but throws Error in each method saying "not implemented"

export {};
