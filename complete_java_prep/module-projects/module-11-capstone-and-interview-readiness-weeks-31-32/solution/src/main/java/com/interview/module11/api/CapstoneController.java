package com.interview.module11.api;

import com.interview.module11.api.dto.CreateCapstonePlanRequest;
import com.interview.module11.api.dto.SprintUpdateRequest;
import com.interview.module11.domain.CapstonePlan;
import com.interview.module11.domain.SprintUpdate;
import com.interview.module11.service.CapstoneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/capstone")
public class CapstoneController {

    private final CapstoneService capstoneService;

    public CapstoneController(CapstoneService capstoneService) {
        this.capstoneService = capstoneService;
    }

    @PostMapping("/plans")
    @ResponseStatus(HttpStatus.CREATED)
    public CapstonePlan createPlan(@Valid @RequestBody CreateCapstonePlanRequest request) {
        return capstoneService.createPlan(request);
    }

    @PostMapping("/sprints/{planId}/updates")
    public SprintUpdate addUpdate(@PathVariable UUID planId, @Valid @RequestBody SprintUpdateRequest request) {
        return capstoneService.addUpdate(planId, request);
    }

    @GetMapping("/sprints/{planId}/health")
    public Map<String, Object> sprintHealth(@PathVariable UUID planId) {
        return capstoneService.sprintHealth(planId);
    }

    @GetMapping("/releases/{planId}/readiness")
    public Map<String, Object> readiness(@PathVariable UUID planId) {
        return capstoneService.releaseReadiness(planId);
    }
}
