import { Link } from "react-router-dom";

import { useAppDispatch } from "../../../redux/hooks";
import { deleteUserThunk } from "../../../redux/slices/userSlice";

import type { User } from "../../../types/user";

interface AdminUserRowProps {
  user: User;
}

const roleStyles: Record<string, string> = {
  ADMIN: "bg-gray-900 text-white",
  USER: "bg-gray-100 text-gray-700",
};

const getRoleStyle = (role: string) =>
  roleStyles[role] ?? "bg-gray-100 text-gray-700";

const AdminUserRow = ({ user }: AdminUserRowProps) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteUserThunk(user.id)).unwrap();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>

      <td className="px-5 py-3 text-gray-500">{user.email}</td>

      <td className="px-5 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getRoleStyle(
            user.role,
          )}`}
        >
          {user.role.toLowerCase()}
        </span>
      </td>

      <td className="px-5 py-3 text-gray-500">
        {new Date(user.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      <td className="px-5 py-3">
        <div className="flex items-center gap-4">
          <Link
            to={`/admin/users/${user.id}`}
            className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline"
          >
            View
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminUserRow;
