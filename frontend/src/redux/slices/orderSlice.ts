import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Order, OrderListResponse, OrderStatus } from "../../types/order";
import {
  createOrder,
  getMyOrderById,
  getAllOrders,
  getMyOrders,
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
  limit: 20,
  count: 0,
  loading: true,
  error: null,
};
export const createOrderThunk = createAsyncThunk<
  Order,
  {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
  }
>("orders/createOrder", async (data) => {
  const response = await createOrder(data);
  return response;
});

export const getMyOrderThunk = createAsyncThunk<
  OrderListResponse,
  {
    search?: string;
    page?: number;
    limit?: number;
  }
>("orders/getMyOrders", async (params) => {
  const response = await getMyOrders(params.search, params.page, params.limit);

  return response;
});

export const getAllOrderThunk = createAsyncThunk<
  OrderListResponse,
  {
    search?: string;
    page?: number;
    limit?: number;
    status: OrderStatus;
  }
>("orders/getAllOrders", async (params) => {
  const response = await getAllOrders(
    params.search,
    params.page,
    params.limit,
    params.status,
  );

  return response;
});

export const getMyOrderByIdThunk = createAsyncThunk<Order, number>(
  "orders/getMyOrderById",
  async (orderId) => {
    const response = await getMyOrderById(orderId);
    return response;
  },
);

export const getOrderByIdThunk = createAsyncThunk<Order, number>(
  "orders/getOrderById",
  async (orderId) => {
    const response = await getOrderById(orderId);
    return response;
  },
);

export const cancelOrderThunk = createAsyncThunk<Order, number>(
  "orders/cancelOrder",
  async (orderId) => {
    const response = await cancelOrder(orderId);
    return response;
  },
);

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
  reducers: {},
  //create
  extraReducers(builder) {
    builder.addCase(createOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
      state.count += 1;
      state.error = null;
    });
    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "can not create order";
    });
    //getMyOrder
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
      state.error = action.error.message ?? "No order found";
    });

    //getAllOrder

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
      state.error = action.error.message ?? "No order found";
    });

    //getMYOrderById

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

    //getOrderById

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

    //cancel

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

    //updateStatus

    builder.addCase(updateOrderStatusThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
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
    builder.addCase(updateOrderStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No order found";
    });

    //count orders

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

export default orderSlice.reducer;
