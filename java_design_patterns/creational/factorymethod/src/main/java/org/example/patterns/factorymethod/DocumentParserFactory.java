package org.example.patterns.factorymethod;

public abstract class DocumentParserFactory {
    public abstract DocumentParser create(String type);
    public Object parse(String type, String input) { return create(type).parse(input); }
}
