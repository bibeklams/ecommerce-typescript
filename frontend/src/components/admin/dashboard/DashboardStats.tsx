import { useAppSelector } from "../../../redux/hooks";

const DashboardStats = () => {
  const { stats } = useAppSelector((state) => state.dashboard);

  return (
    <div className="space-y-4">
      {/* Revenue */}
      <div className="rounded-lg border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Total Revenue</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          Rs. {Number(stats?.revenue ?? 0).toLocaleString()}
        </p>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Products Available</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {stats?.products ?? 0}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {stats?.orders ?? 0}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {stats?.users ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
