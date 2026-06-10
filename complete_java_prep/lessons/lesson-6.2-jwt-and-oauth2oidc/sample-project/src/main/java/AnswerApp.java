import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class AnswerApp {
    private static final String SECRET = "lesson-6-2-secret";

    public static void main(String[] args) throws Exception {
        String token = issueToken("student-1", 60);
        System.out.println("Lesson 6.2 - JWT lifecycle simulation");
        System.out.println("Token: " + token);
        System.out.println("Valid now: " + validateToken(token));
    }

    static String issueToken(String subject, long expiresInSeconds) throws Exception {
        long exp = Instant.now().getEpochSecond() + expiresInSeconds;
        String payload = subject + ":" + exp;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = hmacSha256(encodedPayload, SECRET);
        return encodedPayload + "." + signature;
    }

    static boolean validateToken(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 2) return false;

        String expectedSig = hmacSha256(parts[0], SECRET);
        if (!expectedSig.equals(parts[1])) return false;

        String decoded = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        String[] payload = decoded.split(":");
        long exp = Long.parseLong(payload[1]);
        return Instant.now().getEpochSecond() < exp;
    }

    static String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
    }
}
