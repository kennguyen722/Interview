package org.example.patterns.mediator;

public interface ChatMediator {
    void register(User user);
    void send(User from, String message);
}
