package org.example.patterns.mediator;

import java.util.ArrayList;
import java.util.List;

public class ChatRoomMediator implements ChatMediator {
    private final List<User> users = new ArrayList<>();

    @Override public void register(User user) { users.add(user); }

    @Override public void send(User from, String message) {
        for (User u : users) {
            if (u != from) u.receive(from.getName() + ": " + message);
        }
    }
}
