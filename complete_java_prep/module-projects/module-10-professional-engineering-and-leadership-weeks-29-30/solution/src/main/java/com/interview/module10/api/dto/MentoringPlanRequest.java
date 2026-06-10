package com.interview.module10.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record MentoringPlanRequest(
        @NotBlank String mentor,
        @NotBlank String mentee,
        @NotNull List<String> growthGoals,
        @NotNull List<String> nextActions,
        @NotBlank String followUpCadence
) {
}
