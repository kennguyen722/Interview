// Solution 1: String utilities module
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text: string, length: number, suffix: string = "..."): string {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
}

// Solution 2: Library entry point (src/index.ts for tsup)
// Re-export all utilities
export { slugify, capitalize, truncate };

// Solution 3: tsup.config.ts content
const tsupConfig = {
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
};

// Solution 4: package.json configuration
const packageJson = {
  "name": "string-utils",
  "version": "1.0.0",
  "description": "Utility functions for string manipulation",
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
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "^7.0.0"
  }
};

// Solution 5: tsconfig.json with path aliases
const tsconfig = {
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "baseUrl": "./src",
    "paths": {
      "@utils/*": ["utils/*"],
      "@domain/*": ["domain/*"]
    },
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["src"]
};

// Solution 6: Usage with path aliases
// In another file (e.g., src/app.ts):
// import { slugify } from "@utils/string";
// import { User } from "@domain/user";

export { slugify, capitalize, truncate };
