# Lesson 14: Type-Level Programming

## Objective
Master advanced type-level computation, recursive types, and type manipulation techniques to create sophisticated type-safe APIs.

## Topics Covered

### 1. Type-Level Arithmetic
- Increment/Decrement types using tuple length
- Range types and numeric literal iteration
- Bounded numbers for safe operations

### 2. String Manipulation at Type Level
- Path parsing: `"user.profile.name"` → `["user", "profile", "name"]`
- Snake/Camel case conversion
- URL parameter extraction

### 3. Recursive Type Construction
- Deep traversal with conditional types
- Recursive Pick/Omit with dot notation
- Type-safe object path validation

### 4. Parser Combinators
- Building validators that return precise types
- Composable parsers with type inference
- Error accumulation with branded types

### 5. Advanced `infer` Patterns
- Inferring function parameter names
- Extracting promise types recursively
- Pattern matching with conditional types

### 6. Type-Level State Machines
- Modeling valid state transitions in types
- Type-enforced workflows
- Compile-time protocol validation

## Learning Outcomes
- Implement recursive types that traverse complex structures
- Build parser combinators with full type inference
- Create type-safe DSLs and fluent APIs
- Use type-level computation for validation

## Key Concepts

### Type-Level Lists
```typescript
type Length<T extends readonly any[]> = T["length"];
type Push<T extends readonly any[], U> = readonly [...T, U];
type Pop<T extends readonly any[]> = T extends readonly [...infer Rest, any]
  ? Rest
  : T;
```

### Recursive Type Examples
```typescript
type PathOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? PathOf<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

type User = {
  id: number;
  profile: {
    name: string;
    address: { city: string };
  };
};
// PathOf<User> = "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city"
```

### Advanced Infer Patterns
```typescript
type UnwrapPromise<T> = T extends Promise<infer U>
  ? UnwrapPromise<U>
  : T;

type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${infer _Start}:${infer Param}`
    ? Param
    : never;

// ExtractRouteParams<"/users/:id/posts/:postId"> = "id" | "postId"
```

## Hands-On Examples

### Example 1: Type-Safe JSON Schema Validator
```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

type Schema<T> = T extends string
  ? { type: "string" }
  : T extends number
  ? { type: "number" }
  : T extends boolean
  ? { type: "boolean" }
  : T extends null
  ? { type: "null" }
  : T extends (infer U)[]
  ? { type: "array"; items: Schema<U> }
  : T extends object
  ? { type: "object"; properties: { [K in keyof T]: Schema<T[K]> } }
  : never;
```

### Example 2: Type-Safe SQL Query Builder
```typescript
type Column<T, K extends keyof T> = {
  table: T;
  name: K;
  type: T[K];
};

type Select<T, Cols extends readonly (keyof T)[]> = Pick<T, Cols[number]>;
```

## Practice Challenges

1. **Increment Type**: Implement `Inc<N>` that increments a numeric literal type
2. **Deep Partial**: Create `DeepPartial<T>` that makes all nested properties optional
3. **Tuple to Object**: Convert `["a", "b", "c"]` → `{a: "a", b: "b", c: "c"}`
4. **Type-Safe Path Get**: `Get<User, "profile.name">` returns `string`
5. **State Machine**: Model a traffic light with valid transitions only

## Additional Resources
- [TypeScript 5.x Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
- [Type Challenges Repository](https://github.com/type-challenges/type-challenges)
- [Advanced TypeScript Patterns](https://kentcdodds.com/blog/advanced-typescript)

## Next Steps
Complete the exercises in `exercises/starter.ts` and compare with `solution/index.ts`. These patterns enable you to build type-safe libraries with excellent developer experience.
