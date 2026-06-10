package com.interview.module10.domain;

import java.time.Instant;
import java.util.UUID;

public class AdrRecord {

    private final UUID id;
    private final String title;
    private final String context;
    private final String decision;
    private final String owner;
    private final Instant createdAt;
    private AdrStatus status;

    public AdrRecord(UUID id, String title, String context, String decision, String owner) {
        this.id = id;
        this.title = title;
        this.context = context;
        this.decision = decision;
        this.owner = owner;
        this.createdAt = Instant.now();
        this.status = AdrStatus.PROPOSED;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getContext() { return context; }
    public String getDecision() { return decision; }
    public String getOwner() { return owner; }
    public Instant getCreatedAt() { return createdAt; }
    public AdrStatus getStatus() { return status; }

    public void changeStatus(AdrStatus status) {
        this.status = status;
    }
}
