/**
 * Lesson 7.3 - API Integration with Java Backend
 *
 * Covers the Axios HTTP client pattern, auth token lifecycle,
 * and error handling for React apps calling a Spring Boot API.
 *
 * KEY TERMS:
 *   Axios         - Promise-based HTTP client for browser and Node.js.
 *   interceptor   - middleware that runs on every request or response.
 *   access token  - short-lived JWT sent as Authorization: Bearer header.
 *   refresh token - long-lived token stored in HttpOnly cookie.
 *   CORS          - server must allow the frontend origin in its CORS policy.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 7.3: API Integration with Java Backend ===\n");

        System.out.println("--- Axios client setup (apiClient.ts) ---");
        System.out.println("  const api = axios.create({");
        System.out.println("    baseURL: process.env.REACT_APP_API_URL || '/api/v1',");
        System.out.println("    timeout: 10_000,");
        System.out.println("    headers: { 'Content-Type': 'application/json' }");
        System.out.println("  });");
        System.out.println("\n  // Attach access token to every request");
        System.out.println("  api.interceptors.request.use(config => {");
        System.out.println("    const token = getAccessToken();  // from memory, NOT localStorage");
        System.out.println("    if (token) config.headers.Authorization = `Bearer ${token}`;");
        System.out.println("    return config;");
        System.out.println("  });");

        System.out.println("\n--- Token lifecycle ---");
        System.out.println("  1. POST /auth/login   -> { accessToken (15min), refreshToken in HttpOnly cookie }");
        System.out.println("  2. Store access token in memory (React state / Zustand).");
        System.out.println("     NEVER store tokens in localStorage (XSS risk).");
        System.out.println("  3. On 401 response: call POST /auth/refresh, then retry original request.");
        System.out.println("  4. On logout: DELETE /auth/session + clear memory.");

        System.out.println("\n--- Response interceptor (error handling) ---");
        System.out.println("  api.interceptors.response.use(");
        System.out.println("    response => response,");
        System.out.println("    async error => {");
        System.out.println("      if (error.response?.status === 401 && !error.config._retry) {");
        System.out.println("        error.config._retry = true;");
        System.out.println("        await refreshTokens();");
        System.out.println("        return api(error.config);  // retry with new token");
        System.out.println("      }");
        System.out.println("      return Promise.reject(error);");
        System.out.println("    }");
        System.out.println("  );");

        System.out.println("\n--- Typed API call example ---");
        System.out.println("  interface User { id: number; name: string; email: string; }");
        System.out.println("  async function getUser(id: number): Promise<User> {");
        System.out.println("    const { data } = await api.get<User>(`/users/${id}`);");
        System.out.println("    return data;");
        System.out.println("  }");
    }
}