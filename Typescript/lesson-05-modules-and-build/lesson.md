# Lesson 05: Modules, Paths, and Build Tooling

## Goals
- Use ES modules with TypeScript in Node and browsers.
- Configure path aliases with `baseUrl` and `paths`.
- Understand common build tools.

## Module systems
- Prefer ES modules (`"module": "ESNext"`) with `type": "module"` in `package.json`.
- For older Node setups, use `"module": "CommonJS"` or transpile with bundlers.

### Import/export patterns
```ts
export function add(a: number, b: number) { return a + b; }
export const PI = 3.14;
export default function log(msg: string) { console.log(msg); }
```

## Path aliases
In `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@domain/*": ["domain/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```
Use with bundlers that respect TS paths (ts-node, ts-jest, Vite). For Node without bundler, add a resolver (tsconfig-paths) or avoid aliases.

## Build tools quick tour
- **ts-node**: runs TS directly; good for dev and scripts.
- **esbuild / swc**: fast transpilers; pair with `tsc --noEmit` for typechecking.
- **Vite**: modern web dev server with TS and React/Vue integrations.
- **Webpack / Rollup**: mature bundlers; more config heavy.
- **tsup**: minimal bundler for libraries/CLIs.

## Emitting declaration files (for libraries)
- Set `declaration: true`, `declarationMap: true`, and `outDir: dist`.
- Keep `stripInternal` for hiding internal APIs.

## Example: simple tsup config
```ts
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
```

## Exercises
- Add a `paths` alias `@utils/*` to your project and import a helper through it.
- Build a small library with `tsup` that exports a `slugify` function and declaration files.
- Switch your project between ESM and CJS by adjusting `tsconfig` and `package.json` and observe import syntax changes.
