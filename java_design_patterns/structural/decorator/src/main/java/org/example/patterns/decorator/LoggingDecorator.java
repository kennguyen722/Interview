package org.example.patterns.decorator;

public class LoggingDecorator extends MessageProcessorDecorator {
    public LoggingDecorator(MessageProcessor delegate) { super(delegate); }

    @Override
    public String process(String message) {
        System.out.println("[LOG] Processing message: " + message);
        String result = delegate.process(message);
        System.out.println("[LOG] Result: " + result);
        return result;
    }
}
