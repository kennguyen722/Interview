import { http } from "./http";
export const login = async (username, password) => {
    const { data } = await http.post("/api/v1/auth/login", { username, password });
    return data;
};
export const refresh = async (refreshToken) => {
    const { data } = await http.post("/api/v1/auth/refresh", { refreshToken });
    return data;
};
export const me = async () => {
    const { data } = await http.get("/api/v1/auth/me");
    return data;
};
