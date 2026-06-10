import { useState } from "react";
import { getTopCustomers } from "../api/orderApi";
import type { TopCustomer } from "../types/order";

export const TopCustomersPage = (): JSX.Element => {
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");
  const [rows, setRows] = useState<TopCustomer[]>([]);

  const load = async (): Promise<void> => {
    setRows(await getTopCustomers(from, to));
  };

  return (
    <section className="panel">
      <h2>Top Customers Report</h2>
      <div className="inline-controls">
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button type="button" onClick={() => void load()}>Run Report</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Total Spent</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.customerId}>
              <td>{row.customerName}</td>
              <td>{row.customerEmail}</td>
              <td>${row.totalSpent}</td>
              <td>{row.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
