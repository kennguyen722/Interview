package com.interview.module5.order;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record OrderCreateRequest(
    @NotNull Long customerId,
    @NotBlank @Size(max = 40) @Pattern(regexp = "ORD-[A-Z0-9-]+") String referenceCode,
    @NotNull @DecimalMin("0.0") BigDecimal totalAmount
) {
}
