package com.interview.module11.domain;

import java.time.Instant;
import java.util.List;

public record SprintUpdate(
        int sprintNumber,
        List<String> completedItems,
        List<String> blockers,
        Instant submittedAt
) {
}
