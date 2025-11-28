package org.example.patterns.memento;

public class TextSnapshot {
    private final String content;
    public TextSnapshot(String content) { this.content = content; }
    public String getContent() { return content; }
}
