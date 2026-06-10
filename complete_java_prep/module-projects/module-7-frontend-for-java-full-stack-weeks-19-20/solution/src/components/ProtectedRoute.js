import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx("div", { className: "screen-center", children: "Loading session..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
};
