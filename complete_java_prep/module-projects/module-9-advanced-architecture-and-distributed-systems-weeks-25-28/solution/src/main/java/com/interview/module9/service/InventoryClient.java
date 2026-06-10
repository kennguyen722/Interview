package com.interview.module9.service;

import com.interview.module9.exception.DomainException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class InventoryClient {

    @Retryable(retryFor = DomainException.class, maxAttempts = 2, backoff = @Backoff(delay = 100))
    public String reserve(String sku, int quantity) {
        if (sku.startsWith("out-of-stock")) {
            throw new DomainException("Inventory unavailable for sku " + sku);
        }
        return "inv-" + UUID.randomUUID();
    }

    public void release(String reservationId) {
        // In a real platform this would call the inventory service compensate endpoint.
    }
}
