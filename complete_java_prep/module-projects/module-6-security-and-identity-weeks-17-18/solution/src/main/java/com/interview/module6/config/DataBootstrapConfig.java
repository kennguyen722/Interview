package com.interview.module6.config;

import com.interview.module6.auth.AppUser;
import com.interview.module6.auth.AppUserRepository;
import com.interview.module6.auth.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataBootstrapConfig {

    @Bean
    CommandLineRunner seedUsers(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (appUserRepository.count() > 0) {
                return;
            }

            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(UserRole.ROLE_ADMIN);
            admin.setEnabled(true);

            AppUser user = new AppUser();
            user.setUsername("user");
            user.setPasswordHash(passwordEncoder.encode("User@123"));
            user.setRole(UserRole.ROLE_USER);
            user.setEnabled(true);

            appUserRepository.save(admin);
            appUserRepository.save(user);
        };
    }
}
