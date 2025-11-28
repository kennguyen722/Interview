package org.example.patterns.decorator;

public class BasicMessageProcessor implements MessageProcessor {
    @Override public String process(String message) { return message; }
}
