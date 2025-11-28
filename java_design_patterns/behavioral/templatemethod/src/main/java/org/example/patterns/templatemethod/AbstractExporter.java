package org.example.patterns.templatemethod;

public abstract class AbstractExporter {
    public final void export(Object data) {
        validate(data);
        String formatted = format(data);
        write(formatted);
    }

    protected void validate(Object data) { /* default no-op */ }
    protected abstract String format(Object data);
    protected void write(String out) { System.out.println(out); }
}
