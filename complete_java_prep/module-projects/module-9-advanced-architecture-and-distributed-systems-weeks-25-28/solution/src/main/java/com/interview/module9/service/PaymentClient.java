package com.interview.module9.service;

import com.interview.module9.exception.DomainException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class PaymentClient {

    @Retryable(retryFor = DomainException.class, maxAttempts = 2, backoff = @Backoff(delay = 100))
    public String charge(long customerId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.valueOf(10_000)) >= 0) {
            throw new DomainException("Payment authorization denied for customer " + customerId);
        }
        return "pay-" + UUID.randomUUID();
    }

    public void refund(String paymentReference) {
        // In a real platform this would call the payment service refund endpoint.
    }
}
