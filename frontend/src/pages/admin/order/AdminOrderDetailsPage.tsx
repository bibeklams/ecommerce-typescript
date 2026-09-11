import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getOrderByIdThunk } from "../../../redux/slices/orderSlice";
import OrderStatusSelect from "../../../components/admin/order/OrderStatusSelect";

const AdminOrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const dispatch = useAppDispatch();

  const { selectedOrder, loading, error } = useAppSelector(
    (state) => state.order,
  );

  useEffect(() => {
    if (!orderId) return;

    dispatch(getOrderByIdThunk(Number(orderId)));
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Loading order...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!selectedOrder) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Order not found.</p>
      </main>
    );
  }

  const order = selectedOrder;

  const payment = order.payments?.[0];

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Orders
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Order #{order.id}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <OrderStatusSelect order={order} />
      </div>

      {/* Customer + Order Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Customer Information
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-900">
                {order.user?.name ?? "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {order.user?.email ?? "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">User ID</p>
              <p className="font-medium text-gray-900">#{order.userId}</p>
            </div>
          </div>
        </section>

        {/* Order Information */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Order Information
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium text-gray-900">#{order.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-gray-900">{order.status}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated</span>
              <span className="text-gray-900">
                {new Date(order.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Products */}
      <section className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {order.orderItems.map((item) => {
            const image = item.product?.gallery?.images?.[0]?.url;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
              >
                {/* Product Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {image ? (
                    <img
                      src={image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Information */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Category: {item.product.category?.name ?? "N/A"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Price: Rs. {Number(item.price).toLocaleString()}
                  </p>
                </div>

                {/* Quantity */}
                <div className="text-sm text-gray-600">
                  Quantity:{" "}
                  <span className="font-medium text-gray-900">
                    {item.quantity}
                  </span>
                </div>

                {/* Item Total */}
                <div className="text-sm font-semibold text-gray-900 sm:w-32 sm:text-right">
                  Rs. {Number(item.total).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shipping + Payment */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shipping */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Shipping Information
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{order.shippingName}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{order.shippingPhone}</p>
            </div>

            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-900">
                {order.shippingAddress}
              </p>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Payment Information
          </h2>

          {payment ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>

                <span className="font-medium text-gray-900">
                  {payment.method}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>

                <span className="font-medium text-gray-900">
                  {payment.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>

                <span className="max-w-[200px] truncate font-medium text-gray-900">
                  {payment.transactionId ?? "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>

                <span className="font-medium text-gray-900">
                  Rs. {Number(payment.amount).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Refund Status</span>

                <span className="font-medium text-gray-900">
                  {payment.refundStatus}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No payment information available.
            </p>
          )}
        </section>
      </div>

      {/* Order Total */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Order Total
          </span>

          <span className="text-xl font-bold text-gray-900">
            Rs. {Number(order.total).toLocaleString()}
          </span>
        </div>
      </section>
    </main>
  );
};

export default AdminOrderDetailsPage;
