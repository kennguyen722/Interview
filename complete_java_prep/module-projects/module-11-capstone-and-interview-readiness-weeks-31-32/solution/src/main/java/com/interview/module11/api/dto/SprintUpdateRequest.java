package com.interview.module11.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SprintUpdateRequest(
        @Min(1) int sprintNumber,
        @NotNull List<String> completedItems,
        @NotNull List<String> blockers
) {
}
