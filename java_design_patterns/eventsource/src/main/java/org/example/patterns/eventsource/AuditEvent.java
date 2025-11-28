package org.example.patterns.eventsource;

public record AuditEvent(String type, String payload, long ts) {}
