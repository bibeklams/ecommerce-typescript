import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import { cancelOrderThunk } from "../../../redux/slices/orderSlice";
import type { Order } from "../../../types/order";

interface OrderCardProps {
  order: Order;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-600/20",
  PROCESSING: "bg-blue-50 text-blue-700 ring-blue-600/20",
  SHIPPED: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
};

const getStatusStyle = (status: string) =>
  statusStyles[status] ?? "bg-gray-50 text-gray-700 ring-gray-600/20";

const OrderCard = ({ order }: OrderCardProps) => {
  const dispatch = useAppDispatch();

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      await dispatch(cancelOrderThunk(order.id)).unwrap();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-300">
      {/* Top row: back to home + status */}
      <div className="mb-3 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to home"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 010 1.06L9.06 10l3.73 3.71a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyle(
            order.status,
          )}`}
        >
          {order.status.toLowerCase()}
        </span>
      </div>

      <h3 className="text-sm font-medium text-gray-900">Order #{order.id}</h3>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Date</dt>
          <dd className="text-gray-900">
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-500">Items</dt>
          <dd className="text-gray-900">{order.orderItems.length}</dd>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-2.5">
          <dt className="font-medium text-gray-900">Total</dt>
          <dd className="font-semibold text-gray-900">
            Rs. {Number(order.total).toLocaleString()}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-4">
        <Link
          to={`/orders/${order.id}`}
          className="rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-gray-800"
        >
          View
        </Link>

        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Cancel order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
