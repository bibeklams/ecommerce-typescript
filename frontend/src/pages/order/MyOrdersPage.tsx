import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getMyOrderThunk } from "../../redux/slices/orderSlice";
import OrderList from "../../components/user/order/OrderList";
import PageNumber from "../../components/common/PageNumber";

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { page, limit, totalPages } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(
      getMyOrderThunk({
        page,
        limit,
      }),
    );
  }, [dispatch, page, limit]);

  const handlePageChange = (newPage: number) => {
    dispatch(
      getMyOrderThunk({
        page: newPage,
        limit,
      }),
    );
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
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
          Home
        </Link>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
          My Orders
        </h1>

        <OrderList />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <PageNumber
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrdersPage;
