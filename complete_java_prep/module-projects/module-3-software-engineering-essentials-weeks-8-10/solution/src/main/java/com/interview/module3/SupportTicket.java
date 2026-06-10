package com.interview.module3;

import java.time.Instant;
import java.util.UUID;

public record SupportTicket(
        UUID id,
        String title,
        String description,
        String priority,
        Instant createdAt
) {
}
