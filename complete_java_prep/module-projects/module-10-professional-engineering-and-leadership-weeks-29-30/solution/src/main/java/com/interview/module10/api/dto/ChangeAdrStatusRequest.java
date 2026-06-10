package com.interview.module10.api.dto;

import com.interview.module10.domain.AdrStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeAdrStatusRequest(@NotNull AdrStatus status) {
}
