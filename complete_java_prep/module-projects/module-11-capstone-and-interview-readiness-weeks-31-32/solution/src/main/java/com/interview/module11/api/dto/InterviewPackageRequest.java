package com.interview.module11.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record InterviewPackageRequest(
        @NotBlank String candidateName,
        @NotNull List<String> starStories,
        @NotNull List<String> architectureHighlights,
        @NotNull List<String> impactMetrics
) {
}
