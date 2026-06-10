import { http } from "./http";
import type { CreateOrderRequest, Order, TopCustomer } from "../types/order";

export const createOrder = async (payload: CreateOrderRequest): Promise<Order> => {
  const { data } = await http.post<Order>("/api/v1/orders", payload);
  return data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const { data } = await http.get<Order>(`/api/v1/orders/${id}`);
  return data;
};

export const getTopCustomers = async (from: string, to: string, limit = 5): Promise<TopCustomer[]> => {
  const { data } = await http.get<TopCustomer[]>("/api/v1/orders/reports/top-customers", {
    params: { from, to, limit }
  });
  return data;
};
