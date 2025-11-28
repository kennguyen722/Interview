package org.example.patterns.observer;

import java.util.ArrayList;
import java.util.List;

public class EventBus {
    private final List<EventListener> listeners = new ArrayList<>();

    public void register(EventListener listener) { listeners.add(listener); }
    public void unregister(EventListener listener) { listeners.remove(listener); }

    public void publish(Event event) {
        for (EventListener l : List.copyOf(listeners)) {
            l.onEvent(event);
        }
    }
}
