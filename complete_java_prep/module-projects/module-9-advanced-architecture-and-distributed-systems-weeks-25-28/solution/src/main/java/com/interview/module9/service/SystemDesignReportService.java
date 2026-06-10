package com.interview.module9.service;

import com.interview.module9.api.dto.SystemDesignResponse;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SystemDesignReportService {

    public SystemDesignResponse summarize() {
        Map<String, String> tradeoffs = new LinkedHashMap<>();
        tradeoffs.put("Consistency", "Saga + outbox favor availability and auditability over immediate global ACID");
        tradeoffs.put("Gateway", "BFF reduces frontend complexity while adding another deployable component");
        tradeoffs.put("Failure handling", "Retries and compensations improve resilience but require idempotent contracts");

        return new SystemDesignResponse(
                "Order workflow across inventory and payment domains",
                List.of("Order Orchestrator", "Inventory Service", "Payment Service", "Gateway/BFF"),
                List.of("Retry on transient dependency errors", "Compensation for partial failure", "Structured error handling"),
                List.of("Saga orchestration", "Outbox event recording", "Deterministic recovery semantics"),
                tradeoffs
        );
    }
}
