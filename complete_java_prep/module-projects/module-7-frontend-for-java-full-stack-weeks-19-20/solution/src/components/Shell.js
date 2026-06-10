import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export const Shell = ({ children }) => {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "layout", children: [_jsxs("header", { className: "topbar", children: [_jsxs("div", { children: [_jsx("h1", { children: "Module 7 Frontend Console" }), _jsx("p", { children: "Typed client for secure Java backend APIs" })] }), _jsxs("div", { className: "user-box", children: [_jsx("span", { children: user?.username }), _jsx("button", { type: "button", onClick: logout, children: "Sign Out" })] })] }), _jsxs("nav", { className: "sidebar", children: [_jsx(NavLink, { to: "/", children: "Overview" }), _jsx(NavLink, { to: "/orders/new", children: "Create Order" }), _jsx(NavLink, { to: "/orders/lookup", children: "Lookup Order" }), _jsx(NavLink, { to: "/reports/top-customers", children: "Top Customers" })] }), _jsx("main", { className: "content", children: children })] }));
};
