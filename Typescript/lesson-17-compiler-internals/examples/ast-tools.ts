import * as ts from "typescript";

// Example 1: AST Explorer - Print AST structure with indentation
function printAST(sourceFile: ts.SourceFile): void {
  function visit(node: ts.Node, depth = 0): void {
    const indent = "  ".repeat(depth);
    const kind = ts.SyntaxKind[node.kind];
    const text = node.getText(sourceFile).split("\n")[0].slice(0, 40);
    console.log(`${indent}${kind}: ${text}`);
    ts.forEachChild(node, (child) => visit(child, depth + 1));
  }

  visit(sourceFile);
}

// Example 2: Function Counter - Count all function declarations
function countFunctions(sourceFile: ts.SourceFile): number {
  let count = 0;

  function visit(node: ts.Node): void {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node)
    ) {
      count++;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return count;
}

// Example 3: Import Extractor - Extract all imports
interface ImportInfo {
  moduleName: string;
  isDefault: boolean;
  namedImports: string[];
  namespace?: string;
}

function extractImports(sourceFile: ts.SourceFile): ImportInfo[] {
  const imports: ImportInfo[] = [];

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        const info: ImportInfo = {
          moduleName: moduleSpecifier.text,
          isDefault: false,
          namedImports: [],
        };

        if (node.importClause) {
          // Default import
          if (node.importClause.name) {
            info.isDefault = true;
          }

          // Named imports
          const namedBindings = node.importClause.namedBindings;
          if (namedBindings) {
            if (ts.isNamedImports(namedBindings)) {
              info.namedImports = namedBindings.elements.map((el) => el.name.text);
            } else if (ts.isNamespaceImport(namedBindings)) {
              info.namespace = namedBindings.name.text;
            }
          }
        }

        imports.push(info);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}

// Example 4: Type Annotation Finder - Find all type annotations
interface TypeAnnotationInfo {
  name: string;
  type: string;
  kind: "variable" | "parameter" | "property" | "function-return";
}

function findTypeAnnotations(sourceFile: ts.SourceFile): TypeAnnotationInfo[] {
  const annotations: TypeAnnotationInfo[] = [];

  function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && node.type) {
      annotations.push({
        name: node.name.getText(sourceFile),
        type: node.type.getText(sourceFile),
        kind: "variable",
      });
    }

    if (ts.isParameter(node) && node.type) {
      annotations.push({
        name: node.name.getText(sourceFile),
        type: node.type.getText(sourceFile),
        kind: "parameter",
      });
    }

    if (ts.isPropertyDeclaration(node) && node.type) {
      annotations.push({
        name: node.name.getText(sourceFile),
        type: node.type.getText(sourceFile),
        kind: "property",
      });
    }

    if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) && node.type) {
      const name = node.name ? node.name.getText(sourceFile) : "(anonymous)";
      annotations.push({
        name,
        type: node.type.getText(sourceFile),
        kind: "function-return",
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return annotations;
}

// Example 5: Simple Transformer - Add console.log to function entries
const logInjectorTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isFunctionDeclaration(node) && node.name && node.body) {
        const functionName = node.name.text;
        const logStatement = ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("console"),
              "log"
            ),
            undefined,
            [ts.factory.createStringLiteral(`Entering function: ${functionName}`)]
          )
        );

        const newBody = ts.factory.updateBlock(node.body, [
          logStatement,
          ...node.body.statements,
        ]);

        return ts.factory.updateFunctionDeclaration(
          node,
          node.modifiers,
          node.asteriskToken,
          node.name,
          node.typeParameters,
          node.parameters,
          node.type,
          newBody
        );
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
  };
};

// Example 6: Complexity Calculator - Cyclomatic Complexity
function calculateComplexity(node: ts.Node): number {
  let complexity = 1; // Base complexity

  function visit(n: ts.Node): void {
    // Branch points increase complexity
    if (
      ts.isIfStatement(n) ||
      ts.isConditionalExpression(n) ||
      ts.isWhileStatement(n) ||
      ts.isDoStatement(n) ||
      ts.isForStatement(n) ||
      ts.isForInStatement(n) ||
      ts.isForOfStatement(n) ||
      ts.isCaseClause(n) ||
      ts.isCatchClause(n) ||
      (ts.isBinaryExpression(n) &&
        (n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
          n.operatorToken.kind === ts.SyntaxKind.BarBarToken))
    ) {
      complexity++;
    }

    ts.forEachChild(n, visit);
  }

  visit(node);
  return complexity;
}

// Example 7: Unused Variable Detector
function findUnusedVariables(sourceFile: ts.SourceFile, program: ts.Program): string[] {
  const typeChecker = program.getTypeChecker();
  const unused: string[] = [];

  function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const symbol = typeChecker.getSymbolAtLocation(node.name);
      if (symbol) {
        const declarations = symbol.getDeclarations();
        if (declarations && declarations.length === 1) {
          // Simple heuristic: if only one declaration and no references, it's unused
          // (Real implementation would check references properly)
          unused.push(node.name.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return unused;
}

// Example 8: Code Generator - Create type-safe API client
function generateAPIClient(endpoints: Array<{ name: string; path: string; method: string }>) {
  const statements: ts.Statement[] = [];

  // Create class declaration
  const methods = endpoints.map((endpoint) => {
    const methodName = ts.factory.createIdentifier(endpoint.name);
    const returnType = ts.factory.createTypeReferenceNode("Promise", [
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
    ]);

    const body = ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(ts.factory.createIdentifier("fetch"), undefined, [
          ts.factory.createStringLiteral(endpoint.path),
        ])
      ),
    ]);

    return ts.factory.createMethodDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
      undefined,
      methodName,
      undefined,
      undefined,
      [],
      returnType,
      body
    );
  });

  const classDeclaration = ts.factory.createClassDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    "APIClient",
    undefined,
    undefined,
    methods
  );

  statements.push(classDeclaration);

  // Create source file
  const resultFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  // Print to string
  const printer = ts.createPrinter();
  return printer.printFile(resultFile);
}

// Example 9: Type Checker Usage - Get type information
function analyzeTypes(sourceFile: ts.SourceFile, program: ts.Program): void {
  const typeChecker = program.getTypeChecker();

  function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node)) {
      const type = typeChecker.getTypeAtLocation(node);
      const typeString = typeChecker.typeToString(type);
      const name = node.name.getText(sourceFile);
      console.log(`Variable ${name} has type: ${typeString}`);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

// Demo usage
const code = `
import { useState } from 'react';

interface User {
  id: number;
  name: string;
}

function greet(name: string): string {
  if (name) {
    return "Hello " + name;
  }
  return "Hello";
}

const users: User[] = [];
`;

// Create source file
const sourceFile = ts.createSourceFile("demo.ts", code, ts.ScriptTarget.ES2020, true);

console.log("=== AST Structure ===");
printAST(sourceFile);

console.log("\n=== Function Count ===");
console.log(`Functions: ${countFunctions(sourceFile)}`);

console.log("\n=== Imports ===");
console.log(extractImports(sourceFile));

console.log("\n=== Type Annotations ===");
console.log(findTypeAnnotations(sourceFile));

console.log("\n=== Generated API Client ===");
const apiClient = generateAPIClient([
  { name: "getUsers", path: "/api/users", method: "GET" },
  { name: "createUser", path: "/api/users", method: "POST" },
]);
console.log(apiClient);

export {
  printAST,
  countFunctions,
  extractImports,
  findTypeAnnotations,
  logInjectorTransformer,
  calculateComplexity,
  findUnusedVariables,
  generateAPIClient,
  analyzeTypes,
};
