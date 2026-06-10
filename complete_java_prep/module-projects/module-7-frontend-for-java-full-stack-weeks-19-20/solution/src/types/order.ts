export type TopCustomer = {
  customerId: number;
  customerName: string;
  customerEmail: string;
  totalSpent: number;
  orderCount: number;
};

export type CreateOrderRequest = {
  customerId: number;
  referenceCode: string;
  totalAmount: number;
};

export type Order = {
  id: number;
  customerId: number;
  customerName: string;
  referenceCode: string;
  status: "CREATED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
};
