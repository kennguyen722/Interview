import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, me, refresh as refreshApi } from "../api/authApi";
import { setAuthToken } from "../api/http";
import type { AuthTokens, UserProfile } from "../types/auth";

type AuthContextValue = {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "module7_tokens";

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (next: AuthTokens | null): void => {
    setTokens(next);
    if (next) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(next));
      setAuthToken(next.accessToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(undefined);
    }
  };

  const hydrate = async (): Promise<void> => {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthTokens;
      persist(parsed);
      const now = Math.floor(Date.now() / 1000);
      let active = parsed;

      if (parsed.accessExpiresAtEpochSeconds <= now + 20) {
        active = await refreshApi(parsed.refreshToken);
        persist(active);
      }

      const profile = await me();
      setUser(profile);
      persist(active);
    } catch {
      persist(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void hydrate();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const nextTokens = await loginApi(username, password);
    persist(nextTokens);
    const profile = await me();
    setUser(profile);
  };

  const logout = (): void => {
    persist(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, tokens, loading, login, logout }),
    [user, tokens, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
