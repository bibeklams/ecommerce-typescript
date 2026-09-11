import type { ChangeEvent } from "react";

import { useAppDispatch } from "../../../redux/hooks";

import { updateOrderStatusThunk } from "../../../redux/slices/orderSlice";

import type { Order, OrderStatus } from "../../../types/order";

interface OrderStatusSelectProps {
  order: Order;
}

const OrderStatusSelect = ({ order }: OrderStatusSelectProps) => {
  const dispatch = useAppDispatch();

  const handleStatusChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value as OrderStatus;

    try {
      await dispatch(
        updateOrderStatusThunk({
          orderId: order.id,
          status,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <select
      value={order.status}
      onChange={handleStatusChange}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="PENDING">Pending</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
};

export default OrderStatusSelect;
