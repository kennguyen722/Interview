import { http } from "./http";
import type { AuthTokens, UserProfile } from "../types/auth";

export const login = async (username: string, password: string): Promise<AuthTokens> => {
  const { data } = await http.post<AuthTokens>("/api/v1/auth/login", { username, password });
  return data;
};

export const refresh = async (refreshToken: string): Promise<AuthTokens> => {
  const { data } = await http.post<AuthTokens>("/api/v1/auth/refresh", { refreshToken });
  return data;
};

export const me = async (): Promise<UserProfile> => {
  const { data } = await http.get<UserProfile>("/api/v1/auth/me");
  return data;
};
