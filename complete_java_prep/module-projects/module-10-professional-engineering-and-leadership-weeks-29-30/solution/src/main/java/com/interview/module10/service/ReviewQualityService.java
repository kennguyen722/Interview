package com.interview.module10.service;

import com.interview.module10.api.dto.ReviewEvaluationRequest;
import com.interview.module10.api.dto.ReviewEvaluationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewQualityService {

    public ReviewEvaluationResponse evaluate(ReviewEvaluationRequest request) {
        List<String> findings = new ArrayList<>();
        int score = 100;

        if (request.checklist().size() < 3) {
            findings.add("Checklist is too short; include security, performance, and testability checks");
            score -= 25;
        }
        if (request.riskLevel() >= 7 && request.testEvidence().length() < 20) {
            findings.add("High-risk change requires stronger test evidence");
            score -= 35;
        }
        if (request.changeSummary().length() < 40) {
            findings.add("Change summary lacks context and expected behavior details");
            score -= 20;
        }

        boolean approved = score >= 75 && findings.isEmpty();
        if (!approved && findings.isEmpty()) {
            findings.add("Review did not satisfy quality gate");
        }
        return new ReviewEvaluationResponse(approved, Math.max(0, score), findings);
    }
}
