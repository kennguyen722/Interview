package org.example.patterns.chain;

public class TransformHandler extends AbstractHandler {
    @Override
    public void handle(Request request) {
        request.payload = request.payload.trim().toUpperCase();
        next(request);
    }
}
