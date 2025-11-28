package org.example.patterns.decorator;

public abstract class MessageProcessorDecorator implements MessageProcessor {
    protected final MessageProcessor delegate;
    protected MessageProcessorDecorator(MessageProcessor delegate) { this.delegate = delegate; }
}
