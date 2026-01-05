// Exercise 1: formatUser function
// Create a function that:
// - Accepts an object with id (string | number), name (optional string)
// - Returns a formatted string using narrowing
// - Example: { id: "123", name: "Ada" } => "User: Ada (ID: 123)"
// - Example: { id: 456 } => "User: Unknown (ID: 456)"

// TODO: Implement formatUser

// Exercise 2: API Response discriminated union
// Create discriminated union for:
// - "pending" state
// - "complete" state with data
// - "failed" state with error message
// Then write a function that renders appropriate message for each state

// TODO: Define ApiResponse type
// TODO: Implement renderApiState function

// Exercise 3: Parse function with tuple return
// Create a function that:
// - Attempts to parse a string as JSON
// - Returns [result, null] on success
// - Returns [null, error] on failure
// - Type signature: [data | null, error | null]

// TODO: Implement parseJsonSafe function

export {};
