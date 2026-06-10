package com.interview.module6.auth;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long accessExpiresAtEpochSeconds
) {
}
