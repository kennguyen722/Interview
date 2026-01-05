// Exercise 1: withTimeout function
// TODO: Create withTimeout<T>(p: Promise<T>, ms: number): Promise<T>
// Should reject with Error("Timeout") if promise doesn't settle in time

// Exercise 2: Retry helper with exponential backoff
// TODO: Create retry<T>(
//   fn: () => Promise<T>,
//   maxAttempts: number,
//   baseDelayMs: number = 100
// ): Promise<T>
// Should exponentially back off between attempts

// Exercise 3: Combine two API calls with Result pattern
// TODO: Create fetchAndValidate<T>(
//   fetchFn: () => Promise<T>,
//   validateFn: (data: T) => boolean
// ): Promise<Result<T, { code: string; message: string }>>

export {};
