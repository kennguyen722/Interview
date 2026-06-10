package com.interview.module11.service;

import com.interview.module11.api.dto.InterviewPackageRequest;
import com.interview.module11.api.dto.InterviewPackageResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewPackageService {

    public InterviewPackageResponse generate(InterviewPackageRequest request) {
        List<String> bullets = new ArrayList<>();
        request.architectureHighlights().forEach(item -> bullets.add("Architecture: " + item));
        request.impactMetrics().forEach(item -> bullets.add("Impact: " + item));

        List<String> focus = List.of(
                "System design tradeoffs",
                "Ownership and delivery leadership",
                "Reliability and operational excellence"
        );

        String pitch = request.candidateName() + " delivers production systems with measurable business impact and clear technical leadership.";
        return new InterviewPackageResponse(request.candidateName(), pitch, bullets, focus);
    }
}
