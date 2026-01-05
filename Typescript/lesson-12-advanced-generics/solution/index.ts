// Solution 1: Type-safe Query Builder
interface QueryCondition<T> {
  field: keyof T;
  value: any;
}

class QueryBuilder<T> {
  private conditions: QueryCondition<T>[] = [];
  private orderField?: keyof T;
  private orderDirection?: "asc" | "desc";
  private limitCount?: number;

  constructor(private data: T[]) {}

  where<K extends keyof T>(field: K, value: T[K]): QueryBuilder<T> {
    this.conditions.push({ field, value });
    return this;
  }

  orderBy<K extends keyof T>(field: K, direction: "asc" | "desc" = "asc"): QueryBuilder<T> {
    this.orderField = field;
    this.orderDirection = direction;
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.limitCount = count;
    return this;
  }

  async execute(): Promise<T[]> {
    let result = [...this.data];

    // Apply filters
    result = result.filter((item) =>
      this.conditions.every((cond) => item[cond.field] === cond.value)
    );

    // Apply ordering
    if (this.orderField) {
      result.sort((a, b) => {
        const aVal = a[this.orderField!];
        const bVal = b[this.orderField!];
        const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.orderDirection === "desc" ? -compare : compare;
      });
    }

    // Apply limit
    if (this.limitCount !== undefined) {
      result = result.slice(0, this.limitCount);
    }

    return result;
  }
}

// Test QueryBuilder
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: "1", name: "Laptop", price: 999, category: "Electronics" },
  { id: "2", name: "Phone", price: 599, category: "Electronics" },
  { id: "3", name: "Desk", price: 299, category: "Furniture" },
];

const qb = new QueryBuilder(products);
const electronics = await qb
  .where("category", "Electronics")
  .orderBy("price", "desc")
  .limit(1)
  .execute();

console.log(electronics); // [{ id: "1", name: "Laptop", ... }]

// Solution 2: Curry type utility
type Curry<F> = F extends (arg: infer A, ...rest: infer R) => infer RT
  ? R extends []
    ? (arg: A) => RT
    : (arg: A) => Curry<(...args: R) => RT>
  : never;

function curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  } as Curry<F>;
}

// Test curry
function add(a: number, b: number, c: number): number {
  return a + b + c;
}

const curriedAdd = curry(add);
const result = curriedAdd(1)(2)(3); // 6
console.log(result);

// Solution 3: PathOf utility type
type PathOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: K extends string
        ? T[K] extends object
          ? `${Prefix}${K}` | PathOf<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T & string]
  : never;

interface User {
  id: string;
  profile: {
    name: string;
    address: {
      city: string;
      zipCode: string;
    };
  };
}

type UserPaths = PathOf<User>;
// "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city" | "profile.address.zipCode"

// Helper to get value at path
function getValueAtPath<T, P extends PathOf<T>>(obj: T, path: P): any {
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj);
}

const user: User = {
  id: "123",
  profile: {
    name: "Ada",
    address: {
      city: "London",
      zipCode: "SW1A 1AA",
    },
  },
};

const city = getValueAtPath(user, "profile.address.city"); // "London"

// Solution 4: Pipe with full type inference
type PipeFn = (arg: any) => any;

function pipe<A, B>(f1: (a: A) => B): (a: A) => B;
function pipe<A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C;
function pipe<A, B, C, D>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): (a: A) => D;
function pipe<A, B, C, D, E>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E
): (a: A) => E;
function pipe<A, B, C, D, E, F>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E,
  f5: (e: E) => F
): (a: A) => F;
function pipe(...fns: PipeFn[]): PipeFn {
  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Test pipe
const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const toStr = (x: number) => `Result: ${x}`;
const getLength = (s: string) => s.length;
const square = (n: number) => n * n;

const pipeline = pipe(addOne, double, toStr, getLength, square);
const finalResult = pipeline(5); // (5+1)*2 = "Result: 12" => length 10 => 100

console.log(finalResult); // 100

export { QueryBuilder, curry, PathOf, getValueAtPath, pipe };
