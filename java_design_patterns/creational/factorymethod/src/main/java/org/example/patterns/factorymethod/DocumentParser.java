package org.example.patterns.factorymethod;

/**
 * Product interface in Factory Method pattern.
 * Advanced variant: implementations can declare a {@code type()} key used by registries.
 */
public interface DocumentParser {
    Object parse(String input);
    default String type() { return getClass().getSimpleName().replace("DocumentParser", "").toLowerCase(); }
}
