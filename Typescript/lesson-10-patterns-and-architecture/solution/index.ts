// Solution 1: assertNever and exhaustive checking
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}

type Status = "idle" | "loading" | "success" | "error";

function renderStatus(status: Status): string {
  switch (status) {
    case "idle":
      return "Ready";
    case "loading":
      return "Processing...";
    case "success":
      return "Success!";
    case "error":
      return "Error occurred";
    default:
      return assertNever(status); // Type-safe: won't compile if missing case
  }
}

// Solution 2: Cache interface and in-memory implementation
interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  delete(key: K): boolean;
  has(key: K): boolean;
  clear(): void;
}

class MemoryCache<K, V> implements Cache<K, V> {
  private store = new Map<K, V>();

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// Test MemoryCache
const cache = new MemoryCache<string, number>();
cache.set("count", 1);
console.log(cache.get("count")); // 1
cache.delete("count");
console.log(cache.get("count")); // undefined

// Solution 3: Order state machine
type OrderStatus = "created" | "paid" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
}

// Define valid transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  created: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function canTransition(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
  return validTransitions[fromStatus].includes(toStatus);
}

function transition(order: Order, newStatus: OrderStatus): Order {
  if (!canTransition(order.status, newStatus)) {
    throw new Error(
      `Cannot transition from ${order.status} to ${newStatus}`
    );
  }
  return { ...order, status: newStatus };
}

// Test Order transitions
const order: Order = { id: "123", status: "created", total: 99.99 };

try {
  let updated = transition(order, "paid");
  console.log(`Order transitioned to: ${updated.status}`); // paid

  updated = transition(updated, "shipped");
  console.log(`Order transitioned to: ${updated.status}`); // shipped

  updated = transition(updated, "delivered");
  console.log(`Order transitioned to: ${updated.status}`); // delivered

  // This will throw
  updated = transition(updated, "shipped"); // ❌ Error
} catch (err) {
  console.error((err as Error).message);
}

export { assertNever, renderStatus, Cache, MemoryCache, OrderStatus, Order, transition, canTransition };
