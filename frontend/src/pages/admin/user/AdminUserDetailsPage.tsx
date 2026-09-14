import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getSingleUserThunk } from "../../../redux/slices/userSlice";

const roleStyles: Record<string, string> = {
  ADMIN: "bg-gray-900 text-white",
  USER: "bg-gray-100 text-gray-700",
};

const getRoleStyle = (role: string) =>
  roleStyles[role] ?? "bg-gray-100 text-gray-700";

const AdminUserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();

  const dispatch = useAppDispatch();

  const { user, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!userId) return;

    dispatch(getSingleUserThunk(Number(userId)));
  }, [dispatch, userId]);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading user...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">User not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/admin/users"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
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
          Back to Users
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            User Details
          </h1>

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getRoleStyle(
              user.role,
            )}`}
          >
            {user.role.toLowerCase()}
          </span>
        </div>

        <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-6 px-5 py-3.5 text-sm">
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium text-gray-900">{user.name}</dd>
          </div>

          <div className="flex items-center justify-between gap-6 px-5 py-3.5 text-sm">
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{user.email}</dd>
          </div>

          <div className="flex items-center justify-between gap-6 px-5 py-3.5 text-sm">
            <dt className="text-gray-500">Created At</dt>
            <dd className="font-medium text-gray-900">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-6 px-5 py-3.5 text-sm">
            <dt className="text-gray-500">Updated At</dt>
            <dd className="font-medium text-gray-900">
              {new Date(user.updatedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
};

export default AdminUserDetailsPage;
