package com.interview.module6.auth;

import com.interview.module6.common.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshDays;

    public RefreshTokenService(
        RefreshTokenRepository refreshTokenRepository,
        @Value("${module6.jwt.refresh-expiration-days}") long refreshDays
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshDays = refreshDays;
    }

    public String createToken(AppUser user) {
        String rawToken = UUID.randomUUID().toString() + UUID.randomUUID();

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hash(rawToken));
        token.setExpiresAt(Instant.now().plus(refreshDays, ChronoUnit.DAYS));
        token.setRevoked(false);
        refreshTokenRepository.save(token);

        return rawToken;
    }

    public AppUser validateAndResolveUser(String refreshToken) {
        RefreshToken activeToken = refreshTokenRepository.findByTokenHash(hash(refreshToken))
            .filter(token -> !token.isRevoked() && token.getExpiresAt().isAfter(Instant.now()))
            .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        return activeToken.getUser();
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte b : encoded) {
                builder.append(String.format("%02x", b));
            }
            return builder.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to hash refresh token", ex);
        }
    }
}
