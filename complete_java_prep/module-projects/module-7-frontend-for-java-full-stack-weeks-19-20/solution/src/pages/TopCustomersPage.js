import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { getTopCustomers } from "../api/orderApi";
export const TopCustomersPage = () => {
    const [from, setFrom] = useState("2026-01-01");
    const [to, setTo] = useState("2026-12-31");
    const [rows, setRows] = useState([]);
    const load = async () => {
        setRows(await getTopCustomers(from, to));
    };
    return (_jsxs("section", { className: "panel", children: [_jsx("h2", { children: "Top Customers Report" }), _jsxs("div", { className: "inline-controls", children: [_jsxs("label", { children: ["From", _jsx("input", { type: "date", value: from, onChange: (e) => setFrom(e.target.value) })] }), _jsxs("label", { children: ["To", _jsx("input", { type: "date", value: to, onChange: (e) => setTo(e.target.value) })] }), _jsx("button", { type: "button", onClick: () => void load(), children: "Run Report" })] }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Customer" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Total Spent" }), _jsx("th", { children: "Orders" })] }) }), _jsx("tbody", { children: rows.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: row.customerName }), _jsx("td", { children: row.customerEmail }), _jsxs("td", { children: ["$", row.totalSpent] }), _jsx("td", { children: row.orderCount })] }, row.customerId))) })] })] }));
};
