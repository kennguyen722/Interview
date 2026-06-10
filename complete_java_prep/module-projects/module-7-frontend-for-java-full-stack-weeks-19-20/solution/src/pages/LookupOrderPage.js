import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { getOrder } from "../api/orderApi";
export const LookupOrderPage = () => {
    const [id, setId] = useState(1);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const lookup = async () => {
        setError(null);
        setOrder(null);
        try {
            setOrder(await getOrder(id));
        }
        catch {
            setError("Order not found or backend unavailable.");
        }
    };
    return (_jsxs("section", { className: "panel", children: [_jsx("h2", { children: "Lookup Order" }), _jsxs("div", { className: "inline-controls", children: [_jsxs("label", { children: ["Order Id", _jsx("input", { type: "number", value: id, onChange: (e) => setId(Number(e.target.value)) })] }), _jsx("button", { type: "button", onClick: () => void lookup(), children: "Fetch" })] }), error && _jsx("p", { className: "error", children: error }), order && _jsx("pre", { className: "result", children: JSON.stringify(order, null, 2) })] }));
};
