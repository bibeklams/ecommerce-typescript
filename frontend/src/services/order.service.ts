import api from "./api";

import type { Order, OrderStatus, OrderListResponse } from "../types/order";
import type { PaymentStatus } from "../types/payment";

export const createOrder = async (data: {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}): Promise<Order> => {
  const response = await api.post("/orders", data);

  return response.data.data;
};

export const getAllOrders = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
  status?: OrderStatus,
  paymentStatus?: PaymentStatus,
  sortOrder: "asc" | "desc" = "desc",
): Promise<OrderListResponse> => {
  const response = await api.get("/orders", {
    params: {
      search,
      page,
      limit,
      status,
      paymentStatus,
      sortOrder,
    },
  });

  return response.data.data;
};

export const getAllSellerOrders = async (
  search: string = "",
  page: number = 1,
  limit: number = 10,
  status?: OrderStatus,
  paymentStatus?: PaymentStatus,
  sortOrder: "asc" | "desc" = "desc",
): Promise<OrderListResponse> => {
  const response = await api.get("/orders/seller", {
    params: {
      search,
      page,
      limit,
      status,
      paymentStatus,
      sortOrder,
    },
  });

  return response.data.data;
};

export const getMyOrders = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
): Promise<OrderListResponse> => {
  const response = await api.get("/orders/my", {
    params: { search, page, limit },
  });

  return response.data.data;
};

export const getMyOrderById = async (orderId: number): Promise<Order> => {
  const response = await api.get(`/orders/my/${orderId}`);

  return response.data.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);

  return response.data.data;
};

export const getSellerOrderById = async (orderId: number): Promise<Order> => {
  const response = await api.get(`/orders/seller/${orderId}`);

  return response.data.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
): Promise<Order> => {
  const response = await api.put(`/orders/${orderId}/status`, {
    status,
  });

  return response.data.data;
};

export const updateSellerOrderStatus = async (
  orderId: number,
  status: OrderStatus,
): Promise<Order> => {
  const response = await api.put(`/orders/seller/${orderId}/status`, {
    status,
  });

  return response.data.data;
};

export const cancelOrder = async (orderId: number): Promise<Order> => {
  const response = await api.put(`/orders/${orderId}/cancel`);

  return response.data.data;
};

export const cancelSellerOrder = async (orderId: number): Promise<Order> => {
  const response = await api.put(`/orders/seller/${orderId}/cancel`);

  return response.data.data;
};
export const countOrder = async (): Promise<number> => {
  const response = await api.get("/orders/count");

  return response.data.data;
};
