// Example 1: Basic tsconfig.json setup
// This demonstrates the recommended configuration for TypeScript projects

const tsconfig = {
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
};

// Example 2: Working with strict mode
// In strict mode, these errors would be caught

// ❌ Error in strict mode: Object is possibly 'undefined'
// const user = undefined;
// console.log(user.name); // Type error!

// ✅ In strict mode, we must check:
const user: { name: string } | undefined = undefined;
if (user) {
  console.log(user.name);
}

// Example 3: Enabling noUncheckedIndexedAccess
// This catches potentially undefined array accesses

const items: string[] = ["a", "b", "c"];
// const first = items[0]; // Inferred as string | undefined
// const nonExistent = items[10]; // Also undefined

// ✅ Correct handling:
const first: string | undefined = items[0];
if (first) {
  console.log(first.toUpperCase());
}

// Example 4: Type inference with strict enabled
// Inferred types become more precise

const count = 0; // Inferred as number
const message = "hello"; // Inferred as string
const flag = true; // Inferred as boolean

function add(a: number, b: number): number {
  return a + b;
}

// ❌ This would error in strict mode:
// const result = add("1", "2"); // Type error

// ✅ Correct usage:
const result = add(1, 2); // ✓ OK

export { add, result };
