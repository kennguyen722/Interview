# Additional Answer Snippets - Lesson 1.3

## Exercise A - Reference Pattern
```java
String input = "value";
if (input == null || input.isBlank()) {
    throw new IllegalArgumentException("input must not be blank");
}
System.out.println(input.trim());
```

## Exercise B - Refactor Pattern
```java
private static String normalize(String value) {
    return value == null ? "" : value.trim().toLowerCase();
}
```
