import { useEffect } from "react";
import DashboardStats from "../../../components/admin/dashboard/DashboardStats";
import RecentOrders from "../../../components/admin/dashboard/RecentOrders";
import TopSellingProducts from "../../../components/admin/dashboard/TopSellingProducts";
import LowStockProducts from "../../../components/admin/dashboard/LowStockProducts";
import SalesOverview from "../../../components/admin/dashboard/SalesOverview";

import { useAppDispatch } from "../../../redux/hooks";
import {
  getDashboardStatsThunk,
  getRecentOrdersThunk,
  getTopSellingProductsThunk,
  getLowStockProductsThunk,
  getSalesOverviewThunk,
} from "../../../redux/slices/dashboardSlice";
const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDashboardStatsThunk());
    dispatch(getRecentOrdersThunk());
    dispatch(getTopSellingProductsThunk());
    dispatch(getLowStockProductsThunk());
    dispatch(getSalesOverviewThunk());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <DashboardStats />

        <SalesOverview />

        <RecentOrders />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopSellingProducts />

          <LowStockProducts />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
