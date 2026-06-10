package com.interview.module10.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CommunicationBriefRequest(
        @NotBlank String audience,
        @NotBlank String objective,
        @NotBlank String technicalUpdate,
        @NotBlank String risks
) {
}
