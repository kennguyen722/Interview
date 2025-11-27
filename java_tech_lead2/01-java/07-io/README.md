# File I/O and NIO.2 in Java

This section covers Java file I/O operations, NIO.2 Path API, and modern file handling.

## Examples Included

### Prompt 251: Traditional I/O vs NIO.2
- **File**: `Example_Prompt251_IOvsNIO2.java`
- **Topics**: File operations, Path API, performance comparison

### Prompt 252: File Processing Patterns
- **File**: `Example_Prompt252_FileProcessing.java`  
- **Topics**: Reading, writing, streaming large files, file watching

### Prompt 253: Serialization and Advanced I/O
- **File**: `Example_Prompt253_SerializationIO.java`
- **Topics**: Object serialization, custom serialization, performance

## Compilation and Execution

```powershell
# Navigate to the I/O directory
cd d:\GitHub_Src\Interview\java_tech_lead2\01-java\07-io

# Compile all examples
javac *.java

# Run individual examples  
java Example_Prompt251_IOvsNIO2
java Example_Prompt252_FileProcessing
java Example_Prompt253_SerializationIO
```

## Key Concepts Covered

- **Path API**: Modern file path handling with java.nio.file
- **File Operations**: Reading, writing, copying, moving files
- **Stream Processing**: Handling large files efficiently
- **File Watching**: Monitoring file system changes
- **Serialization**: Object persistence and custom serialization
- **Performance**: I/O optimization techniques