package com.interview.module10.service;

import com.interview.module10.api.dto.MentoringPlanRequest;
import com.interview.module10.domain.MentoringPlan;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class MentoringService {

    public MentoringPlan createPlan(MentoringPlanRequest request) {
        return new MentoringPlan(
                UUID.randomUUID(),
                request.mentor(),
                request.mentee(),
                request.growthGoals(),
                request.nextActions(),
                request.followUpCadence(),
                Instant.now()
        );
    }
}
