package org.example.patterns.templatemethod;

public class JsonExporter extends AbstractExporter {
    @Override
    protected String format(Object data) {
        return "{\"data\":\"" + String.valueOf(data) + "\"}";
    }
}
