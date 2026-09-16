import { useAppDispatch } from "../../../redux/hooks";
import {
  approveSellerThunk,
  rejectSellerThunk,
} from "../../../redux/slices/sellerSlice";
import type { User } from "../../../types/user";
import toast from "react-hot-toast";

interface SellerRequestTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
}

const SellerRequestTable = ({
  users,
  loading,
  error,
}: SellerRequestTableProps) => {
  const dispatch = useAppDispatch();

  const handleApprove = async (userId: number) => {
    const result = await dispatch(approveSellerThunk(userId));

    if (approveSellerThunk.fulfilled.match(result)) {
      toast.success("Seller approved successfully");
    } else {
      toast.error(result.error.message ?? "Failed to approve seller");
    }
  };

  const handleReject = async (userId: number) => {
    const result = await dispatch(rejectSellerThunk(userId));

    if (rejectSellerThunk.fulfilled.match(result)) {
      toast.success("Seller request rejected");
    } else {
      toast.error(result.error.message ?? "Failed to reject seller request");
    }
  };

  if (loading) {
    return <p>Loading seller requests...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (users.length === 0) {
    return <p>No pending seller requests.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-900">
              Name
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-900">
              Email
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-900">
              Seller Status
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="transition hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {user.name}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>

              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  {user.sellerStatus}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleApprove(user.id)}
                    disabled={loading}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(user.id)}
                    disabled={loading}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerRequestTable;
