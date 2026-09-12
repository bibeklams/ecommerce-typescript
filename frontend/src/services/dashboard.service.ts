import api from "./api";
import type {
  DashboardStats,
  RecentOrder,
  TopSellingProduct,
  LowStockProduct,
  SalesOverview,
} from "../types/dashboard";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");

  return response.data.data;
};

export const getRecentOrders = async (): Promise<RecentOrder[]> => {
  const response = await api.get("/dashboard/recent-orders");

  return response.data.data;
};

export const getTopSellingProducts = async (): Promise<TopSellingProduct[]> => {
  const response = await api.get("/dashboard/top-products");

  return response.data.data;
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const response = await api.get("/dashboard/low-stock");

  return response.data.data;
};

export const getSalesOverview = async (): Promise<SalesOverview[]> => {
  const response = await api.get("/dashboard/sales");

  return response.data.data;
};
