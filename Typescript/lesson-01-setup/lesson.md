# Lesson 01: Setup and Tooling

## Goals
- Install and run the TypeScript compiler and ts-node.
- Understand the role of `tsconfig.json` and key options.
- Add linting/formatting for a clean dev loop.

## Core steps
1. Install: `npm install -D typescript ts-node @types/node`
2. Initialize: `npx tsc --init`
3. Add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "build": "tsc --noEmit",
       "start": "ts-node src/index.ts"
     }
   }
   ```
4. Install lint/format (optional now, required later): `npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier`

## Key tsconfig options
- `target`: JS version emitted. Use `ES2020`+ for async/iterators.
- `module`: `ESNext` for ESM projects, `CommonJS` if your runtime requires it.
- `moduleResolution`: `node` or `bundler` (for Vite/Next). Keep consistent with tooling.
- `strict`: Turn it on. Enables `noImplicitAny`, `strictNullChecks`, and more.
- `esModuleInterop`: Eases `import default` from CommonJS packages.
- `skipLibCheck`: Speeds builds; keep true unless debugging types.
- `paths` + `baseUrl`: Define import aliases (covered in lesson 05).
- `noUncheckedIndexedAccess`: Treat array/object indexing as possibly undefined—great for safety.

Example `tsconfig.json` baseline:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

## Dev loop tips
- Run `npm run build` often; fix type errors before runtime errors.
- Keep VS Code TypeScript version aligned: run `Ctrl+Shift+P` → `TypeScript: Select TypeScript Version` → `Use Workspace Version`.
- Enable `"editor.codeActionsOnSave": { "source.fixAll": true }` for quick lint fixes.

## Exercises
- Initialize a new project with the config above.
- Toggle `strict` off, note what new errors disappear, then turn it back on.
- Add a `src/index.ts` that logs `process.version`; run with `npx ts-node src/index.ts`.
