import { useEffect } from "react";
import SellerDashboardStats from "../../../components/seller/dashboard/SellerDashboardStats";
import SellerRecentOrders from "../../../components/seller/dashboard/SellerRecentOrders";
import SellerTopSellingProducts from "../../../components/seller/dashboard/SellerTopSellingProducts";
import SellerLowStockProducts from "../../../components/seller/dashboard/SellerLowStockProducts";
import SellerSalesOverview from "../../../components/seller/dashboard/SellerSalesOverview";

import { useAppDispatch } from "../../../redux/hooks";
import {
  getSellerDashboardStatsThunk,
  getSellerLowStockProductsThunk,
  getSellerRecentOrdersThunk,
  getSellerSalesOverviewThunk,
  getSellerTopSellingProductsThunk,
} from "../../../redux/slices/sellerDashboardSlice";
const SellerDashboardPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSellerDashboardStatsThunk());
    dispatch(getSellerRecentOrdersThunk());
    dispatch(getSellerTopSellingProductsThunk());
    dispatch(getSellerLowStockProductsThunk());
    dispatch(getSellerSalesOverviewThunk());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <SellerDashboardStats />

        <SellerSalesOverview />

        <SellerRecentOrders />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SellerTopSellingProducts />

          <SellerLowStockProducts />
        </div>
      </div>
    </main>
  );
};

export default SellerDashboardPage;
