import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { Order, OrderListResponse, OrderStatus } from "../../types/order";

import type { PaymentStatus } from "../../types/payment";

import {
  createOrder,
  getMyOrderById,
  getAllOrders,
  getMyOrders,
  getAllSellerOrders,
  cancelSellerOrder,
  updateSellerOrderStatus,
  getSellerOrderById,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  countOrder,
} from "../../services/order.service";

interface OrderSlice {
  orders: Order[];
  selectedOrder: Order | null;
  totalOrders: number;
  totalPages: number;
  page: number;
  limit: number;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: OrderSlice = {
  orders: [],
  selectedOrder: null,
  totalOrders: 0,
  totalPages: 1,
  page: 1,
  limit: 10,
  count: 0,
  loading: false,
  error: null,
};

export const createOrderThunk = createAsyncThunk<
  Order,
  {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    items?: {
      productId: number;
      quantity: number;
    }[];
  }
>("orders/createOrder", async (data) => {
  return await createOrder(data);
});

export const getMyOrderThunk = createAsyncThunk<
  OrderListResponse,
  | {
      search?: string;
      page?: number;
      limit?: number;
    }
  | undefined
>("orders/getMyOrders", async (params = {}) => {
  const response = await getMyOrders(params.search, params.page, params.limit);

  return response;
});

/*
 * Get All Orders - Admin
 */

export const getAllOrderThunk = createAsyncThunk<
  OrderListResponse,
  {
    search?: string;
    page?: number;
    limit?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    sortOrder?: "asc" | "desc";
  }
>("orders/getAllOrders", async (params) => {
  const response = await getAllOrders(
    params.search,
    params.page,
    params.limit,
    params.status,
    params.paymentStatus,
    params.sortOrder,
  );

  return response;
});

/*
 * Get All Seller Orders
 */

export const getAllSellerOrderThunk = createAsyncThunk<
  OrderListResponse,
  {
    search?: string;
    page?: number;
    limit?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    sortOrder?: "asc" | "desc";
  }
>("orders/getAllSellerOrders", async (params) => {
  const response = await getAllSellerOrders(
    params.search,
    params.page,
    params.limit,
    params.status,
    params.paymentStatus,
    params.sortOrder,
  );

  return response;
});

/*
 * Get My Order By ID
 */

export const getMyOrderByIdThunk = createAsyncThunk<Order, number>(
  "orders/getMyOrderById",
  async (orderId) => {
    const response = await getMyOrderById(orderId);

    return response;
  },
);

/*
 * Get Order By ID - Admin
 */

export const getOrderByIdThunk = createAsyncThunk<Order, number>(
  "orders/getOrderById",
  async (orderId) => {
    const response = await getOrderById(orderId);

    return response;
  },
);

/*
 * Get Seller Order By ID
 */

export const getSellerOrderByIdThunk = createAsyncThunk<Order, number>(
  "orders/getSellerOrderById",
  async (orderId) => {
    const response = await getSellerOrderById(orderId);

    return response;
  },
);

/*
 * Cancel My Order
 */

export const cancelOrderThunk = createAsyncThunk<Order, number>(
  "orders/cancelOrder",
  async (orderId) => {
    const response = await cancelOrder(orderId);

    return response;
  },
);

/*
 * Cancel Seller Order
 */

export const cancelSellerOrderThunk = createAsyncThunk<Order, number>(
  "orders/cancelSellerOrder",
  async (orderId) => {
    const response = await cancelSellerOrder(orderId);

    return response;
  },
);

/*
 * Update Order Status - Admin
 */

export const updateOrderStatusThunk = createAsyncThunk<
  Order,
  {
    orderId: number;
    status: OrderStatus;
  }
>("orders/updateOrderStatus", async ({ orderId, status }) => {
  const response = await updateOrderStatus(orderId, status);

  return response;
});

/*
 * Update Seller Order Status
 */

export const updateSellerOrderStatusThunk = createAsyncThunk<
  Order,
  {
    orderId: number;
    status: OrderStatus;
  }
>("orders/updateSellerOrderStatus", async ({ orderId, status }) => {
  const response = await updateSellerOrderStatus(orderId, status);

  return response;
});

/*
 * Count Orders
 */

export const countOrderThunk = createAsyncThunk<number>(
  "orders/count",
  async () => {
    const response = await countOrder();

    return response;
  },
);

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    /*
     * Create Order
     */

    builder.addCase(createOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(createOrderThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot create order";
    });

    /*
     * Get My Orders
     */

    builder.addCase(getMyOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getMyOrderThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalOrders = action.payload.totalOrders;
      state.totalPages = action.payload.totalPages;
      state.orders = action.payload.orders;

      state.error = null;
    });

    builder.addCase(getMyOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No orders found";
    });

    /*
     * Get All Orders - Admin
     */

    builder.addCase(getAllOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllOrderThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalOrders = action.payload.totalOrders;
      state.totalPages = action.payload.totalPages;
      state.orders = action.payload.orders;

      state.error = null;
    });

    builder.addCase(getAllOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No orders found";
    });

    /*
     * Get All Seller Orders
     */

    builder.addCase(getAllSellerOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllSellerOrderThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalOrders = action.payload.totalOrders;
      state.totalPages = action.payload.totalPages;
      state.orders = action.payload.orders;

      state.error = null;
    });

    builder.addCase(getAllSellerOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No orders found";
    });

    /*
     * Get My Order By ID
     */

    builder.addCase(getMyOrderByIdThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getMyOrderByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;
      state.error = null;
    });

    builder.addCase(getMyOrderByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Get Order By ID - Admin
     */

    builder.addCase(getOrderByIdThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getOrderByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;
      state.error = null;
    });

    builder.addCase(getOrderByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Get Seller Order By ID
     */

    builder.addCase(getSellerOrderByIdThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSellerOrderByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;
      state.error = null;
    });

    builder.addCase(getSellerOrderByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Cancel Order
     */

    builder.addCase(cancelOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(cancelOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );

      if (index !== -1) {
        state.orders[index] = action.payload;
      }

      state.error = null;
    });

    builder.addCase(cancelOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Cancel Seller Order
     */

    builder.addCase(cancelSellerOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(cancelSellerOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );

      if (index !== -1) {
        state.orders[index] = action.payload;
      }

      state.error = null;
    });

    builder.addCase(cancelSellerOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Update Order Status - Admin
     */

    builder.addCase(updateOrderStatusThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );

      if (index !== -1) {
        state.orders[index].status = action.payload.status;
      }

      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder.status = action.payload.status;
      }

      state.error = null;
    });

    builder.addCase(updateOrderStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Update Seller Order Status
     */

    builder.addCase(updateSellerOrderStatusThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateSellerOrderStatusThunk.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );

      if (index !== -1) {
        state.orders[index].status = action.payload.status;
      }

      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder.status = action.payload.status;
      }

      state.error = null;
    });

    builder.addCase(updateSellerOrderStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    /*
     * Count Orders
     */

    builder.addCase(countOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(countOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.count = action.payload;
      state.error = null;
    });

    builder.addCase(countOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });
  },
});

export const { setPage } = orderSlice.actions;

export default orderSlice.reducer;
