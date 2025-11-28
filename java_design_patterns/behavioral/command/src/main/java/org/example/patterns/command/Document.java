package org.example.patterns.command;

public class Document {
    private final StringBuilder content = new StringBuilder();
    public void insert(int index, String text) { content.insert(index, text); }
    public void delete(int index, int length) { content.delete(index, index + length); }
    public String getContent() { return content.toString(); }
}
