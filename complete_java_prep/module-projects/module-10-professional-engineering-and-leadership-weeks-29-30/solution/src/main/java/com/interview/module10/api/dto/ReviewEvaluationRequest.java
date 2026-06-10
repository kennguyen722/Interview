package com.interview.module10.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReviewEvaluationRequest(
        @NotBlank String changeSummary,
        @NotNull List<String> checklist,
        @Min(0) @Max(10) int riskLevel,
        @NotBlank String testEvidence
) {
}
