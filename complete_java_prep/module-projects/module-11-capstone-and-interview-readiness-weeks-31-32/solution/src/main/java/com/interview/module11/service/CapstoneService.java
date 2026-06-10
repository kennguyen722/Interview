package com.interview.module11.service;

import com.interview.module11.api.dto.CreateCapstonePlanRequest;
import com.interview.module11.api.dto.SprintUpdateRequest;
import com.interview.module11.domain.CapstonePlan;
import com.interview.module11.domain.SprintUpdate;
import com.interview.module11.exception.DomainException;
import com.interview.module11.repository.InMemoryCapstoneRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CapstoneService {

    private final InMemoryCapstoneRepository repository;

    public CapstoneService(InMemoryCapstoneRepository repository) {
        this.repository = repository;
    }

    public CapstonePlan createPlan(CreateCapstonePlanRequest request) {
        CapstonePlan plan = new CapstonePlan(
                UUID.randomUUID(),
                request.projectName(),
                request.owner(),
                request.milestones(),
                request.knownRisks(),
                Instant.now()
        );
        repository.savePlan(plan);
        return plan;
    }

    public SprintUpdate addUpdate(UUID planId, SprintUpdateRequest request) {
        ensurePlanExists(planId);
        SprintUpdate update = new SprintUpdate(request.sprintNumber(), request.completedItems(), request.blockers(), Instant.now());
        repository.addSprintUpdate(planId, update);
        return update;
    }

    public Map<String, Object> sprintHealth(UUID planId) {
        ensurePlanExists(planId);
        List<SprintUpdate> updates = repository.findUpdates(planId);
        int completed = updates.stream().mapToInt(update -> update.completedItems().size()).sum();
        int blockers = updates.stream().mapToInt(update -> update.blockers().size()).sum();
        int score = Math.max(0, 100 - blockers * 10 + Math.min(completed, 5) * 5);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("planId", planId);
        payload.put("updates", updates.size());
        payload.put("completedItems", completed);
        payload.put("blockers", blockers);
        payload.put("healthScore", Math.min(score, 100));
        payload.put("status", blockers == 0 ? "ON_TRACK" : "AT_RISK");
        return payload;
    }

    public Map<String, Object> releaseReadiness(UUID planId) {
        ensurePlanExists(planId);
        Map<String, Object> health = sprintHealth(planId);
        int healthScore = (int) health.get("healthScore");

        Map<String, Object> readiness = new LinkedHashMap<>();
        readiness.put("planId", planId);
        readiness.put("ready", healthScore >= 75);
        readiness.put("healthScore", healthScore);
        readiness.put("gates", List.of("Functional validation", "Reliability checks", "Documentation complete"));
        return readiness;
    }

    private void ensurePlanExists(UUID planId) {
        repository.findPlan(planId).orElseThrow(() -> new DomainException("Plan not found: " + planId));
    }
}
