import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("User@123");
    const [error, setError] = useState(null);
    const submit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            await login(username, password);
            navigate("/");
        }
        catch {
            setError("Login failed. Verify credentials and backend availability.");
        }
    };
    return (_jsx("div", { className: "login-wrap", children: _jsxs("form", { className: "panel", onSubmit: submit, children: [_jsx("h2", { children: "Sign In" }), _jsx("p", { children: "Authenticate with the Module 6 backend and open the app dashboard." }), _jsxs("label", { children: ["Username", _jsx("input", { value: username, onChange: (e) => setUsername(e.target.value) })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value) })] }), error && _jsx("p", { className: "error", children: error }), _jsx("button", { type: "submit", children: "Continue" })] }) }));
};
