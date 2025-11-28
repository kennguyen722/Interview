package org.example.patterns.chain;

public interface Handler {
    Handler linkWith(Handler next);
    void handle(Request request);
}
