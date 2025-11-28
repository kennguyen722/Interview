package org.example.patterns.command;

public class InsertTextCommand implements Command {
    private final Document doc;
    private final int index;
    private final String text;

    public InsertTextCommand(Document doc, int index, String text) {
        this.doc = doc; this.index = index; this.text = text;
    }

    @Override public void execute() { doc.insert(index, text); }
    @Override public void undo() { doc.delete(index, text.length()); }
}
