import { useState } from "react";
import { createOrder } from "../api/orderApi";
import type { Order } from "../types/order";

export const CreateOrderPage = (): JSX.Element => {
  const [customerId, setCustomerId] = useState(1);
  const [referenceCode, setReferenceCode] = useState("ORD-FE-1001");
  const [totalAmount, setTotalAmount] = useState(150);
  const [result, setResult] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    setResult(null);
    try {
      const data = await createOrder({ customerId, referenceCode, totalAmount });
      setResult(data);
    } catch {
      setError("Order creation failed.");
    }
  };

  return (
    <section className="panel">
      <h2>Create Order</h2>
      <form className="form-grid" onSubmit={submit}>
        <label>
          Customer Id
          <input type="number" value={customerId} onChange={(e) => setCustomerId(Number(e.target.value))} />
        </label>
        <label>
          Reference Code
          <input value={referenceCode} onChange={(e) => setReferenceCode(e.target.value)} />
        </label>
        <label>
          Total Amount
          <input type="number" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <pre className="result">{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
};
