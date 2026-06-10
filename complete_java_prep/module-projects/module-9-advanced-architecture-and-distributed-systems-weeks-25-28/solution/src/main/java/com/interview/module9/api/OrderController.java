package com.interview.module9.api;

import com.interview.module9.api.dto.CreateOrderRequest;
import com.interview.module9.api.dto.OrderResponse;
import com.interview.module9.domain.OrderAggregate;
import com.interview.module9.service.OrderQueryService;
import com.interview.module9.service.SagaOrchestratorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final SagaOrchestratorService orchestratorService;
    private final OrderQueryService orderQueryService;

    public OrderController(SagaOrchestratorService orchestratorService, OrderQueryService orderQueryService) {
        this.orchestratorService = orchestratorService;
        this.orderQueryService = orderQueryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        OrderAggregate order = orchestratorService.createOrder(request);
        return OrderResponse.from(order);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getById(@PathVariable UUID orderId) {
        return OrderResponse.from(orderQueryService.getOrder(orderId));
    }
}
