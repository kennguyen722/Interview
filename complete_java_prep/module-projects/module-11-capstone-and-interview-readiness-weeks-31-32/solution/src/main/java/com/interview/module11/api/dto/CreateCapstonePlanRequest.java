package com.interview.module11.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateCapstonePlanRequest(
        @NotBlank String projectName,
        @NotBlank String owner,
        @NotNull List<String> milestones,
        @NotNull List<String> knownRisks
) {
}
