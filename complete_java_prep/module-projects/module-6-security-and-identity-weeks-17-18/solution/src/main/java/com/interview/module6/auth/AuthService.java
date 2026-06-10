package com.interview.module6.auth;

import com.interview.module6.common.error.UnauthorizedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository appUserRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
        AuthenticationManager authenticationManager,
        AppUserRepository appUserRepository,
        JwtService jwtService,
        RefreshTokenService refreshTokenService
    ) {
        this.authenticationManager = authenticationManager;
        this.appUserRepository = appUserRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        AppUser user = appUserRepository.findByUsername(request.username())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        return new AuthResponse(
            jwtService.createAccessToken(user),
            refreshTokenService.createToken(user),
            "Bearer",
            jwtService.accessExpiresAtEpochSeconds()
        );
    }

    public AuthResponse refresh(TokenRefreshRequest request) {
        AppUser user = refreshTokenService.validateAndResolveUser(request.refreshToken());

        return new AuthResponse(
            jwtService.createAccessToken(user),
            refreshTokenService.createToken(user),
            "Bearer",
            jwtService.accessExpiresAtEpochSeconds()
        );
    }
}
