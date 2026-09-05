import type { OrderItem } from "./orderItem";
import type { User } from "./user";
import type { Payment } from "./payment";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderListResponse {
  orders: Order[];
  page: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
}
export interface Order {
  id: number;
  userId: number;

  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;

  total: number;
  status: OrderStatus;

  user: User;
  orderItems: OrderItem[];
  payments: Payment[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
