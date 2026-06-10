package com.interview.module9.api;

import com.interview.module9.api.dto.CustomerOverviewResponse;
import com.interview.module9.service.GatewayAggregationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gateway/customers")
public class GatewayController {

    private final GatewayAggregationService gatewayAggregationService;

    public GatewayController(GatewayAggregationService gatewayAggregationService) {
        this.gatewayAggregationService = gatewayAggregationService;
    }

    @GetMapping("/{customerId}/overview")
    public CustomerOverviewResponse customerOverview(@PathVariable long customerId) {
        return gatewayAggregationService.buildCustomerOverview(customerId);
    }
}
