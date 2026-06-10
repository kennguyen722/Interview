import { useState } from "react";
import { getOrder } from "../api/orderApi";
import type { Order } from "../types/order";

export const LookupOrderPage = (): JSX.Element => {
  const [id, setId] = useState(1);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (): Promise<void> => {
    setError(null);
    setOrder(null);
    try {
      setOrder(await getOrder(id));
    } catch {
      setError("Order not found or backend unavailable.");
    }
  };

  return (
    <section className="panel">
      <h2>Lookup Order</h2>
      <div className="inline-controls">
        <label>
          Order Id
          <input type="number" value={id} onChange={(e) => setId(Number(e.target.value))} />
        </label>
        <button type="button" onClick={() => void lookup()}>Fetch</button>
      </div>
      {error && <p className="error">{error}</p>}
      {order && <pre className="result">{JSON.stringify(order, null, 2)}</pre>}
    </section>
  );
};
