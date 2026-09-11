import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllOrderThunk, setPage } from "../../../redux/slices/orderSlice";

import AdminOrderTable from "../../../components/admin/order/AdminOrderTable";
import PageNumber from "../../../components/common/PageNumber";

import type { OrderStatus } from "../../../types/order";

const AdminOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { page, limit, totalPages } = useAppSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");

  // UI only - backend not connected yet
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    console.log("ADMIN ORDER EFFECT:", {
      search,
      page,
      limit,
      orderStatus,
    });

    dispatch(
      getAllOrderThunk({
        search,
        page,
        limit,
        status: orderStatus || undefined,
      }),
    );
  }, [dispatch, search, page, limit, orderStatus]);
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and payment status.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search orders..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {/* Order Status */}
          <select
            value={orderStatus}
            onChange={(event) =>
              setOrderStatus(event.target.value as OrderStatus | "")
            }
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Order Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Payment Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="createdAt">Order Date</option>
            <option value="total">Total Price</option>
            <option value="userName">Customer Name</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Orders */}
      <AdminOrderTable />

      {/* Pagination */}
      {totalPages > 1 && (
        <PageNumber
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default AdminOrdersPage;
