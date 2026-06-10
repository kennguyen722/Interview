import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { createOrder } from "../api/orderApi";
export const CreateOrderPage = () => {
    const [customerId, setCustomerId] = useState(1);
    const [referenceCode, setReferenceCode] = useState("ORD-FE-1001");
    const [totalAmount, setTotalAmount] = useState(150);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const submit = async (event) => {
        event.preventDefault();
        setError(null);
        setResult(null);
        try {
            const data = await createOrder({ customerId, referenceCode, totalAmount });
            setResult(data);
        }
        catch {
            setError("Order creation failed.");
        }
    };
    return (_jsxs("section", { className: "panel", children: [_jsx("h2", { children: "Create Order" }), _jsxs("form", { className: "form-grid", onSubmit: submit, children: [_jsxs("label", { children: ["Customer Id", _jsx("input", { type: "number", value: customerId, onChange: (e) => setCustomerId(Number(e.target.value)) })] }), _jsxs("label", { children: ["Reference Code", _jsx("input", { value: referenceCode, onChange: (e) => setReferenceCode(e.target.value) })] }), _jsxs("label", { children: ["Total Amount", _jsx("input", { type: "number", step: "0.01", value: totalAmount, onChange: (e) => setTotalAmount(Number(e.target.value)) })] }), _jsx("button", { type: "submit", children: "Submit" })] }), error && _jsx("p", { className: "error", children: error }), result && (_jsx("pre", { className: "result", children: JSON.stringify(result, null, 2) }))] }));
};
