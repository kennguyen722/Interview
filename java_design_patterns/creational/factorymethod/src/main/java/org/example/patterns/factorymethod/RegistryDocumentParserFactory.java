package org.example.patterns.factorymethod;

import java.util.HashMap;
import java.util.Map;
import java.util.ServiceLoader;

/**
 * Advanced Factory: uses registry + ServiceLoader to create products.
 * New parsers can be added without modifying factory code.
 */
public class RegistryDocumentParserFactory extends DocumentParserFactory {
    private final Map<String, Class<? extends DocumentParser>> registry = new HashMap<>();

    public RegistryDocumentParserFactory() {
        for (DocumentParser p : ServiceLoader.load(DocumentParser.class)) {
            registry.put(p.type(), p.getClass());
        }
        // Manual registrations (optional)
        registry.putIfAbsent("json", JsonDocumentParser.class);
        registry.putIfAbsent("xml", XmlDocumentParser.class);
        registry.putIfAbsent("csv", CsvDocumentParser.class);
    }

    @Override
    public DocumentParser create(String type) {
        Class<? extends DocumentParser> cls = registry.get(type.toLowerCase());
        if (cls == null) throw new IllegalArgumentException("Unknown type: " + type);
        try {
            return cls.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to instantiate parser for type: " + type, e);
        }
    }
}
