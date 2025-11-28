package org.example.patterns.mediator;

public class User {
    private final String name;
    private final ChatMediator mediator;

    public User(String name, ChatMediator mediator) { this.name = name; this.mediator = mediator; mediator.register(this); }

    public String getName() { return name; }
    public void send(String message) { mediator.send(this, message); }
    public void receive(String message) { System.out.println(name + " received: " + message); }
}
