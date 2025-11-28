package org.example.patterns.factorymethod;

public class XmlDocumentParser implements DocumentParser {
    @Override public Object parse(String input) { return "XML:" + input; }
}
