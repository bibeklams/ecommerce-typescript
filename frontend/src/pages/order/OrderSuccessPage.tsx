import { Link, useParams } from "react-router-dom";

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        {/* Success Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Order Successful!
        </h1>

        {/* Message */}
        <p className="mb-6 text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Order ID</p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              #{orderId}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {orderId && (
            <Link
              to={`/orders/${orderId}`}
              className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View Order
            </Link>
          )}

          <Link
            to="/"
            className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
