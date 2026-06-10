package com.interview.module11.service;

import com.interview.module11.api.dto.CreateCapstonePlanRequest;
import com.interview.module11.api.dto.SprintUpdateRequest;
import com.interview.module11.domain.CapstonePlan;
import com.interview.module11.repository.InMemoryCapstoneRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

class CapstoneServiceTest {

    @Test
    void shouldCalculateHealthScore() {
        CapstoneService service = new CapstoneService(new InMemoryCapstoneRepository());
        CapstonePlan plan = service.createPlan(new CreateCapstonePlanRequest(
                "Identity Platform",
                "candidate-1",
                List.of("Sprint 1", "Sprint 2"),
                List.of("Scope drift")
        ));

        service.addUpdate(plan.planId(), new SprintUpdateRequest(1, List.of("API completed", "Tests added"), List.of()));
        Map<String, Object> health = service.sprintHealth(plan.planId());

        assertTrue((int) health.get("healthScore") > 0);
    }
}
