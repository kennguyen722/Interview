// Example 1: Generics with constraints
function first<T>(items: T[]): T | undefined {
  return items[0];
}

function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

// Example 2: Generic constraints with extends
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: "1", name: "Ada", email: "ada@example.com" };
const userId = getProperty(user, "id"); // Type: string
// getProperty(user, "invalid"); // ❌ Error: "invalid" is not a key of user

// Example 3: Mapped types
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>; // { readonly name: string; readonly age: number }
type OptionalUser = Optional<User>; // { name?: string; age?: number }
type UserGetters = Getters<User>; // { getName: () => string; getAge: () => number }

// Example 4: Indexed access types
type UserKeys = keyof User; // "name" | "age"
type UserName = User["name"]; // string
type UserAge = User["age"]; // number

// Example 5: Conditional types
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<42>; // false

type Awaited<T> = T extends Promise<infer U> ? U : T;
type C = Awaited<Promise<string>>; // string
type D = Awaited<number>; // number

// Example 6: Utility types
interface Post {
  id: string;
  title: string;
  body: string;
  published: boolean;
}

type PostPreview = Pick<Post, "id" | "title">; // { id: string; title: string }
type PostEdit = Omit<Post, "id">; // { title: string; body: string; published: boolean }
type PartialPost = Partial<Post>; // All properties optional
type RequiredPost = Required<Post>; // All properties required

type PostStatus = Record<"draft" | "published" | "archived", string>; // Map specific keys

// Example 7: Extract and Exclude
type Status = "idle" | "loading" | "success" | "error";
type SuccessStatus = Extract<Status, "success">; // "success"
type NonIdleStatus = Exclude<Status, "idle">; // "loading" | "success" | "error"

// Example 8: ReturnType and Parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

type GreetReturn = ReturnType<typeof greet>; // string
type GreetParams = Parameters<typeof greet>; // [name: string, greeting?: string]

export { first, last, getProperty, User, Post };
