export type PaymentMethod = "CASH_ON_DELIVERY" | "ESEWA";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type RefundStatus =
  | "NONE"
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "REFUNDED";

export interface EsewaPaymentData {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}
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
