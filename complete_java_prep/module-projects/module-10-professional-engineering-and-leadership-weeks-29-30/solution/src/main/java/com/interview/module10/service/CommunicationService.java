package com.interview.module10.service;

import com.interview.module10.api.dto.CommunicationBriefRequest;
import com.interview.module10.api.dto.CommunicationBriefResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunicationService {

    public CommunicationBriefResponse generateBrief(CommunicationBriefRequest request) {
        List<String> keyMessages = List.of(
                "Objective: " + request.objective(),
                "Technical update: " + request.technicalUpdate(),
                "Risk posture: " + request.risks()
        );
        List<String> nextSteps = List.of(
                "Confirm decision owners and timeline",
                "Track risks in weekly status review",
                "Publish outcome to engineering notes"
        );
        return new CommunicationBriefResponse(request.audience(), request.objective(), keyMessages, nextSteps);
    }
}
