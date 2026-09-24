import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getSellerDashboardStats,
  getSellerLowStockProducts,
  getSellerRecentOrders,
  getSellerSalesOverview,
  getSellerTopSellingProducts,
} from "../../services/dashboard.service";

import type {
  SellerDashboardStats,
  RecentOrder,
  TopSellingProduct,
  LowStockProduct,
  SalesOverview,
} from "../../types/dashboard";

interface DashboardSlice {
  stats: SellerDashboardStats | null;
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

// ==================== THUNKS ====================

export const getSellerDashboardStatsThunk =
  createAsyncThunk<SellerDashboardStats>(
    "dashboard/seller/stats",
    async (_, thunkAPI) => {
      try {
        return await getSellerDashboardStats();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard stats",
        );
      }
    },
  );

export const getSellerRecentOrdersThunk = createAsyncThunk<RecentOrder[]>(
  "dashboard/seller/recentOrders",
  async (_, thunkAPI) => {
    try {
      return await getSellerRecentOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch recent orders",
      );
    }
  },
);

export const getSellerTopSellingProductsThunk = createAsyncThunk<
  TopSellingProduct[]
>("dashboard/seller/topSellingProducts", async (_, thunkAPI) => {
  try {
    return await getSellerTopSellingProducts();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to fetch top selling products",
    );
  }
});

export const getSellerLowStockProductsThunk = createAsyncThunk<
  LowStockProduct[]
>("dashboard/seller/lowStockProducts", async (_, thunkAPI) => {
  try {
    return await getSellerLowStockProducts();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to fetch low stock products",
    );
  }
});

export const getSellerSalesOverviewThunk = createAsyncThunk<SalesOverview[]>(
  "dashboard/seller/salesOverview",
  async (_, thunkAPI) => {
    try {
      return await getSellerSalesOverview();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch sales overview",
      );
    }
  },
);

// ==================== SLICE ====================

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // ==================== STATS ====================

    builder.addCase(getSellerDashboardStatsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSellerDashboardStatsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.error = null;
    });

    builder.addCase(getSellerDashboardStatsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ??
        action.error.message ??
        "Failed to fetch dashboard stats";
    });

    // ==================== RECENT ORDERS ====================

    builder.addCase(getSellerRecentOrdersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSellerRecentOrdersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.recentOrders = action.payload;
      state.error = null;
    });

    builder.addCase(getSellerRecentOrdersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ??
        action.error.message ??
        "Failed to fetch recent orders";
    });

    // ==================== TOP SELLING PRODUCTS ====================

    builder.addCase(getSellerTopSellingProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      getSellerTopSellingProductsThunk.fulfilled,
      (state, action) => {
        state.loading = false;
        state.topSellingProducts = action.payload;
        state.error = null;
      },
    );

    builder.addCase(
      getSellerTopSellingProductsThunk.rejected,
      (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Failed to fetch top selling products";
      },
    );

    // ==================== LOW STOCK PRODUCTS ====================

    builder.addCase(getSellerLowStockProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      getSellerLowStockProductsThunk.fulfilled,
      (state, action) => {
        state.loading = false;
        state.lowStockProducts = action.payload;
        state.error = null;
      },
    );

    builder.addCase(
      getSellerLowStockProductsThunk.rejected,
      (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Failed to fetch low stock products";
      },
    );

    // ==================== SALES OVERVIEW ====================

    builder.addCase(getSellerSalesOverviewThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSellerSalesOverviewThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.salesOverview = action.payload;
      state.error = null;
    });

    builder.addCase(getSellerSalesOverviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ??
        action.error.message ??
        "Failed to fetch sales overview";
    });
  },
});

export default dashboardSlice.reducer;
