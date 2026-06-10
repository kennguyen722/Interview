package com.interview.module11.api;

import com.interview.module11.api.dto.InterviewPackageRequest;
import com.interview.module11.api.dto.InterviewPackageResponse;
import com.interview.module11.service.InterviewPackageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/interview")
public class InterviewController {

    private final InterviewPackageService interviewPackageService;

    public InterviewController(InterviewPackageService interviewPackageService) {
        this.interviewPackageService = interviewPackageService;
    }

    @PostMapping("/package")
    public InterviewPackageResponse buildPackage(@Valid @RequestBody InterviewPackageRequest request) {
        return interviewPackageService.generate(request);
    }
}
