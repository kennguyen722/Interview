package org.example.patterns.eventsource;

import org.example.patterns.observer.Event; // placeholder for integration

public class AuditObserver { // would implement EventListener in integration module
    private final AuditEventStore store;
    public AuditObserver(AuditEventStore store){ this.store = store; }
    public void onEvent(Event e){
        String type = e.getClass().getSimpleName();
        store.append(new AuditEvent(type, e.toString(), System.currentTimeMillis()));
    }
}
