package com.interview.module4.book;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record BookCreateRequest(
    @NotBlank @Size(max = 200) String title,
    @NotBlank @Pattern(regexp = "[0-9Xx-]{10,20}") String isbn,
    @Min(1900) @Max(2100) int publishedYear,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotNull Long authorId
) {
}
