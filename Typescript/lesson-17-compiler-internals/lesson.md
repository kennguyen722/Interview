# Lesson 17: TypeScript Compiler Internals & AST Manipulation

## Objective
Master the TypeScript Compiler API, understand Abstract Syntax Trees (AST), and build custom transformers, code generation tools, and static analysis utilities.

## Topics Covered

### 1. TypeScript Compiler API Basics
- `ts.createProgram()` and program structure
- Source files, type checker, diagnostics
- Symbol tables and type information
- Node visitors and traversal patterns

### 2. Abstract Syntax Tree (AST)
- Understanding AST structure and node types
- SyntaxKind enumeration
- Node relationships (parent, children, siblings)
- Position information and source maps

### 3. Custom Transformers
- Transformer factory functions
- Context and transformation state
- Visiting and replacing nodes
- Before/After transformation hooks

### 4. Code Generation
- Using `ts.factory` to create nodes
- Building type-safe code generators
- Template-based code generation
- Emitting TypeScript or JavaScript

### 5. Static Analysis Tools
- Building linters and code quality tools
- Detecting patterns and anti-patterns
- Complexity analysis
- Dependency graph generation

### 6. Type Checking Programmatically
- Using the type checker API
- Resolving types from nodes
- Type relationships and assignability
- Generic instantiation

## Learning Outcomes
- Navigate and analyze TypeScript AST structures
- Build custom TypeScript transformers
- Create code generation tools
- Implement static analysis utilities
- Understand compiler internals for advanced debugging

## Key Concepts

### Creating a Program
```typescript
import * as ts from "typescript";

const program = ts.createProgram({
  rootNames: ["src/index.ts"],
  options: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
  },
});

const sourceFile = program.getSourceFile("src/index.ts");
const typeChecker = program.getTypeChecker();
```

### AST Traversal
```typescript
function visit(node: ts.Node): void {
  console.log(ts.SyntaxKind[node.kind], node.getText());
  ts.forEachChild(node, visit);
}

visit(sourceFile);
```

### Custom Transformer
```typescript
const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      // Transform logic here
      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(sourceFile, visitor);
  };
};
```

## Hands-On Examples

### Example 1: AST Explorer
Build a tool that prints the AST structure of TypeScript code with indentation.

### Example 2: Dead Code Elimination
Create a transformer that removes unused imports and variables.

### Example 3: API Client Generator
Generate type-safe API client code from OpenAPI specifications.

### Example 4: Dependency Analyzer
Build a tool that extracts module dependencies and creates a graph.

### Example 5: Performance Profiler Injector
Automatically inject performance monitoring code around functions.

## Practice Challenges

1. **Function Counter**: Count all function declarations in a project
2. **Type Extractor**: Extract all interface/type definitions to a separate file
3. **Import Organizer**: Sort and group imports by type (external, internal, relative)
4. **Null Safety Checker**: Find all places where non-null assertion (!) is used
5. **React Component Analyzer**: Extract props types from React components
6. **Barrel File Generator**: Auto-generate index.ts files with exports
7. **Documentation Generator**: Extract JSDoc comments and generate docs
8. **Complexity Calculator**: Compute cyclomatic complexity of functions

## Compiler Pipeline

```
Source Code (.ts)
      ↓
  Scanner (Lexical Analysis)
      ↓
  Parser (Syntax Analysis) → AST
      ↓
  Binder (Symbol Resolution)
      ↓
  Type Checker (Semantic Analysis)
      ↓
  Transformer (Optional Custom Transforms)
      ↓
  Emitter (Code Generation)
      ↓
Output (.js + .d.ts)
```

## Advanced Patterns

### Type-Safe Node Factories
```typescript
function createLogStatement(message: string): ts.Statement {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("console"),
        "log"
      ),
      undefined,
      [ts.factory.createStringLiteral(message)]
    )
  );
}
```

### Type Checker Usage
```typescript
function getTypeString(node: ts.Node, typeChecker: ts.TypeChecker): string {
  const type = typeChecker.getTypeAtLocation(node);
  return typeChecker.typeToString(type);
}
```

## Tools Built with Compiler API
- **ts-morph**: Simplified wrapper around compiler API
- **TypeDoc**: Documentation generator
- **ts-jest**: Jest transformer for TypeScript
- **ttypescript**: TypeScript with custom transformers
- **GraphQL Code Generator**: Type-safe GraphQL clients

## Resources
- [TypeScript Compiler API Docs](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [AST Explorer](https://ts-ast-viewer.com/)
- [ts-morph Library](https://ts-morph.com/)
- [TypeScript Deep Dive - Compiler](https://basarat.gitbook.io/typescript/overview)

## Next Steps
Complete the exercises in `exercises/starter.ts` to build practical compiler tools. Understanding the compiler internals will help you debug complex type issues and build sophisticated tooling.
