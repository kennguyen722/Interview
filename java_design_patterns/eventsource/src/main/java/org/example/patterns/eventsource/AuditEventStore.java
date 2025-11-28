package org.example.patterns.eventsource;

import java.util.ArrayList;
import java.util.List;

public class AuditEventStore {
    private final List<AuditEvent> events = new ArrayList<>();
    public void append(AuditEvent e){ events.add(e); }
    public List<AuditEvent> all(){ return List.copyOf(events); }
}
