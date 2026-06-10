package com.interview.module4.book;

import java.math.BigDecimal;

public record BookSearchCriteria(
    Integer year,
    String title,
    BigDecimal minPrice,
    BigDecimal maxPrice
) {
}
