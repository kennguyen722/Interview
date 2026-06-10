package com.interview.module10.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateAdrRequest(
        @NotBlank String title,
        @NotBlank String context,
        @NotBlank String decision,
        @NotBlank String owner
) {
}
