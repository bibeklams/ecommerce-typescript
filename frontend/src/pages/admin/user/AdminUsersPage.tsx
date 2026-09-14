import { useEffect, useState } from "react";

import AdminUserTable from "../../../components/admin/users/AdminUserTable";
import PageNumber from "../../../components/common/PageNumber";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllUsersThunk } from "../../../redux/slices/userSlice";

const AdminUsersPage = () => {
  const dispatch = useAppDispatch();

  const { users, page, limit, totalPages, loading, error } = useAppSelector(
    (state) => state.user,
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(
      getAllUsersThunk({
        search,
        page,
        limit,
      }),
    );
  }, [dispatch, search, page, limit]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      getAllUsersThunk({
        search,
        page: newPage,
        limit,
      }),
    );
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Users
          </h1>

          <div className="relative w-full sm:w-72">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && <AdminUserTable users={users} />}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center">
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

export default AdminUsersPage;
