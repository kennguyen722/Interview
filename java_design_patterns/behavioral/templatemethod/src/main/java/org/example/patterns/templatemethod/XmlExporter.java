package org.example.patterns.templatemethod;

public class XmlExporter extends AbstractExporter {
    @Override
    protected String format(Object data) {
        return "<data>" + String.valueOf(data) + "</data>";
    }
}
