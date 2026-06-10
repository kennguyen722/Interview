package com.interview.module10.api;

import com.interview.module10.api.dto.CommunicationBriefRequest;
import com.interview.module10.api.dto.CommunicationBriefResponse;
import com.interview.module10.api.dto.MentoringPlanRequest;
import com.interview.module10.api.dto.ReviewEvaluationRequest;
import com.interview.module10.api.dto.ReviewEvaluationResponse;
import com.interview.module10.domain.MentoringPlan;
import com.interview.module10.service.CommunicationService;
import com.interview.module10.service.MentoringService;
import com.interview.module10.service.ReviewQualityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class LeadershipController {

    private final ReviewQualityService reviewQualityService;
    private final CommunicationService communicationService;
    private final MentoringService mentoringService;

    public LeadershipController(ReviewQualityService reviewQualityService,
                                CommunicationService communicationService,
                                MentoringService mentoringService) {
        this.reviewQualityService = reviewQualityService;
        this.communicationService = communicationService;
        this.mentoringService = mentoringService;
    }

    @PostMapping("/reviews/evaluate")
    public ReviewEvaluationResponse evaluate(@Valid @RequestBody ReviewEvaluationRequest request) {
        return reviewQualityService.evaluate(request);
    }

    @PostMapping("/communication/brief")
    public CommunicationBriefResponse brief(@Valid @RequestBody CommunicationBriefRequest request) {
        return communicationService.generateBrief(request);
    }

    @PostMapping("/mentoring/plans")
    public MentoringPlan mentoringPlan(@Valid @RequestBody MentoringPlanRequest request) {
        return mentoringService.createPlan(request);
    }
}
