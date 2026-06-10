package com.interview.module11.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CapstonePlan(
        UUID planId,
        String projectName,
        String owner,
        List<String> milestones,
        List<String> knownRisks,
        Instant createdAt
) {
}
