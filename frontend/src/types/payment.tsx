export type PaymentMethod = "CASH_ON_DELIVERY" | "ESEWA";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type RefundStatus =
  | "NONE"
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "REFUNDED";

export interface PaymentListResponse {
  payments: Payment[];
  page: number;
  limit: number;
  totalPayments: number;
  totalPages: number;
}
export interface Payment {
  id: number;
  orderId: number;
  amount: number;

  method: PaymentMethod;
  status: PaymentStatus;

  transactionId: string | null;

  refundStatus: RefundStatus;

  createdAt: string;
  updatedAt: string;
}
