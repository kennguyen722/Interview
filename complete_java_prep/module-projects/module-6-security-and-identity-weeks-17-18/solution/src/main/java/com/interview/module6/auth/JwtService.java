package com.interview.module6.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final String issuer;
    private final long accessMinutes;

    public JwtService(
        @Value("${module6.jwt.secret}") String secret,
        @Value("${module6.jwt.issuer}") String issuer,
        @Value("${module6.jwt.access-expiration-minutes}") long accessMinutes
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(secret.getBytes()));
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.issuer = issuer;
        this.accessMinutes = accessMinutes;
    }

    public String createAccessToken(AppUser user) {
        Instant now = Instant.now();
        Instant exp = now.plus(accessMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
            .subject(user.getUsername())
            .issuer(issuer)
            .claim("role", user.getRole().name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(exp))
            .signWith(secretKey)
            .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public long accessExpiresAtEpochSeconds() {
        return Instant.now().plus(accessMinutes, ChronoUnit.MINUTES).getEpochSecond();
    }
}
