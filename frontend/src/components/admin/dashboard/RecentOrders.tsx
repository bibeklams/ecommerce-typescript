import { useAppSelector } from "../../../redux/hooks";

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

const RecentOrders = () => {
  const { recentOrders } = useAppSelector((state) => state.dashboard);

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-sm font-medium text-gray-900">Recent Orders</h2>
      </div>

      {recentOrders.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500">
          No recent orders.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Products</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    #{order.id}
                  </td>

                  <td className="px-5 py-3 text-gray-700">{order.user.name}</td>

                  <td className="max-w-[220px] truncate px-5 py-3 text-gray-500">
                    {order.orderItems
                      .map((item) => item.product.name)
                      .join(", ")}
                  </td>

                  <td className="px-5 py-3 text-gray-700">
                    {order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    )}
                  </td>

                  <td className="px-5 py-3 font-medium text-gray-900">
                    Rs. {Number(order.total).toLocaleString()}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
