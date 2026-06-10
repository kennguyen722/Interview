package com.interview.module11.api.dto;

import java.util.List;

public record InterviewPackageResponse(
        String candidate,
        String elevatorPitch,
        List<String> portfolioBullets,
        List<String> interviewFocusAreas
) {
}
