# Exception Handling in Java

This section covers comprehensive exception handling in Java with practical examples.

## Examples Included

### Prompt 201: Exception Hierarchy and Custom Exceptions
- **File**: `Example_Prompt201_ExceptionHierarchy.java`
- **Topics**: Exception types, custom exceptions, best practices

### Prompt 202: Try-with-resources and Resource Management
- **File**: `Example_Prompt202_ResourceManagement.java`
- **Topics**: AutoCloseable, try-with-resources, resource leaks

### Prompt 203: Exception Handling Patterns and Best Practices
- **File**: `Example_Prompt203_ExceptionPatterns.java`
- **Topics**: Exception translation, chaining, logging, recovery strategies

## Compilation and Execution

```powershell
# Navigate to the exceptions directory
cd d:\GitHub_Src\Interview\java_tech_lead2\01-java\06-exceptions

# Compile all examples
javac *.java

# Run individual examples
java Example_Prompt201_ExceptionHierarchy
java Example_Prompt202_ResourceManagement
java Example_Prompt203_ExceptionPatterns
```

## Key Concepts Covered

- **Exception Hierarchy**: Checked vs unchecked exceptions
- **Custom Exceptions**: When and how to create them
- **Try-with-resources**: Automatic resource management
- **Exception Translation**: Converting exceptions at architectural boundaries
- **Exception Chaining**: Preserving stack traces
- **Best Practices**: Logging, recovery, fail-fast principles