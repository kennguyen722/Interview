// Exercise 1: deepFreeze function
// TODO: Implement deepFreeze<T>(obj: T): Readonly<T>
// Recursively freeze an object and explain why the return type is only shallow

// Exercise 2: Values type utility
// TODO: Implement Values<T> that produces union of all value types
// Example: Values<{ a: string; b: number }> => string | number

// Exercise 3: Brand type for nominal typing
// TODO: Create Brand<T, B> type that adds a __brand property
// Use it to create userId: Brand<string, "UserId">
// Ensure you can't accidentally pass a string where UserId is expected

export {};
