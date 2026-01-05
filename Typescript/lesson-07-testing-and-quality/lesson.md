# Lesson 07: Testing and Quality

## Goals
- Configure Jest or Vitest for TypeScript.
- Write type-level tests to guard contracts.
- Add runtime validation for untrusted data.

## Tooling setups
### Vitest (lightweight)
```
npm i -D vitest @vitest/coverage-v8 @types/node ts-node
```
Add script: `"test": "vitest"`.

### Jest (classic)
```
npm i -D jest ts-jest @types/jest
npx ts-jest config:init
```

## Example test (Vitest)
```ts
// src/math.test.ts
import { describe, it, expect } from "vitest";
import { add } from "./math";

describe("add", () => {
  it("adds numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

## Type-level assertions
Use `expectTypeOf` (Vitest) or `tsd` to assert inferred types.
```ts
import { expectTypeOf } from "vitest";
const user = { id: "1", name: "Ada" } as const;
expectTypeOf(user.id).toEqualTypeOf<string>();
```

## Runtime validation
Use zod or io-ts to validate external data.
```ts
import { z } from "zod";
const User = z.object({ id: z.string(), name: z.string(), email: z.string().email().optional() });
type User = z.infer<typeof User>;
```

## Linting
- Extend `eslint:recommended` and `plugin:@typescript-eslint/recommended`.
- Disable rules you disagree with intentionally; keep `no-explicit-any` mostly on.

## Exercises
- Add Vitest to your project and test a `sum` function.
- Add `expectTypeOf` checks to ensure a function returning `{ id, name }` infers literal `id` when given `as const` input.
- Validate a mocked API response with zod and ensure parsing fails when an email is invalid.
