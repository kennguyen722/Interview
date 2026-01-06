/**
 * LESSON 34: Functional Array Methods - EXERCISES
 * 
 * Complete the exercises below using type-safe functional patterns.
 * Each exercise builds practical skills with map, filter, sort, and pipelines.
 */

// ============================================================================
// EXERCISE 1: Product Filtering & Discount Pipeline
// ============================================================================

/*
Create a Product interface with: id (number), name (string), price (number), category (string)

Task:
1. Create a function that filters products by category
2. Applies a 10% discount to remaining products
3. Sorts by price (ascending)
4. Returns the transformed array

Example:
  Input: products with various categories and prices
  Output: [{ id, name, originalPrice, discountedPrice, category }, ...]
  
Hints:
- Use type-safe map to add new properties
- Use filter for category matching
- Use custom comparator for sorting by price
- Preserve original and transformed data
*/

// TODO: Implement function filterDiscountSort
// function filterDiscountSort(products: Product[], category: string): DiscountedProduct[] {
//   return products
//     .filter(/* filter by category */)
//     .map(/* add discount properties */)
//     .sort(/* by discounted price */);
// }

// ============================================================================
// EXERCISE 2: User Email Pipeline with Type Guards
// ============================================================================

/*
Create a User interface with: id (number), name (string), email (string | undefined)

Task:
1. Create a type guard function to check if user has email
2. Filter users with email addresses only
3. Transform to { id, name, email } (email guaranteed present)
4. Sort alphabetically by name
5. Map to email addresses only for export

Example:
  Input: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob", email: "bob@example.com" }, ...]
  Output: ["bob@example.com", ...] with names properly filtered first
  
Hints:
- Type guard: (user): user is { email: string } => user.email !== undefined
- After filter, email type becomes non-optional
- Preserve type safety through entire pipeline
- Sort before final map
*/

// TODO: Implement function getUserEmails
// function getUserEmails(users: User[]): string[] {
//   return users
//     .filter(/* type guard for email */)
//     .sort(/* by name */)
//     .map(/* to email */);
// }

// ============================================================================
// EXERCISE 3: Polymorphic Comparator Factory
// ============================================================================

/*
Task: Build a flexible comparator system for any data type

1. Implement compareBy<T>(key: keyof T) for single-field sorting
2. Implement reverse<T>(comparator) to invert sort order
3. Implement thenBy<T>(primary, secondary) for multi-field sorting
4. Test with different object types (Product, User, etc.)

Example:
  compareBy<Product>("price") → compares products by price
  reverse(compareBy<Product>("rating")) → highest rating first
  thenBy(byRating, byPrice) → sort by rating, then by price within same rating
  
Hints:
- Return comparison function from comparator builder
- Use generic constraint on keyof T
- Chain comparators for multi-field sorting
- Remember: negative = less than, 0 = equal, positive = greater than
*/

// TODO: Implement comparator functions
// function compareBy<T>(key: keyof T): Comparator<T> {
//   return (a, b) => {
//     const aVal = a[key];
//     const bVal = b[key];
//     if (aVal < bVal) return -1;
//     if (aVal > bVal) return 1;
//     return 0;
//   };
// }

// function reverse<T>(comparator: Comparator<T>): Comparator<T> {
//   return (a, b) => -comparator(a, b);
// }

// function thenBy<T>(first: Comparator<T>, second: Comparator<T>): Comparator<T> {
//   return (a, b) => first(a, b) !== 0 ? first(a, b) : second(a, b);
// }

// ============================================================================
// EXERCISE 4: Stream Aggregation with Reduce
// ============================================================================

/*
Create a Transaction interface with: id (number), type ("income" | "expense"), amount (number), category (string)

Task:
1. Use reduce to group transactions by category
2. Each category should track total income and expense separately
3. Calculate net balance (income - expense) for each
4. Sort by net balance (highest first)
5. Filter out categories with zero balance

Example:
  Input: [
    { id: 1, type: "income", amount: 5000, category: "salary" },
    { id: 2, type: "expense", amount: 500, category: "food" },
    ...
  ]
  Output: [
    { category: "salary", income: 5000, expense: 0, net: 5000 },
    { category: "food", income: 0, expense: 500, net: -500 },
    ...
  ]
  
Hints:
- Use reduce with accumulator: Record<string, { income, expense }>
- Calculate net balance during map phase
- Filter net !== 0 before sorting
- Sort by net balance descending
*/

// TODO: Implement function summarizeTransactions
// function summarizeTransactions(transactions: Transaction[]): TransactionSummary[] {
//   return transactions
//     .reduce(/* group by category */, {})
//     .map(/* convert to summary with net */)
//     .filter(/* remove zero balance */)
//     .sort(/* by net descending */);
// }

// ============================================================================
// EXERCISE 5: Lazy Stream Processing
// ============================================================================

/*
Task: Implement lazy evaluation for large datasets using generators

1. Create a function* lazyFilter that yields items matching predicate
2. Create a function* lazyMap that yields transformed items
3. Create a function* lazyTake(n) that limits to first n items
4. Process a large array without loading all results into memory

Example:
  const data = Array.from({ length: 1000000 }, ...);
  const result = lazyTake(
    lazyMap(
      lazyFilter(data, x => x > 500),
      x => x * 2
    ),
    10
  );
  for (const value of result) { console.log(value); } // Only processes 10 items!
  
Hints:
- Generators use function* and yield keywords
- Each generator pulls from previous generator lazily
- Use for...of to consume generators
- Test with large array to show memory efficiency
- Compare with eager evaluation timing
*/

// TODO: Implement lazy generators
// function* lazyFilter<T>(arr: T[], predicate: (x: T) => boolean): Generator<T> {
//   for (const item of arr) {
//     if (predicate(item)) yield item;
//   }
// }

// function* lazyMap<T, U>(arr: Iterable<T>, transform: (x: T) => U): Generator<U> {
//   for (const item of arr) {
//     yield transform(item);
//   }
// }

// function* lazyTake<T>(arr: Iterable<T>, n: number): Generator<T> {
//   let count = 0;
//   for (const item of arr) {
//     if (count++ >= n) break;
//     yield item;
//   }
// }

// ============================================================================
// EXERCISE 6: Immutable Data Structure Updates
// ============================================================================

/*
Create a TodoList interface with: todos (Todo[]), filters (string[])

Task:
1. Implement addTodo(list, todo): returns new TodoList without mutating original
2. Implement removeTodo(list, id): returns new TodoList without mutating original
3. Implement updateTodo(list, id, updates): returns new TodoList without mutating original
4. Implement filterTodos(list, filterTag): returns filtered copy without mutating original
5. Verify original list is never mutated

Example:
  const list1 = { todos: [{id: 1, text: "..."}, ...], filters: [] };
  const list2 = addTodo(list1, { id: 2, text: "New todo" });
  console.log(list1.todos.length); // Still 1
  console.log(list2.todos.length); // Now 2
  
Hints:
- Use spread operator [...array] to create copies
- Use map/filter for immutable updates
- Return new objects instead of mutating
- Challenge: implement efficient deep cloning
*/

// TODO: Implement immutable todo list operations
// function addTodo(list: TodoList, todo: Todo): TodoList {
//   return { ...list, todos: [...list.todos, todo] };
// }

// function removeTodo(list: TodoList, id: number): TodoList {
//   return { ...list, todos: list.todos.filter(t => t.id !== id) };
// }

// function updateTodo(list: TodoList, id: number, updates: Partial<Todo>): TodoList {
//   return {
//     ...list,
//     todos: list.todos.map(t => t.id === id ? { ...t, ...updates } : t)
//   };
// }

// ============================================================================
// EXERCISE 7: Conditional Mapping & Type Narrowing
// ============================================================================

/*
Create a ApiResponse type that is a discriminated union:
  | { status: "success"; data: T }
  | { status: "loading" }
  | { status: "error"; message: string }

Task:
1. Create a function extractData<T>(responses: ApiResponse<T>[]): T[]
2. Use type guards to safely extract only successful data
3. Return array of data values (not responses)
4. Type-safely handle union without any

Example:
  Input: [
    { status: "success", data: { id: 1, name: "Alice" } },
    { status: "loading" },
    { status: "success", data: { id: 2, name: "Bob" } },
    { status: "error", message: "Network error" }
  ]
  Output: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
  
Hints:
- Create type guard: (r): r is ApiResponse<T> & { status: "success" } => r.status === "success"
- Filter using type guard
- Map to .data property
- Type system ensures you can't access .data on other statuses
*/

// TODO: Implement type-safe data extraction
// function extractData<T>(responses: ApiResponse<T>[]): T[] {
//   return responses
//     .filter((r): r is SuccessResponse<T> => r.status === "success")
//     .map(r => r.data);
// }

// ============================================================================
// EXERCISE 8: Sorting Objects with Nested Properties
// ============================================================================

/*
Create interfaces:
  interface Author { id: number; name: string; joinDate: Date }
  interface Book { id: number; title: string; author: Author; rating: number }

Task:
1. Sort books by author name (accessing nested property)
2. Sort books by author joinDate (ascending, oldest first)
3. Build a compareByNested<T, K>(path: (t: T) => K) for nested sorting
4. Handle Date comparisons properly

Example:
  Input: Books with various authors and dates
  Output: Books sorted by author properties
  
Hints:
- Nested comparison: (a, b) => a.author.name.localeCompare(b.author.name)
- Date comparison: new Date(a) - new Date(b) works for Date objects
- localeCompare for string sorting (handles unicode)
- Build reusable comparator for complex nested structures
*/

// TODO: Implement nested property sorting
// function compareByNested<T, K extends Comparable>(
//   keyExtractor: (t: T) => K
// ): (a: T, b: T) => number {
//   return (a, b) => {
//     const aVal = keyExtractor(a);
//     const bVal = keyExtractor(b);
//     // Handle different types appropriately
//     if (typeof aVal === "string") return (aVal as any).localeCompare(bVal);
//     return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
//   };
// }

// ============================================================================
// Test your solutions below
// ============================================================================

function testExercises() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("      LESSON 34: Functional Array Methods - TESTS");
  console.log("═══════════════════════════════════════════════════════════\n");

  // TODO: Add test cases for each exercise
  // Test Exercise 1: Product filtering
  // Test Exercise 2: User email pipeline
  // Test Exercise 3: Comparators
  // Test Exercise 4: Transaction aggregation
  // Test Exercise 5: Lazy evaluation
  // Test Exercise 6: Immutable updates
  // Test Exercise 7: Type-safe data extraction
  // Test Exercise 8: Nested sorting

  console.log("✓ All tests passed!");
}

// Uncomment to run tests
// testExercises();
