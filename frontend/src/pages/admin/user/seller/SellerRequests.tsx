import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getAllUsersThunk } from "../../../../redux/slices/userSlice";

import SellerRequestTable from "../../../../components/admin/seller request/SellerRequestTable";

const SellerRequests = () => {
  const dispatch = useAppDispatch();

  const { users, loading, error } = useAppSelector((state) => state.user);

  const fetchUsers = () => {
    dispatch(
      getAllUsersThunk({
        page: 1,
        limit: 10,
      }),
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  const sellerRequests = users.filter(
    (user) => user.sellerStatus === "PENDING",
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Seller Requests</h1>

      <p className="mt-1 text-sm text-gray-500">
        Review and manage users who want to become sellers.
      </p>

      <main className="mt-6">
        <SellerRequestTable
          users={sellerRequests}
          loading={loading}
          error={error}
          onRequestUpdated={fetchUsers}
        />
      </main>
    </div>
  );
};

export default SellerRequests;
