import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Shell } from "./components/Shell";
import { CreateOrderPage } from "./pages/CreateOrderPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { LookupOrderPage } from "./pages/LookupOrderPage";
import { TopCustomersPage } from "./pages/TopCustomersPage";
const AppShell = () => (_jsx(ProtectedRoute, { children: _jsx(Shell, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/orders/new", element: _jsx(CreateOrderPage, {}) }), _jsx(Route, { path: "/orders/lookup", element: _jsx(LookupOrderPage, {}) }), _jsx(Route, { path: "/reports/top-customers", element: _jsx(TopCustomersPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/*", element: _jsx(AppShell, {}) })] }) }) }));
}
