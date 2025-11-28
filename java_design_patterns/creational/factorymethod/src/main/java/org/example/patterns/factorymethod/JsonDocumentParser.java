package org.example.patterns.factorymethod;

public class JsonDocumentParser implements DocumentParser {
    @Override public Object parse(String input) { return "JSON:" + input; }
}
