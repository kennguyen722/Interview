package org.example.patterns.factorymethod;

public class CsvDocumentParser implements DocumentParser {
    @Override public Object parse(String input) { return "CSV:" + input; }
}
