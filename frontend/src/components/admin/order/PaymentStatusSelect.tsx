import { useState } from "react";

import type { Payment } from "../../../types/payment";
import { updatePaymentStatus } from "../../../services/payment.service";

interface PaymentStatusSelectProps {
  payment: Payment;
}

const PaymentStatusSelect = ({ payment }: PaymentStatusSelectProps) => {
  const [status, setStatus] = useState(payment.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = event.target.value as Payment["status"];

    if (newStatus === status) {
      return;
    }

    const previousStatus = status;

    setStatus(newStatus);
    setIsUpdating(true);

    try {
      await updatePaymentStatus(payment.id, newStatus);
    } catch (error) {
      console.error("Failed to update payment status:", error);

      // Roll back UI if API request fails
      setStatus(previousStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ${
        status === "PAID"
          ? "border-green-200 bg-green-50 text-green-700"
          : status === "FAILED"
            ? "border-red-200 bg-red-50 text-red-700"
            : status === "REFUNDED"
              ? "border-purple-200 bg-purple-50 text-purple-700"
              : "border-yellow-200 bg-yellow-50 text-yellow-700"
      }`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="FAILED">FAILED</option>
      <option value="REFUNDED">REFUNDED</option>
    </select>
  );
};

export default PaymentStatusSelect;
