import { http } from "./http";
export const createOrder = async (payload) => {
    const { data } = await http.post("/api/v1/orders", payload);
    return data;
};
export const getOrder = async (id) => {
    const { data } = await http.get(`/api/v1/orders/${id}`);
    return data;
};
export const getTopCustomers = async (from, to, limit = 5) => {
    const { data } = await http.get("/api/v1/orders/reports/top-customers", {
        params: { from, to, limit }
    });
    return data;
};
