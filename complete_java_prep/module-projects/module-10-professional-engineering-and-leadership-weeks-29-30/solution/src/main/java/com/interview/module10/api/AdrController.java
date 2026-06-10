package com.interview.module10.api;

import com.interview.module10.api.dto.ChangeAdrStatusRequest;
import com.interview.module10.api.dto.CreateAdrRequest;
import com.interview.module10.domain.AdrRecord;
import com.interview.module10.service.AdrService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/adrs")
public class AdrController {

    private final AdrService adrService;

    public AdrController(AdrService adrService) {
        this.adrService = adrService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdrRecord create(@Valid @RequestBody CreateAdrRequest request) {
        return adrService.create(request);
    }

    @PatchMapping("/{adrId}/status")
    public AdrRecord changeStatus(@PathVariable UUID adrId, @Valid @RequestBody ChangeAdrStatusRequest request) {
        return adrService.changeStatus(adrId, request.status());
    }

    @GetMapping
    public List<AdrRecord> list() {
        return adrService.list();
    }
}
