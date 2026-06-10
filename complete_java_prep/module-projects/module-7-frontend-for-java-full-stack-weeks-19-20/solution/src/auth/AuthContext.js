import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, me, refresh as refreshApi } from "../api/authApi";
import { setAuthToken } from "../api/http";
const AuthContext = createContext(undefined);
const TOKEN_KEY = "module7_tokens";
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(null);
    const [loading, setLoading] = useState(true);
    const persist = (next) => {
        setTokens(next);
        if (next) {
            localStorage.setItem(TOKEN_KEY, JSON.stringify(next));
            setAuthToken(next.accessToken);
        }
        else {
            localStorage.removeItem(TOKEN_KEY);
            setAuthToken(undefined);
        }
    };
    const hydrate = async () => {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (!raw) {
            setLoading(false);
            return;
        }
        try {
            const parsed = JSON.parse(raw);
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
        }
        catch {
            persist(null);
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void hydrate();
    }, []);
    const login = async (username, password) => {
        const nextTokens = await loginApi(username, password);
        persist(nextTokens);
        const profile = await me();
        setUser(profile);
    };
    const logout = () => {
        persist(null);
        setUser(null);
    };
    const value = useMemo(() => ({ user, tokens, loading, login, logout }), [user, tokens, loading]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
