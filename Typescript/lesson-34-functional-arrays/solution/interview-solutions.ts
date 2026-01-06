/**
 * LESSON 34: Functional Array Methods - SOLUTIONS
 * 
 * Complete solutions for all exercises with explanations and complexity analysis.
 */

// ============================================================================
// SOLUTION 1: Product Filtering & Discount Pipeline
// ============================================================================

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface DiscountedProduct extends Product {
  originalPrice: number;
  discountedPrice: number;
}

/**
 * Filter products by category, apply discount, and sort by price
 * 
 * Time Complexity: O(n log n) - due to sort
 * Space Complexity: O(n) - for new array
 */
function filterDiscountSort(products: Product[], category: string): DiscountedProduct[] {
  return products
    .filter(p => p.category === category)
    .map(p => ({
      ...p,
      originalPrice: p.price,
      discountedPrice: p.price * 0.9
    }))
    .sort((a, b) => a.discountedPrice - b.discountedPrice);
}

// ============================================================================
// SOLUTION 2: User Email Pipeline with Type Guards
// ============================================================================

interface User {
  id: number;
  name: string;
  email?: string;
}

/**
 * Type guard to ensure email is defined
 */
function hasEmail(user: User): user is User & { email: string } {
  return user.email !== undefined && user.email !== null;
}

/**
 * Extract email addresses from users with defined emails, sorted by name
 * 
 * Time Complexity: O(n log n) - due to sort
 * Space Complexity: O(n) - for filtered and mapped arrays
 */
function getUserEmails(users: User[]): string[] {
  return users
    .filter(hasEmail)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(u => u.email);
}

// ============================================================================
// SOLUTION 3: Polymorphic Comparator Factory
// ============================================================================

type Comparator<T> = (a: T, b: T) => number;

/**
 * Creates a comparator that sorts by a specific property
 * 
 * Time Complexity: O(1) - returns function
 * Space Complexity: O(1) - closure over key
 */
function compareBy<T>(key: keyof T): Comparator<T> {
  return (a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  };
}

/**
 * Reverses comparison order for descending sort
 * 
 * Time Complexity: O(1) - wraps comparator
 * Space Complexity: O(1) - closure
 */
function reverse<T>(comparator: Comparator<T>): Comparator<T> {
  return (a, b) => -comparator(a, b);
}

/**
 * Chains two comparators: uses second when first returns 0
 * 
 * Time Complexity: O(1) - returns function
 * Space Complexity: O(1) - closure
 */
function thenBy<T>(first: Comparator<T>, second: Comparator<T>): Comparator<T> {
  return (a, b) => {
    const result = first(a, b);
    return result !== 0 ? result : second(a, b);
  };
}

// Example usage:
function demonstrateComparators() {
  interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
  }

  const products: Product[] = [
    { id: 1, name: "Laptop", price: 1200, rating: 4.5 },
    { id: 2, name: "Mouse", price: 50, rating: 4.8 },
    { id: 3, name: "Keyboard", price: 120, rating: 4.5 }
  ];

  const byPrice = [...products].sort(compareBy<Product>("price"));
  const byRatingDesc = [...products].sort(reverse(compareBy<Product>("rating")));
  const byRatingThenPrice = [...products].sort(
    thenBy(reverse(compareBy<Product>("rating")), compareBy<Product>("price"))
  );
}

// ============================================================================
// SOLUTION 4: Stream Aggregation with Reduce
// ============================================================================

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
}

interface TransactionSummary {
  category: string;
  income: number;
  expense: number;
  net: number;
}

/**
 * Summarize transactions by category with aggregation and filtering
 * 
 * Time Complexity: O(n log n) - due to sort
 * Space Complexity: O(n) - for aggregated and final arrays
 * 
 * Key insight: Use reduce for single-pass aggregation, then transform and filter
 */
function summarizeTransactions(transactions: Transaction[]): TransactionSummary[] {
  // Step 1: Group by category with reduce
  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { income: 0, expense: 0 };
    }
    acc[t.category][t.type] += t.amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  // Step 2: Convert to array and calculate net
  return Object.entries(grouped)
    .map(([category, amounts]) => ({
      category,
      ...amounts,
      net: amounts.income - amounts.expense
    }))
    // Step 3: Filter out zero balance
    .filter(s => s.net !== 0)
    // Step 4: Sort by net balance (highest first)
    .sort((a, b) => b.net - a.net);
}

// ============================================================================
// SOLUTION 5: Lazy Stream Processing
// ============================================================================

/**
 * Lazily filter items matching predicate
 * 
 * Time Complexity: O(n) - but only for items yielded
 * Space Complexity: O(1) - generator, no array allocation
 */
function* lazyFilter<T>(arr: T[], predicate: (x: T) => boolean): Generator<T> {
  for (const item of arr) {
    if (predicate(item)) yield item;
  }
}

/**
 * Lazily transform items
 * 
 * Time Complexity: O(n) - but only for items yielded
 * Space Complexity: O(1) - generator
 */
function* lazyMap<T, U>(arr: Iterable<T>, transform: (x: T) => U): Generator<U> {
  for (const item of arr) {
    yield transform(item);
  }
}

/**
 * Lazily take first n items
 * 
 * Time Complexity: O(n) where n is items taken
 * Space Complexity: O(1) - generator
 */
function* lazyTake<T>(arr: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const item of arr) {
    if (count++ >= n) break;
    yield item;
  }
}

/**
 * Demonstrate lazy evaluation
 */
function demonstrateLazyEvaluation() {
  const data = Array.from({ length: 1000000 }, (_, i) => i);

  // With lazy evaluation, only processes 10 items
  const result = lazyTake(
    lazyMap(
      lazyFilter(data, x => x > 500000),
      x => x * 2
    ),
    10
  );

  const collected: number[] = [];
  for (const value of result) {
    collected.push(value);
  }
  // collected now has 10 values, but only processed ~10 items instead of 1M
}

// ============================================================================
// SOLUTION 6: Immutable Data Structure Updates
// ============================================================================

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoList {
  todos: Todo[];
  filters: string[];
}

/**
 * Add todo to list without mutating original
 * 
 * Time Complexity: O(n) - creates new array
 * Space Complexity: O(n) - new array
 */
function addTodo(list: TodoList, todo: Todo): TodoList {
  return {
    ...list,
    todos: [...list.todos, todo]
  };
}

/**
 * Remove todo by id without mutating original
 * 
 * Time Complexity: O(n) - filter
 * Space Complexity: O(n) - new array
 */
function removeTodo(list: TodoList, id: number): TodoList {
  return {
    ...list,
    todos: list.todos.filter(t => t.id !== id)
  };
}

/**
 * Update todo by id without mutating original
 * 
 * Time Complexity: O(n) - map
 * Space Complexity: O(n) - new array
 */
function updateTodo(list: TodoList, id: number, updates: Partial<Todo>): TodoList {
  return {
    ...list,
    todos: list.todos.map(t => t.id === id ? { ...t, ...updates } : t)
  };
}

/**
 * Filter todos by matching text
 * 
 * Time Complexity: O(n) - filter
 * Space Complexity: O(n) - new array
 */
function filterTodos(list: TodoList, searchText: string): TodoList {
  return {
    ...list,
    todos: list.todos.filter(t => t.text.toLowerCase().includes(searchText.toLowerCase()))
  };
}

// ============================================================================
// SOLUTION 7: Conditional Mapping & Type Narrowing
// ============================================================================

type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "loading" }
  | { status: "error"; message: string };

/**
 * Type guard for successful response
 */
function isSuccess<T>(r: ApiResponse<T>): r is { status: "success"; data: T } {
  return r.status === "success";
}

/**
 * Extract data from successful API responses only
 * 
 * Time Complexity: O(n) - filter + map
 * Space Complexity: O(n) - filtered array
 * 
 * Key insight: Type guard allows type-safe .data access after filter
 */
function extractData<T>(responses: ApiResponse<T>[]): T[] {
  return responses
    .filter(isSuccess)
    .map(r => r.data);
}

// ============================================================================
// SOLUTION 8: Sorting Objects with Nested Properties
// ============================================================================

interface Author {
  id: number;
  name: string;
  joinDate: Date;
}

interface Book {
  id: number;
  title: string;
  author: Author;
  rating: number;
}

/**
 * Create comparator for nested properties
 * Handles string, number, and Date types
 * 
 * Time Complexity: O(1) - returns function
 * Space Complexity: O(1) - closure
 */
function compareByNested<T, K>(keyExtractor: (t: T) => K): Comparator<T> {
  return (a, b) => {
    const aVal = keyExtractor(a);
    const bVal = keyExtractor(b);

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal);
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return aVal.getTime() - bVal.getTime();
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }

    return 0;
  };
}

// Example usage:
function demonstrateNestedSorting() {
  const books: Book[] = [
    {
      id: 1,
      title: "TypeScript Guide",
      author: { id: 1, name: "Alice", joinDate: new Date("2020-01-01") },
      rating: 4.5
    },
    {
      id: 2,
      title: "Advanced TS",
      author: { id: 2, name: "Bob", joinDate: new Date("2019-01-01") },
      rating: 4.8
    }
  ];

  // Sort by author name
  const byAuthorName = [...books].sort(
    compareByNested<Book, string>(b => b.author.name)
  );

  // Sort by author join date (oldest first)
  const byJoinDate = [...books].sort(
    compareByNested<Book, Date>(b => b.author.joinDate)
  );
}

// ============================================================================
// TEST SUITE
// ============================================================================

function runSolutions() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║    LESSON 34: Functional Array Methods - SOLUTIONS        ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  // Test 1: Product discount pipeline
  console.log("✓ Solution 1: Product Filtering & Discount Pipeline");
  const products: Product[] = [
    { id: 1, name: "Laptop", price: 1000, category: "electronics" },
    { id: 2, name: "Mouse", price: 50, category: "electronics" },
    { id: 3, name: "Desk", price: 300, category: "furniture" },
    { id: 4, name: "Chair", price: 200, category: "furniture" }
  ];
  const discounted = filterDiscountSort(products, "electronics");
  console.log(`  Filtered ${discounted.length} electronics with 10% discount`);

  // Test 2: User emails with type guard
  console.log("\n✓ Solution 2: User Email Pipeline");
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie", email: "charlie@example.com" }
  ];
  const emails = getUserEmails(users);
  console.log(`  Extracted ${emails.length} emails: ${emails.join(", ")}`);

  // Test 3: Comparators
  console.log("\n✓ Solution 3: Polymorphic Comparators");
  const testProducts: Product[] = [
    { id: 1, name: "Z", price: 100, category: "a" },
    { id: 2, name: "A", price: 50, category: "b" }
  ];
  const sorted = [...testProducts].sort(compareBy<Product>("name"));
  console.log(`  Sorted by name: ${sorted.map(p => p.name).join(", ")}`);

  // Test 4: Transaction aggregation
  console.log("\n✓ Solution 4: Transaction Aggregation");
  const transactions: Transaction[] = [
    { id: 1, type: "income", amount: 5000, category: "salary" },
    { id: 2, type: "expense", amount: 500, category: "food" },
    { id: 3, type: "income", amount: 1000, category: "freelance" },
    { id: 4, type: "expense", amount: 200, category: "food" }
  ];
  const summary = summarizeTransactions(transactions);
  console.log(`  Summarized ${summary.length} categories with net balance`);

  // Test 5: Lazy evaluation
  console.log("\n✓ Solution 5: Lazy Evaluation");
  const data = Array.from({ length: 100 }, (_, i) => i);
  const lazyResult = Array.from(lazyTake(lazyMap(lazyFilter(data, x => x > 50), x => x * 2), 5));
  console.log(`  Lazily processed: ${lazyResult.join(", ")}`);

  // Test 6: Immutable updates
  console.log("\n✓ Solution 6: Immutable Operations");
  const list: TodoList = {
    todos: [{ id: 1, text: "Learn TS", completed: false }],
    filters: []
  };
  const list2 = addTodo(list, { id: 2, text: "Practice", completed: false });
  console.log(`  Original: ${list.todos.length}, Updated: ${list2.todos.length}`);

  // Test 7: Type-safe data extraction
  console.log("\n✓ Solution 7: Type-Safe Data Extraction");
  const responses: ApiResponse<number>[] = [
    { status: "success", data: 42 },
    { status: "loading" },
    { status: "success", data: 100 }
  ];
  const extracted = extractData(responses);
  console.log(`  Extracted ${extracted.length} successful responses`);

  // Test 8: Nested sorting
  console.log("\n✓ Solution 8: Nested Property Sorting");
  const books: Book[] = [
    {
      id: 1,
      title: "B",
      author: { id: 1, name: "Zoe", joinDate: new Date("2020-01-01") },
      rating: 4.5
    },
    {
      id: 2,
      title: "A",
      author: { id: 2, name: "Alice", joinDate: new Date("2019-01-01") },
      rating: 4.8
    }
  ];
  const byAuthor = [...books].sort(compareByNested<Book, string>(b => b.author.name));
  console.log(`  Sorted by author: ${byAuthor.map(b => b.author.name).join(", ")}`);

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║              All solutions demonstrated! ✓                ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");
}

runSolutions();
