import AdminUserRow from "./AdminUserRow";

import type { User } from "../../../types/user";

interface AdminUserTableProps {
  users: User[];
}

const AdminUserTable = ({ users }: AdminUserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 py-16 text-center">
        <p className="text-sm text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-500">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Created At</th>
            <th className="px-5 py-3 font-medium">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <AdminUserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
