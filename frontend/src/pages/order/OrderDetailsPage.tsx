import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getMyOrderByIdThunk } from "../../redux/slices/orderSlice";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

const getStatusStyle = (status: string) =>
  statusStyles[status?.toLowerCase()] ??
  "bg-gray-50 text-gray-700 ring-gray-600/20";

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const dispatch = useAppDispatch();

  const { selectedOrder, loading, error } = useAppSelector(
    (state) => state.order,
  );

  useEffect(() => {
    if (!orderId) return;

    dispatch(getMyOrderByIdThunk(Number(orderId)));
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-gray-100" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-32 rounded-lg bg-gray-100" />
              <div className="h-32 rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-4">
              <div className="h-40 rounded-lg bg-gray-100" />
              <div className="h-40 rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <Link
            to="/my-order"
            className="mt-4 inline-block text-sm font-medium text-gray-900 underline underline-offset-4"
          >
            Back to my orders
          </Link>
        </div>
      </main>
    );
  }

  if (!selectedOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Order not found.</p>
          <Link
            to="/my-order"
            className="mt-4 inline-block text-sm font-medium text-gray-900 underline underline-offset-4"
          >
            Back to my orders
          </Link>
        </div>
      </main>
    );
  }

  const order = selectedOrder;

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Order Header */}
        <div className="mb-8 flex flex-col gap-3 border-b border-gray-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/my-order"
              className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
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
              My Orders
            </Link>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Order #{order.id}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyle(
              order.status,
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Items */}
          <section className="lg:col-span-2">
            <h2 className="mb-4 text-sm font-medium text-gray-900">
              Items ({order.orderItems.length})
            </h2>

            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
              {order.orderItems.map((item) => {
                const image = item.product.gallery?.images?.[0]?.url;

                return (
                  <div key={item.id} className="flex gap-4 p-4 sm:p-5">
                    {/* Product Image */}
                    {image ? (
                      <img
                        src={image}
                        alt={item.product.name}
                        className="h-20 w-20 shrink-0 rounded-md border border-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-gray-200 text-xs text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h3>

                      {item.product.category && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {item.product.category.name}
                        </p>
                      )}

                      <div className="mt-2 text-xs text-gray-500">
                        Rs. {Number(item.price).toLocaleString()} &times;{" "}
                        {item.quantity}
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        Rs. {Number(item.total).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Side */}
          <aside className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-lg border border-gray-200 p-5">
              <h2 className="mb-4 text-sm font-medium text-gray-900">
                Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Products</span>
                  <span className="text-gray-900">
                    {order.orderItems.length}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    Rs. {Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="rounded-lg border border-gray-200 p-5">
              <h2 className="mb-4 text-sm font-medium text-gray-900">
                Shipping details
              </h2>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Name</dt>
                  <dd className="mt-0.5 text-gray-900">{order.shippingName}</dd>
                </div>

                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="mt-0.5 text-gray-900">
                    {order.shippingPhone}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Address</dt>
                  <dd className="mt-0.5 text-gray-900">
                    {order.shippingAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailsPage;
