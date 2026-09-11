import { Link } from "react-router-dom";

import OrderStatusSelect from "./OrderStatusSelect";
import PaymentStatusSelect from "./PaymentStatusSelect";

import type { Order } from "../../../types/order";

interface AdminOrderRowProps {
  order: Order;
}

const AdminOrderRow = ({ order }: AdminOrderRowProps) => {
  const payment = order.payments?.[0];

  const totalQuantity = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const productNames = order.orderItems
    .map((item) => item.product.name)
    .join(", ");

  const paymentMethod = payment
    ? payment.method === "CASH_ON_DELIVERY"
      ? "Cash on Delivery"
      : "eSewa"
    : "N/A";

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      {/* Order ID */}
      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
        #{order.id}
      </td>

      {/* Products */}
      <td className="max-w-[220px] px-5 py-4 text-sm text-gray-700">
        <p className="truncate" title={productNames}>
          {productNames || "N/A"}
        </p>
      </td>

      {/* Customer Email */}
      <td className="px-5 py-4 text-sm text-gray-600">
        {order.user?.email ?? "N/A"}
      </td>

      {/* Quantity */}
      <td className="px-5 py-4 text-sm text-gray-700">{totalQuantity}</td>

      {/* Total Price */}
      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
        Rs. {Number(order.total).toLocaleString()}
      </td>

      {/* Order Status */}
      <td className="px-5 py-4">
        <OrderStatusSelect order={order} />
      </td>

      {/* Payment Method */}
      <td className="px-5 py-4 text-sm text-gray-700">{paymentMethod}</td>

      {/* Payment Status */}
      <td className="px-5 py-4">
        {payment ? (
          <PaymentStatusSelect payment={payment} />
        ) : (
          <span className="text-sm text-gray-400">No payment</span>
        )}
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <Link
          to={`/admin/orders/${order.id}`}
          className="inline-block rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export default AdminOrderRow;
