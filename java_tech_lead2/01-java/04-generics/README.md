# Generics in Java

This section covers Java Generics with comprehensive examples and explanations.

## Examples Included

### Prompt 101: Generic Classes and Methods
- **File**: `Example_Prompt101_GenericBasics.java`
- **Topics**: Generic classes, methods, type parameters, type safety

### Prompt 102: Wildcards and Bounded Types  
- **File**: `Example_Prompt102_Wildcards.java`
- **Topics**: Upper bounds, lower bounds, PECS principle

### Prompt 103: Type Erasure and Runtime Behavior
- **File**: `Example_Prompt103_TypeErasure.java`
- **Topics**: Type erasure, bridge methods, runtime implications

## Compilation and Execution

```powershell
# Navigate to the generics directory
cd d:\GitHub_Src\Interview\java_tech_lead2\01-java\04-generics

# Compile all examples
javac *.java

# Run individual examples
java Example_Prompt101_GenericBasics
java Example_Prompt102_Wildcards  
java Example_Prompt103_TypeErasure
```

## Key Concepts Covered

- **Type Safety**: Compile-time type checking
- **Generic Classes**: Parameterized types for reusable code
- **Generic Methods**: Type parameters in method signatures
- **Wildcards**: `?`, `? extends T`, `? super T`
- **PECS**: Producer Extends, Consumer Super principle
- **Type Erasure**: How generics work at runtime
- **Bridge Methods**: Compiler-generated methods for compatibility