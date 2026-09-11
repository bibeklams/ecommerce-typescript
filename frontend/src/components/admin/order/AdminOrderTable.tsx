import { useAppSelector } from "../../../redux/hooks";

import AdminOrderRow from "./AdminOrderRow";

const AdminOrderTable = () => {
  const { orders, loading, error } = useAppSelector((state) => state.order);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <p className="text-gray-600">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full min-w-[1200px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left">
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Order ID
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Product
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              User Email
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Quantity
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Total
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Order Status
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Payment Method
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Payment Status
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <AdminOrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;
