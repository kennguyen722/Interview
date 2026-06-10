package com.interview.module9.api;

import com.interview.module9.api.dto.SystemDesignResponse;
import com.interview.module9.service.SystemDesignReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final SystemDesignReportService reportService;

    public AdminController(SystemDesignReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/system-design")
    public SystemDesignResponse systemDesign() {
        return reportService.summarize();
    }
}
