package com.interview.module9.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateOrderRequest(
        @Min(1) long customerId,
        @NotBlank String sku,
        @Min(1) int quantity,
        @NotNull @DecimalMin(value = "0.01") BigDecimal totalAmount
) {
}
