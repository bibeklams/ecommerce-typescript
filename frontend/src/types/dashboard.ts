import type { Payment } from "./payment";
import type { OrderStatus } from "./order";
export interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
}

export interface RecentOrder {
  id: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: {
    productId: number;
    quantity: number;
    product: {
      id: number;

      name: string;
    };
  }[];
  payments: Payment[];
}
