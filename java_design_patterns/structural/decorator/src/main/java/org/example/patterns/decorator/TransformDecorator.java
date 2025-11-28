package org.example.patterns.decorator;

import java.util.Locale;

public class TransformDecorator extends MessageProcessorDecorator {
    public enum Mode { UPPER, LOWER }

    private final Mode mode;

    public TransformDecorator(MessageProcessor delegate, Mode mode) {
        super(delegate);
        this.mode = mode;
    }

    @Override
    public String process(String message) {
        String base = delegate.process(message);
        return mode == Mode.UPPER ? base.toUpperCase(Locale.ROOT) : base.toLowerCase(Locale.ROOT);
    }
}
