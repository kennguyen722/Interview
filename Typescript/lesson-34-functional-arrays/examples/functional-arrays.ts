/**
 * LESSON 34: Functional Array Methods & Advanced Transformations
 * 
 * Working examples demonstrating:
 * - Typed map operations with type preservation
 * - Filter with type guards for type narrowing
 * - Custom comparators for complex sorting
 * - Functional pipelines (filter → map → reduce)
 * - Immutable array transformations
 * - Performance-conscious patterns
 */

// ============================================================================
// EXAMPLE 1: Type-Preserving Map Operations
// ============================================================================

function example1_mapBasics() {
  console.log("\n=== EXAMPLE 1: Type-Preserving Map ===");

  // Simple numeric transformation
  const numbers = [1, 2, 3, 4, 5];
  const doubled = numbers.map(n => n * 2);
  console.log("Original:", numbers);
  console.log("Doubled:", doubled);

  // Type transformation: Objects to strings
  interface User {
    id: number;
    name: string;
    age: number;
  }

  const users: User[] = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 }
  ];

  const names = users.map(u => u.name);
  console.log("User names:", names);

  // Complex transformation with new properties
  const profiles = users.map(u => ({
    name: u.name,
    ageGroup: u.age >= 30 ? "30+" : "under-30",
    email: `${u.name.toLowerCase()}@company.com`
  }));
  console.log("Profiles:", profiles);
}

// ============================================================================
// EXAMPLE 2: Filter with Type Guards
// ============================================================================

function example2_filterWithTypeGuards() {
  console.log("\n=== EXAMPLE 2: Filter with Type Guards ===");

  // Type guard function
  function isString(value: string | number): value is string {
    return typeof value === "string";
  }

  const mixed: (string | number)[] = ["hello", 42, "world", 99, "typescript"];
  const strings = mixed.filter(isString);
  console.log("Mixed array:", mixed);
  console.log("Filtered strings:", strings);
  // strings is correctly typed as string[], not (string | number)[]

  // Discriminated union filtering
  type Result<T> = { status: "success"; data: T } | { status: "error"; message: string };

  const results: Result<number>[] = [
    { status: "success", data: 42 },
    { status: "error", message: "Failed" },
    { status: "success", data: 100 }
  ];

  const successResults = results.filter(
    (r): r is { status: "success"; data: number } => r.status === "success"
  );

  console.log("All results:", results);
  console.log("Success results:", successResults);
  console.log("Can safely access .data:", successResults.map(r => r.data));
}

// ============================================================================
// EXAMPLE 3: Custom Comparator Functions
// ============================================================================

function example3_customComparators() {
  console.log("\n=== EXAMPLE 3: Custom Comparators ===");

  interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
  }

  const products: Product[] = [
    { id: 1, name: "Laptop", price: 1200, rating: 4.5 },
    { id: 2, name: "Mouse", price: 50, rating: 4.8 },
    { id: 3, name: "Keyboard", price: 120, rating: 4.2 },
    { id: 4, name: "Monitor", price: 400, rating: 4.7 }
  ];

  // Generic comparator builder
  function compareBy<T>(key: keyof T): (a: T, b: T) => number {
    return (a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    };
  }

  // Sort by different fields
  const byPrice = [...products].sort(compareBy<Product>("price"));
  const byRating = [...products].sort(compareBy<Product>("rating"));

  console.log("Original:", products.map(p => `${p.name} ($${p.price})`));
  console.log("By price:", byPrice.map(p => `${p.name} ($${p.price})`));
  console.log("By rating:", byRating.map(p => `${p.name} (${p.rating}★)`));

  // Multi-field comparator
  function thenBy<T>(
    compare1: (a: T, b: T) => number,
    compare2: (a: T, b: T) => number
  ): (a: T, b: T) => number {
    return (a, b) => {
      const result = compare1(a, b);
      return result !== 0 ? result : compare2(a, b);
    };
  }

  // Sort by rating DESC, then by price ASC
  const byRatingDesc = (a: Product, b: Product) => b.rating - a.rating;
  const byPriceAsc = (a: Product, b: Product) => a.price - b.price;
  const composite = [...products].sort(thenBy(byRatingDesc, byPriceAsc));

  console.log("By rating DESC, price ASC:", 
    composite.map(p => `${p.name} (${p.rating}★, $${p.price})`));
}

// ============================================================================
// EXAMPLE 4: Functional Pipeline Pattern
// ============================================================================

function example4_functionalPipeline() {
  console.log("\n=== EXAMPLE 4: Functional Pipeline ===");

  interface Order {
    id: number;
    amount: number;
    status: "pending" | "completed" | "cancelled";
    customerId: number;
  }

  const orders: Order[] = [
    { id: 1, amount: 100, status: "completed", customerId: 1 },
    { id: 2, amount: 50, status: "pending", customerId: 2 },
    { id: 3, amount: 200, status: "completed", customerId: 1 },
    { id: 4, amount: 75, status: "cancelled", customerId: 3 },
    { id: 5, amount: 150, status: "completed", customerId: 2 }
  ];

  // Pipeline: filter → map → sort → reduce
  const pipeline = orders
    .filter(o => o.status === "completed")
    .map(o => ({ ...o, tax: o.amount * 0.1, total: o.amount * 1.1 }))
    .sort((a, b) => b.total - a.total)
    .reduce((sum, o) => sum + o.total, 0);

  console.log("Total revenue from completed orders (with tax):", `$${pipeline.toFixed(2)}`);

  // Step-by-step breakdown
  const step1 = orders.filter(o => o.status === "completed");
  console.log(`Step 1 (filter completed): ${step1.length} orders`);

  const step2 = step1.map(o => ({ ...o, tax: o.amount * 0.1, total: o.amount * 1.1 }));
  console.log(`Step 2 (add tax): ${step2[0]?.amount} + ${step2[0]?.tax?.toFixed(2)} tax`);

  const step3 = step2.sort((a, b) => b.total - a.total);
  console.log(`Step 3 (sorted by total):`, step3.map(o => `$${o.total.toFixed(2)}`).join(", "));
}

// ============================================================================
// EXAMPLE 5: Reduce for Aggregation
// ============================================================================

function example5_reduceAggregation() {
  console.log("\n=== EXAMPLE 5: Reduce for Aggregation ===");

  interface Transaction {
    id: number;
    type: "income" | "expense";
    amount: number;
    category: string;
  }

  const transactions: Transaction[] = [
    { id: 1, type: "income", amount: 5000, category: "salary" },
    { id: 2, type: "expense", amount: 500, category: "groceries" },
    { id: 3, type: "expense", amount: 200, category: "utilities" },
    { id: 4, type: "income", amount: 1000, category: "freelance" },
    { id: 5, type: "expense", amount: 300, category: "groceries" }
  ];

  // Group by category
  const byCategory = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { income: 0, expense: 0 };
    }
    acc[t.category][t.type] += t.amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  console.log("Grouped by category:", byCategory);

  // Count by type
  const countByType = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("Count by type:", countByType);

  // Running balance
  const runningBalance = transactions.reduce((acc, t) => {
    const delta = t.type === "income" ? t.amount : -t.amount;
    const balance = (acc[acc.length - 1]?.balance ?? 0) + delta;
    acc.push({ id: t.id, delta, balance });
    return acc;
  }, [] as Array<{ id: number; delta: number; balance: number }>);

  console.log("Running balance:", runningBalance);
}

// ============================================================================
// EXAMPLE 6: FlatMap and Flattening
// ============================================================================

function example6_flatMapFlattening() {
  console.log("\n=== EXAMPLE 6: FlatMap & Flattening ===");

  // Basic flat
  const nested = [[1, 2], [3, 4], [5, 6]];
  const flat = nested.flat();
  console.log("Nested:", nested);
  console.log("Flattened:", flat);

  // FlatMap: map + flatten
  const sentences = ["hello world", "typescript rocks"];
  const words = sentences.flatMap(s => s.split(" "));
  console.log("Sentences:", sentences);
  console.log("Words:", words);

  // Complex example: Extract all comments from posts
  interface Comment {
    id: number;
    text: string;
  }

  interface Post {
    id: number;
    title: string;
    comments?: Comment[];
  }

  const posts: Post[] = [
    {
      id: 1,
      title: "TypeScript Tips",
      comments: [
        { id: 1, text: "Great post!" },
        { id: 2, text: "Very helpful" }
      ]
    },
    {
      id: 2,
      title: "Functional Programming",
      comments: undefined
    },
    {
      id: 3,
      title: "Advanced Types",
      comments: [{ id: 3, text: "Mind blown!" }]
    }
  ];

  const allComments = posts.flatMap(p => p.comments ?? []);
  console.log("All comments:", allComments.map(c => `"${c.text}"`).join(", "));
}

// ============================================================================
// EXAMPLE 7: Type-Safe Filter with Defined Check
// ============================================================================

function example7_filterDefined() {
  console.log("\n=== EXAMPLE 7: Filter Defined Values ===");

  // Type guard for defined values
  function isDefined<T>(value: T | null | undefined): value is T {
    return value != null;
  }

  const items: (number | undefined)[] = [1, undefined, 2, undefined, 3, 4, undefined];
  const defined = items.filter(isDefined);
  console.log("Items with undefined:", items);
  console.log("Only defined:", defined);

  // Practical example: Optional fields
  interface User {
    id: number;
    name: string;
    email?: string;
  }

  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie", email: "charlie@example.com" }
  ];

  const emails = users.map(u => u.email).filter(isDefined);
  console.log("Only emails:", emails);
}

// ============================================================================
// EXAMPLE 8: Immutable Transformations
// ============================================================================

function example8_immutableTransforms() {
  console.log("\n=== EXAMPLE 8: Immutable Transformations ===");

  const numbers = [3, 1, 4, 1, 5, 9, 2, 6];

  // Non-mutating operations using spread operator
  const sorted = [...numbers].sort((a, b) => a - b);
  const reversed = [...numbers].reverse();

  console.log("Original (unchanged):", numbers);
  console.log("Sorted copy:", sorted);
  console.log("Reversed copy:", reversed);

  // Multiple transformations on copy
  const original = [5, 2, 8, 1, 9];
  const transformed = original
    .map(n => ({ value: n, doubled: n * 2 }))
    .filter(x => x.value > 2)
    .sort((a, b) => a.doubled - b.doubled)
    .map(x => x.doubled);

  console.log("Original still intact:", original);
  console.log("Transformed:", transformed);
}

// ============================================================================
// EXAMPLE 9: Performance Comparison - Single vs Multiple Passes
// ============================================================================

function example9_performanceComparison() {
  console.log("\n=== EXAMPLE 9: Performance: Multi-Pass vs Single-Pass ===");

  // Create large dataset
  const data = Array.from({ length: 1000000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100,
    active: Math.random() > 0.5
  }));

  // Multi-pass: filter → map
  const t1 = performance.now();
  const multiPass = data
    .filter(x => x.active)
    .map(x => x.value * 2);
  const t2 = performance.now();

  // Single-pass: reduce
  const t3 = performance.now();
  const singlePass = data.reduce<number[]>((acc, x) => {
    if (x.active) acc.push(x.value * 2);
    return acc;
  }, []);
  const t4 = performance.now();

  console.log(`Multi-pass (filter→map): ${(t2 - t1).toFixed(2)}ms`);
  console.log(`Single-pass (reduce): ${(t4 - t3).toFixed(2)}ms`);
  console.log(`Results match: ${multiPass.length === singlePass.length}`);
}

// ============================================================================
// EXAMPLE 10: Generator-Based Lazy Evaluation
// ============================================================================

function example10_lazyEvaluation() {
  console.log("\n=== EXAMPLE 10: Lazy Evaluation with Generators ===");

  // Generator for lazy filtering and mapping
  function* lazyProcess<T, U>(
    arr: T[],
    predicate: (x: T) => boolean,
    transform: (x: T) => U
  ): Generator<U, void, unknown> {
    console.log("  [Generator initialized, not evaluated yet]");
    for (const item of arr) {
      if (predicate(item)) {
        console.log(`  [Computing for item]`);
        yield transform(item);
      }
    }
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  console.log("Creating lazy generator...");
  const lazy = lazyProcess(
    numbers,
    x => x > 3 && x < 8,
    x => x * 2
  );

  console.log("Taking first 2 values:");
  let count = 0;
  for (const value of lazy) {
    console.log(`  Value: ${value}`);
    if (++count === 2) break;
  }
}

// ============================================================================
// MAIN: Run all examples
// ============================================================================

function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   LESSON 34: Functional Array Methods & Transformations    ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  example1_mapBasics();
  example2_filterWithTypeGuards();
  example3_customComparators();
  example4_functionalPipeline();
  example5_reduceAggregation();
  example6_flatMapFlattening();
  example7_filterDefined();
  example8_immutableTransforms();
  example9_performanceComparison();
  example10_lazyEvaluation();

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║              All examples completed successfully!           ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
}

main();
