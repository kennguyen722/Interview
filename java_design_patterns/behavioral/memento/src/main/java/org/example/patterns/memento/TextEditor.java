package org.example.patterns.memento;

public class TextEditor {
    private String content = "";
    public void type(String text) { content += text; }
    public TextSnapshot save() { return new TextSnapshot(content); }
    public void restore(TextSnapshot snapshot) { content = snapshot.getContent(); }
    public String getContent() { return content; }
}
