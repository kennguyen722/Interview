package org.example.patterns.creational.factorymethod;

import org.example.patterns.factorymethod.DefaultDocumentParserFactory;
import org.example.patterns.factorymethod.RegistryDocumentParserFactory;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FactoryMethodAdvancedTest {
    @Test
    void defaultFactoryCreatesKnownParsers() {
        var f = new DefaultDocumentParserFactory();
        assertEquals("JSON:hello", f.parse("json", "hello"));
        assertEquals("XML:hi", f.parse("xml", "hi"));
        assertEquals("CSV:data", f.parse("csv", "data"));
    }

    @Test
    void registryFactoryLoadsViaServiceLoader() {
        var f = new RegistryDocumentParserFactory();
        assertEquals("JSON:hello", f.parse("json", "hello"));
        assertEquals("XML:hi", f.parse("xml", "hi"));
        assertEquals("CSV:data", f.parse("csv", "data"));
        assertThrows(IllegalArgumentException.class, () -> f.parse("yaml", "nope"));
    }
}
