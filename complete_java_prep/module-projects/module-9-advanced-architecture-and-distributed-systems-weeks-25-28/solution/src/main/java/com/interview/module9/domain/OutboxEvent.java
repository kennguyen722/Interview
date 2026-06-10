package com.interview.module9.domain;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record OutboxEvent(
        UUID eventId,
        String eventType,
        UUID aggregateId,
        Instant occurredAt,
        Map<String, Object> payload
) {
}
