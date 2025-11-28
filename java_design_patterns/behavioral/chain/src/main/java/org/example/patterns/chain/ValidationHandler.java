package org.example.patterns.chain;

public class ValidationHandler extends AbstractHandler {
    @Override
    public void handle(Request request) {
        if (request.payload == null || request.payload.isBlank()) {
            throw new IllegalArgumentException("Invalid payload");
        }
        next(request);
    }
}
