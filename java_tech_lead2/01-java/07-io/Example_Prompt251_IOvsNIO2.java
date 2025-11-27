/**
 * Prompt 251: Traditional I/O vs NIO.2 - Modern File Operations
 * 
 * Key Points:
 * - NIO.2 (Java 7+) provides better file handling than traditional I/O
 * - Path API offers platform-independent path operations
 * - Files class provides convenient static methods
 * - Better performance and functionality than File class
 * - Support for file attributes, permissions, and symbolic links
 */

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Stream;

public class Example_Prompt251_IOvsNIO2 {
    private static final String TEMP_DIR = "temp_io_demo";
    
    public static void main(String[] args) {
        System.out.println("=== Traditional I/O vs NIO.2 - Modern File Operations ===\n");
        
        try {
            // Setup demo directory
            setupDemoEnvironment();
            
            // 1. PATH API BASICS
            System.out.println("1. Path API Basics:");
            pathApiDemo();
            
            // 2. FILE OPERATIONS COMPARISON
            System.out.println("\n2. File Operations Comparison:");
            fileOperationsComparison();
            
            // 3. READING AND WRITING FILES
            System.out.println("\n3. Reading and Writing Files:");
            readWriteOperations();
            
            // 4. FILE ATTRIBUTES AND METADATA
            System.out.println("\n4. File Attributes and Metadata:");
            fileAttributesDemo();
            
            // 5. DIRECTORY OPERATIONS
            System.out.println("\n5. Directory Operations:");
            directoryOperations();
            
            // 6. PERFORMANCE COMPARISON
            System.out.println("\n6. Performance Comparison:");
            performanceComparison();
            
        } catch (IOException e) {
            System.err.println("I/O Error: " + e.getMessage());
        } finally {
            // Cleanup
            cleanup();
        }
    }
    
    private static void setupDemoEnvironment() throws IOException {
        Path tempDir = Paths.get(TEMP_DIR);
        if (Files.exists(tempDir)) {
            // Clean up existing directory
            try (Stream<Path> paths = Files.walk(tempDir)) {
                paths.sorted(Comparator.reverseOrder())
                     .forEach(path -> {
                         try {
                             Files.deleteIfExists(path);
                         } catch (IOException e) {
                             System.err.println("Failed to delete: " + path);
                         }
                     });
            }
        }
        Files.createDirectories(tempDir);
        System.out.println("Created demo environment: " + tempDir.toAbsolutePath());
    }
    
    private static void pathApiDemo() throws IOException {
        System.out.println("--- Path API Operations ---");
        
        // Creating paths
        Path path1 = Paths.get("temp_io_demo", "subdir", "file.txt");
        Path path2 = Paths.get("temp_io_demo/subdir/file.txt");
        Path path3 = Path.of("temp_io_demo", "subdir", "file.txt"); // Java 11+
        
        System.out.println("Path 1: " + path1);
        System.out.println("Path 2: " + path2);
        System.out.println("Path 3: " + path3);
        System.out.println("Paths equal: " + path1.equals(path2));
        
        // Path operations
        System.out.println("\n--- Path Components ---");
        System.out.println("Root: " + path1.getRoot());
        System.out.println("Parent: " + path1.getParent());
        System.out.println("Filename: " + path1.getFileName());
        System.out.println("Name count: " + path1.getNameCount());
        
        for (int i = 0; i < path1.getNameCount(); i++) {
            System.out.printf("Name[%d]: %s%n", i, path1.getName(i));
        }
        
        // Path manipulation
        System.out.println("\n--- Path Manipulation ---");
        Path base = Paths.get("temp_io_demo");
        Path resolved = base.resolve("subdir/file.txt");
        Path relativized = base.relativize(resolved);
        Path normalized = Paths.get("temp_io_demo/./subdir/../subdir/file.txt").normalize();
        
        System.out.println("Base: " + base);
        System.out.println("Resolved: " + resolved);
        System.out.println("Relativized: " + relativized);
        System.out.println("Normalized: " + normalized);
        
        // Absolute vs relative paths
        System.out.println("\n--- Absolute vs Relative ---");
        Path relativePath = Paths.get("temp_io_demo/file.txt");
        Path absolutePath = relativePath.toAbsolutePath();
        
        System.out.println("Relative: " + relativePath);
        System.out.println("Absolute: " + absolutePath);
        System.out.println("Is absolute: " + absolutePath.isAbsolute());
    }
    
    private static void fileOperationsComparison() throws IOException {
        System.out.println("--- Traditional File vs NIO.2 Files ---");
        
        String filename = "temp_io_demo/comparison_test.txt";
        
        // Traditional I/O approach
        long startTime = System.nanoTime();
        File oldFile = new File(filename);
        oldFile.getParentFile().mkdirs();
        boolean created1 = oldFile.createNewFile();
        boolean exists1 = oldFile.exists();
        boolean isFile1 = oldFile.isFile();
        long size1 = oldFile.length();
        boolean deleted1 = oldFile.delete();
        long traditionalTime = System.nanoTime() - startTime;
        
        // NIO.2 approach
        startTime = System.nanoTime();
        Path newPath = Paths.get(filename);
        Files.createDirectories(newPath.getParent());
        boolean created2 = Files.notExists(newPath);
        Files.createFile(newPath);
        boolean exists2 = Files.exists(newPath);
        boolean isFile2 = Files.isRegularFile(newPath);
        long size2 = Files.size(newPath);
        Files.deleteIfExists(newPath);
        long nio2Time = System.nanoTime() - startTime;
        
        System.out.printf("Traditional I/O: created=%b, exists=%b, isFile=%b, size=%d (%.2f ms)%n",
            created1, exists1, isFile1, size1, traditionalTime / 1_000_000.0);
        System.out.printf("NIO.2: created=%b, exists=%b, isFile=%b, size=%d (%.2f ms)%n",
            created2, exists2, isFile2, size2, nio2Time / 1_000_000.0);
        
        System.out.println("NIO.2 advantages:");
        System.out.println("- Better exception handling");
        System.out.println("- Atomic operations");
        System.out.println("- More file operations available");
        System.out.println("- Better performance for metadata operations");
    }
    
    private static void readWriteOperations() throws IOException {
        System.out.println("--- File Reading and Writing ---");
        
        Path textFile = Paths.get(TEMP_DIR, "sample.txt");
        Path binaryFile = Paths.get(TEMP_DIR, "sample.dat");
        
        // Writing text files
        List<String> lines = Arrays.asList(
            "Line 1: Hello World",
            "Line 2: Java NIO.2 Demo",
            "Line 3: File I/O Operations",
            "Line 4: Path API Examples"
        );
        
        // Write all lines at once
        Files.write(textFile, lines, StandardCharsets.UTF_8);
        System.out.println("Wrote " + lines.size() + " lines to: " + textFile);
        
        // Read all lines at once
        List<String> readLines = Files.readAllLines(textFile, StandardCharsets.UTF_8);
        System.out.println("Read " + readLines.size() + " lines:");
        readLines.forEach(line -> System.out.println("  " + line));
        
        // Streaming large files (memory efficient)
        System.out.println("\n--- Streaming File Operations ---");
        try (Stream<String> lineStream = Files.lines(textFile)) {
            long wordCount = lineStream
                .flatMap(line -> Arrays.stream(line.split("\\s+")))
                .count();
            System.out.println("Word count: " + wordCount);
        }
        
        // Binary file operations
        byte[] data = "Binary data example".getBytes(StandardCharsets.UTF_8);
        Files.write(binaryFile, data);
        byte[] readData = Files.readAllBytes(binaryFile);
        System.out.println("Binary file content: " + new String(readData, StandardCharsets.UTF_8));
        
        // Appending to files
        Files.write(textFile, Arrays.asList("Line 5: Appended line"), 
            StandardCharsets.UTF_8, StandardOpenOption.APPEND);
        System.out.println("Appended line to file");
        
        // Reading with BufferedReader (for large files)
        System.out.println("\n--- Buffered Reading ---");
        try (BufferedReader reader = Files.newBufferedReader(textFile, StandardCharsets.UTF_8)) {
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                System.out.printf("[%d] %s%n", lineNumber++, line);
            }
        }
    }
    
    private static void fileAttributesDemo() throws IOException {
        System.out.println("--- File Attributes and Metadata ---");
        
        Path file = Paths.get(TEMP_DIR, "attributes_test.txt");
        Files.write(file, "Test content for attributes".getBytes());
        
        // Basic attributes
        BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);
        System.out.println("File: " + file.getFileName());
        System.out.println("Size: " + attrs.size() + " bytes");
        System.out.println("Creation time: " + attrs.creationTime());
        System.out.println("Last modified: " + attrs.lastModifiedTime());
        System.out.println("Last accessed: " + attrs.lastAccessTime());
        System.out.println("Is directory: " + attrs.isDirectory());
        System.out.println("Is regular file: " + attrs.isRegularFile());
        System.out.println("Is symbolic link: " + attrs.isSymbolicLink());
        
        // File permissions (if supported)
        try {
            Set<PosixFilePermission> permissions = Files.getPosixFilePermissions(file);
            System.out.println("Permissions: " + PosixFilePermissions.toString(permissions));
        } catch (UnsupportedOperationException e) {
            System.out.println("POSIX permissions not supported on this system");
        }
        
        // Owner information
        try {
            UserPrincipal owner = Files.getOwner(file);
            System.out.println("Owner: " + owner.getName());
        } catch (Exception e) {
            System.out.println("Owner information not available");
        }
        
        // Modifying attributes
        FileTime newTime = FileTime.fromMillis(System.currentTimeMillis() - 86400000L); // 1 day ago
        Files.setLastModifiedTime(file, newTime);
        System.out.println("Updated last modified time");
        
        // File store information
        FileStore store = Files.getFileStore(file);
        System.out.println("\n--- File Store Information ---");
        System.out.println("File store: " + store.name());
        System.out.println("Type: " + store.type());
        System.out.printf("Total space: %.2f GB%n", store.getTotalSpace() / (1024.0 * 1024.0 * 1024.0));
        System.out.printf("Usable space: %.2f GB%n", store.getUsableSpace() / (1024.0 * 1024.0 * 1024.0));
    }
    
    private static void directoryOperations() throws IOException {
        System.out.println("--- Directory Operations ---");
        
        Path baseDir = Paths.get(TEMP_DIR);
        Path subDir = baseDir.resolve("subdir");
        Path deepDir = subDir.resolve("deep").resolve("nested");
        
        // Create directory structure
        Files.createDirectories(deepDir);
        System.out.println("Created directory structure: " + deepDir);
        
        // Create some test files
        Files.write(baseDir.resolve("file1.txt"), "Content 1".getBytes());
        Files.write(subDir.resolve("file2.txt"), "Content 2".getBytes());
        Files.write(deepDir.resolve("file3.txt"), "Content 3".getBytes());
        
        // List directory contents
        System.out.println("\n--- Directory Listing ---");
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(baseDir)) {
            for (Path entry : stream) {
                String type = Files.isDirectory(entry) ? "DIR " : "FILE";
                System.out.printf("%s %s%n", type, entry.getFileName());
            }
        }
        
        // Filtered directory listing
        System.out.println("\n--- Filtered Listing (*.txt files) ---");
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(baseDir, "*.txt")) {
            stream.forEach(path -> System.out.println("TXT: " + path.getFileName()));
        }
        
        // Recursive directory walking
        System.out.println("\n--- Recursive Directory Walk ---");
        try (Stream<Path> paths = Files.walk(baseDir)) {
            paths.forEach(path -> {
                String indent = "  ".repeat(baseDir.relativize(path).getNameCount() - 1);
                String type = Files.isDirectory(path) ? "[DIR]" : "[FILE]";
                System.out.printf("%s%s %s%n", indent, type, path.getFileName());
            });
        }
        
        // Finding files with specific criteria
        System.out.println("\n--- Finding Files ---");
        try (Stream<Path> paths = Files.find(baseDir, Integer.MAX_VALUE,
                (path, attrs) -> attrs.isRegularFile() && path.toString().endsWith(".txt"))) {
            paths.forEach(path -> System.out.println("Found: " + path));
        }
    }
    
    private static void performanceComparison() throws IOException {
        System.out.println("--- Performance Comparison ---");
        
        Path testFile = Paths.get(TEMP_DIR, "performance_test.txt");
        int iterations = 1000;
        
        // Generate test content
        StringBuilder content = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            content.append("Line ").append(i).append(": Some test content for performance testing\n");
        }
        String testContent = content.toString();
        
        // Traditional I/O performance
        long startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            File file = new File(testFile.toString());
            try (FileWriter writer = new FileWriter(file)) {
                writer.write(testContent);
            }
        }
        long traditionalTime = System.nanoTime() - startTime;
        
        // NIO.2 performance
        startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            Files.write(testFile, testContent.getBytes(StandardCharsets.UTF_8));
        }
        long nio2Time = System.nanoTime() - startTime;
        
        System.out.printf("Traditional I/O: %.2f ms (%d iterations)%n", 
            traditionalTime / 1_000_000.0, iterations);
        System.out.printf("NIO.2: %.2f ms (%d iterations)%n", 
            nio2Time / 1_000_000.0, iterations);
        System.out.printf("Performance improvement: %.1fx%n", 
            (double) traditionalTime / nio2Time);
        
        // Memory usage comparison for reading
        System.out.println("\n--- Memory Usage Comparison ---");
        
        // Create larger file for memory test
        Path largeFile = Paths.get(TEMP_DIR, "large_test.txt");
        try (BufferedWriter writer = Files.newBufferedWriter(largeFile)) {
            for (int i = 0; i < 100000; i++) {
                writer.write("This is line " + i + " with some content to make the file larger\n");
            }
        }
        
        System.out.printf("Large file size: %.2f MB%n", Files.size(largeFile) / (1024.0 * 1024.0));
        
        // Traditional approach - loads entire file into memory
        startTime = System.currentTimeMillis();
        List<String> allLines = Files.readAllLines(largeFile);
        long memoryIntensiveTime = System.currentTimeMillis() - startTime;
        System.out.printf("readAllLines (memory intensive): %d ms, %d lines%n", 
            memoryIntensiveTime, allLines.size());
        
        // Streaming approach - processes line by line
        startTime = System.currentTimeMillis();
        long lineCount = 0;
        try (Stream<String> lines = Files.lines(largeFile)) {
            lineCount = lines.count();
        }
        long streamingTime = System.currentTimeMillis() - startTime;
        System.out.printf("lines() streaming: %d ms, %d lines%n", 
            streamingTime, lineCount);
        
        Files.deleteIfExists(largeFile);
    }
    
    private static void cleanup() {
        try {
            Path tempDir = Paths.get(TEMP_DIR);
            if (Files.exists(tempDir)) {
                try (Stream<Path> paths = Files.walk(tempDir)) {
                    paths.sorted(Comparator.reverseOrder())
                         .forEach(path -> {
                             try {
                                 Files.deleteIfExists(path);
                             } catch (IOException e) {
                                 System.err.println("Failed to delete: " + path);
                             }
                         });
                }
            }
            System.out.println("\nCleaned up demo environment");
        } catch (IOException e) {
            System.err.println("Cleanup failed: " + e.getMessage());
        }
    }
}