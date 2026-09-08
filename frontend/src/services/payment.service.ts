import api from "./api";

import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
  PaymentListResponse,
  EsewaPaymentData,
} from "../types/payment";

export const createPayment = async (
  orderId: number,
  paymentMethod: PaymentMethod,
): Promise<Payment> => {
  const response = await api.post(`/payments/${orderId}`, {
    method: paymentMethod,
  });

  return response.data.data;
};

export const getMyPayment = async (orderId: number): Promise<Payment> => {
  const response = await api.get(`/payments/${orderId}`);

  return response.data.data;
};

export const getAllPayment = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
  status?: PaymentStatus,
): Promise<PaymentListResponse> => {
  const response = await api.get("/payments", {
    params: { search, page, limit, status },
  });

  return response.data.data;
};

export const initiateEsewaPayment = async (data: {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}): Promise<EsewaPaymentData> => {
  const response = await api.post("/payments/esewa", data);

  return response.data.data;
};

export const updatePaymentStatus = async (
  paymentId: number,
  paymentStatus: PaymentStatus,
): Promise<Payment> => {
  const response = await api.patch(`/payments/${paymentId}/status`, {
    status: paymentStatus,
  });

  return response.data.data;
};

export const requestRefund = async (paymentId: number): Promise<Payment> => {
  const response = await api.post(`/payments/${paymentId}/refund-request`);

  return response.data.data;
};

export const updateRefundStatus = async (
  paymentId: number,
  refundStatus: RefundStatus,
): Promise<Payment> => {
  const response = await api.patch(`/payments/${paymentId}/refund`, {
    status: refundStatus,
  });

  return response.data.data;
};
