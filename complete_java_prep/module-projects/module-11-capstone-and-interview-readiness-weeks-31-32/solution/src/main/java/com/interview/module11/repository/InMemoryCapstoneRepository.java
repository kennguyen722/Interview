package com.interview.module11.repository;

import com.interview.module11.domain.CapstonePlan;
import com.interview.module11.domain.SprintUpdate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryCapstoneRepository {

    private final Map<UUID, CapstonePlan> plans = new ConcurrentHashMap<>();
    private final Map<UUID, List<SprintUpdate>> updates = new ConcurrentHashMap<>();

    public void savePlan(CapstonePlan plan) {
        plans.put(plan.planId(), plan);
        updates.putIfAbsent(plan.planId(), new ArrayList<>());
    }

    public Optional<CapstonePlan> findPlan(UUID planId) {
        return Optional.ofNullable(plans.get(planId));
    }

    public void addSprintUpdate(UUID planId, SprintUpdate update) {
        updates.computeIfAbsent(planId, ignored -> new ArrayList<>()).add(update);
    }

    public List<SprintUpdate> findUpdates(UUID planId) {
        return updates.getOrDefault(planId, List.of());
    }
}
