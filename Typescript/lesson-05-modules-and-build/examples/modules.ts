// Example 1: ES Module exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

export interface MathConfig {
  precision: number;
  rounding: "round" | "floor" | "ceil";
}

// Default export
export default function multiply(a: number, b: number): number {
  return a * b;
}

// Example 2: Named exports and re-exports
export { Queue } from "./queue";
export type { Repository } from "./repository";

// Example 3: tsconfig paths configuration example
// tsconfig.json would have:
// {
//   "compilerOptions": {
//     "baseUrl": "./src",
//     "paths": {
//       "@utils/*": ["utils/*"],
//       "@domain/*": ["domain/*"],
//       "@lib/*": ["lib/*"]
//     }
//   }
// }

// Then you can import like:
// import { formatUser } from "@utils/formatters";
// import { User } from "@domain/user";

// Example 4: Module declaration merging
declare module "@lib/config" {
  interface Config {
    debug?: boolean;
  }
}

// Example 5: tsup configuration example (in tsup.config.ts)
const tsupConfig = {
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: true,
};

// Example 6: Conditional exports (package.json)
const packageJsonExample = {
  "name": "my-lib",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts"
};

export { add, subtract, PI };
