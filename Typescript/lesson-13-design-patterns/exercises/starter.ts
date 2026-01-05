// Exercise 1: Type-safe Plugin System
// TODO: Create PluginManager<T> where T is the plugin interface
// - register(name: string, plugin: T): void
// - load(name: string): T | undefined
// - unload(name: string): boolean
// - listPlugins(): string[]

// Exercise 2: Memento Pattern for undo/redo
// TODO: Implement:
// - Editor class with text content
// - Memento class to store state
// - Caretaker class to manage history
// Should support full type safety

// Exercise 3: Chain of Responsibility
// TODO: Create type-safe request handler chain:
// - Handler<TRequest, TResponse> interface
// - BaseHandler abstract class
// - Specific handlers (e.g., AuthHandler, ValidationHandler, ProcessHandler)

// Exercise 4: Either Monad
// TODO: Implement Either<L, R> for error handling:
// - Left(error) for failures
// - Right(value) for success
// - map, flatMap, fold methods
// Use for API call error handling

export {};
