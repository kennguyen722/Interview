# Answer Code Sample - Lesson 6.1: Spring Security Fundamentals

## Java Answer (Complete Runnable)

~~~java
import java.util.*;

/**
 * Lesson 6.1 - Spring Security Fundamentals
 *
 * Demonstrates the authentication + authorization contract
 * and Spring Security filter chain order.
 *
 * KEY TERMS:
 *   authentication - proving who you are (username + password / JWT).
 *   authorization  - deciding what you can do (roles / permissions).
 *   filter chain   - ordered servlet filters that process each request.
 *   SecurityContext - thread-local holder for the current principal.
 *   @PreAuthorize  - method-level access control annotation.
 */
public class AnswerApp {

    enum Role { ROLE_GUEST, ROLE_USER, ROLE_ADMIN }

    record UserDetails(String username, String passwordHash, Set<Role> roles) {}

    // ── Auth service (mirrors Spring's AuthenticationManager) ───────
    static class AuthService {
        private final Map<String, UserDetails> store = new HashMap<>();

        AuthService() {
            // Passwords should ALWAYS be stored as hashed values (BCrypt in real code)
            store.put("alice", new UserDetails("alice", hash("secretA"),
                EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN)));
            store.put("bob",   new UserDetails("bob",   hash("secretB"),
                EnumSet.of(Role.ROLE_USER)));
        }

        /** Returns the authenticated UserDetails, or throws. */
        public UserDetails authenticate(String username, String password) {
            UserDetails u = store.get(username);
            if (u == null || !u.passwordHash().equals(hash(password)))
                throw new SecurityException("Bad credentials for user: " + username);
            return u;
        }

        public boolean hasRole(UserDetails u, Role role) {
            return u.roles().contains(role);
        }

        // Simulate BCrypt: in production use BCryptPasswordEncoder
        private static String hash(String plain) {
            return "bcrypt$" + Math.abs(plain.hashCode());
        }
    }

    // ── Resource protected by roles ──────────────────────────────────
    static class AdminController {
        private final AuthService auth;
        AdminController(AuthService a) { this.auth = a; }

        public void accessAdminPanel(UserDetails user) {
            // @PreAuthorize("hasRole('ADMIN')") equivalent
            if (!auth.hasRole(user, Role.ROLE_ADMIN))
                throw new SecurityException("Access denied: ROLE_ADMIN required");
            System.out.println("  [ADMIN] Panel accessed by: " + user.username());
        }

        public void viewProfile(UserDetails user) {
            // @PreAuthorize("hasRole('USER')") equivalent
            if (!auth.hasRole(user, Role.ROLE_USER))
                throw new SecurityException("Access denied: ROLE_USER required");
            System.out.println("  [USER] Profile viewed by: " + user.username());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Lesson 6.1: Spring Security Fundamentals ===\n");

        AuthService auth = new AuthService();
        AdminController ctrl = new AdminController(auth);

        // ── Authentication ───────────────────────────────────────────
        System.out.println("--- Authentication ---");
        tryAuth(auth, "alice", "secretA");
        tryAuth(auth, "alice", "wrong");
        tryAuth(auth, "unknown", "pass");

        // ── Authorization ────────────────────────────────────────────
        System.out.println("\n--- Authorization ---");
        UserDetails alice = auth.authenticate("alice", "secretA");
        UserDetails bob   = auth.authenticate("bob",   "secretB");

        tryAccess(() -> ctrl.accessAdminPanel(alice));  // allowed
        tryAccess(() -> ctrl.accessAdminPanel(bob));    // denied
        tryAccess(() -> ctrl.viewProfile(bob));         // allowed

        // ── Filter chain order ───────────────────────────────────────
        System.out.println("\n--- Spring Security filter chain ---");
        String[] chain = {
            "1. CorsFilter          - CORS headers",
            "2. CsrfFilter          - CSRF token validation",
            "3. LogoutFilter        - process logout URL",
            "4. BearerTokenAuthFilter - extract JWT",
            "5. UsernamePasswordAuthFilter - form login",
            "6. ExceptionTranslationFilter - 401/403 responses",
            "7. AuthorizationFilter - final access decision"
        };
        for (String f : chain) System.out.println("  " + f);
    }

    static void tryAuth(AuthService auth, String u, String p) {
        try {
            UserDetails d = auth.authenticate(u, p);
            System.out.println("  AUTH OK  " + d.username() + " roles=" + d.roles());
        } catch (SecurityException e) {
            System.out.println("  AUTH FAIL " + e.getMessage());
        }
    }

    static void tryAccess(Runnable r) {
        try { r.run(); }
        catch (SecurityException e) { System.out.println("  " + e.getMessage()); }
    }
}
~~~
