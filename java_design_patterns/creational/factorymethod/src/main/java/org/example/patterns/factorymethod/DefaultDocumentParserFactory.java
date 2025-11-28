package org.example.patterns.factorymethod;

public class DefaultDocumentParserFactory extends DocumentParserFactory {
    @Override public DocumentParser create(String type) {
        return switch (type.toLowerCase()) {
            case "json" -> new JsonDocumentParser();
            case "xml" -> new XmlDocumentParser();
            case "csv" -> new CsvDocumentParser();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
}
