package com.interview.module10.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MentoringPlan(
        UUID planId,
        String mentor,
        String mentee,
        List<String> growthGoals,
        List<String> nextActions,
        String followUpCadence,
        Instant createdAt
) {
}
