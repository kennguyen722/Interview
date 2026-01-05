# Lesson 11: Migration and Interview Prep

## Goals
- Migrate JavaScript codebases incrementally.
- Avoid common pitfalls and smell checks.
- Prepare for TypeScript interview questions.

## Gradual migration plan
1. Add `tsconfig.json` with `allowJs: true`, `checkJs: true` to type-check JS files.
2. Rename leaf files to `.ts`/`.tsx` incrementally.
3. Enable `strict` and fix surfaced issues steadily.
4. Replace `any` with precise types; consider `unknown` + guards.
5. Add runtime validation at boundaries (APIs, env vars).

## Pitfalls and smells
- Overusing `any`/`as` casts—treat as temporary.
- Wide types like `object` or `{}` that hide missing fields.
- Forgetting to type async errors (`catch (err: unknown)`).
- Mixing ESM/CJS incorrectly—align `module` and `type` in `package.json`.
- Not exporting types from shared modules (leads to duplication).

## Refactoring patterns
- Extract type aliases for repeated shapes.
- Use utility types to avoid manual remapping.
- Introduce branded types for IDs to avoid cross-wiring.

## Interview question sampler
- Explain structural typing vs nominal typing in TypeScript.
- How do `unknown`, `any`, `never`, and `void` differ?
- Describe control-flow narrowing and how discriminated unions enable exhaustiveness.
- How to type a function that accepts a key of an object and returns its value?
- When would you use `as const`? What does it change?
- How do you type `Promise.all` results? What about `Promise.allSettled`?
- How to make a React `useFetch` hook strongly typed?

## Exercises
- Convert a small JS module to TS using `allowJs` first, then renaming to `.ts`.
- Find three places to replace `any` with specific unions or generics.
- Write bullet answers to the interview questions above; time-box to 20 minutes.
