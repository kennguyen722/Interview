package org.example.patterns.decorator;

public class ValidationDecorator extends MessageProcessorDecorator {
    public ValidationDecorator(MessageProcessor delegate) { super(delegate); }

    @Override
    public String process(String message) {
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be null or blank");
        }
        return delegate.process(message);
    }
}
