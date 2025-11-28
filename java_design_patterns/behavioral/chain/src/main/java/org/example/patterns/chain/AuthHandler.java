package org.example.patterns.chain;

public class AuthHandler extends AbstractHandler {
    @Override
    public void handle(Request request) {
        request.authenticated = true; // pretend auth succeeds
        next(request);
    }
}
