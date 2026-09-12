import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  getLowStockProducts,
  getRecentOrders,
  getSalesOverview,
  getTopSellingProducts,
} from "../../services/dashboard.service";

import type {
  DashboardStats,
  RecentOrder,
  TopSellingProduct,
  LowStockProduct,
  SalesOverview,
} from "../../types/dashboard";

interface DashboardSlice {
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
  salesOverview: SalesOverview[];

  loading: boolean;
  error: string | null;
}

const initialState: DashboardSlice = {
  stats: null,
  recentOrders: [],
  topSellingProducts: [],
  lowStockProducts: [],
  salesOverview: [],

  loading: false,
  error: null,
};

export const getDashboardStatsThunk = createAsyncThunk<DashboardStats>(
  "dashboard/stats",
  async () => {
    const response = await getDashboardStats();

    return response;
  },
);
export const getLowStockProductsThunk = createAsyncThunk<LowStockProduct[]>(
  "dashboard/low-stock",
  async () => {
    const response = await getLowStockProducts();

    return response;
  },
);
export const getRecentOrdersThunk = createAsyncThunk<RecentOrder[]>(
  "dashboard/recentOrdersThunk",
  async () => {
    const response = await getRecentOrders();

    return response;
  },
);
export const getSalesOverviewThunk = createAsyncThunk<SalesOverview[]>(
  "dashboard/salesOverviewThunk",
  async () => {
    const response = await getSalesOverview();

    return response;
  },
);
export const getTopSellingProductsThunk = createAsyncThunk<TopSellingProduct[]>(
  "dashboard/topSellingProducts",
  async () => {
    const response = await getTopSellingProducts();

    return response;
  },
);
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getDashboardStatsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDashboardStatsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.error = null;
    });
    builder.addCase(getDashboardStatsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
    builder.addCase(getLowStockProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getLowStockProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.lowStockProducts = action.payload;
      state.error = null;
    });
    builder.addCase(getLowStockProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "no data found";
    });
    builder.addCase(getRecentOrdersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRecentOrdersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.recentOrders = action.payload;
      state.error = null;
    });
    builder.addCase(getRecentOrdersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
    builder.addCase(getSalesOverviewThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSalesOverviewThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.salesOverview = action.payload;
      state.error = null;
    });
    builder.addCase(getSalesOverviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
    builder.addCase(getTopSellingProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTopSellingProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.topSellingProducts = action.payload;
      state.error = null;
    });
    builder.addCase(getTopSellingProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No data found";
    });
  },
});

export default dashboardSlice.reducer;
