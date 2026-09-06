import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentListResponse,
  RefundStatus,
} from "../../types/payment";

import {
  createPayment,
  getMyPayment,
  getAllPayment,
  updatePaymentStatus,
  requestRefund,
  updateRefundStatus,
} from "../../services/payment.service";

interface PaymentSlice {
  payments: Payment[];
  selectedPayment: Payment | null;

  totalPayments: number;
  totalPages: number;
  page: number;
  limit: number;

  loading: boolean;
  error: string | null;
}

const initialState: PaymentSlice = {
  payments: [],
  selectedPayment: null,
  totalPayments: 0,
  totalPages: 1,
  page: 1,
  limit: 20,
  loading: false,
  error: null,
};

export const createPaymentThunk = createAsyncThunk<
  Payment,
  {
    orderId: number;
    method: PaymentMethod;
  }
>("/payments/createPayment", async ({ orderId, method }) => {
  const response = await createPayment(orderId, method);
  return response;
});

export const getMyPaymentThunk = createAsyncThunk<Payment, number>(
  "/payments/getMyPayment",
  async (orderId) => {
    const response = await getMyPayment(orderId);
    return response;
  },
);

export const getAllPaymentThunk = createAsyncThunk<
  PaymentListResponse,
  {
    search?: string;
    page?: number;
    limit?: number;
    status?: PaymentStatus;
  }
>("/payments/getAllPayment", async (params) => {
  const response = await getAllPayment(
    params.search,
    params.page,
    params.limit,
    params.status,
  );

  return response;
});

// export const initiateEsewaPaymentThunk = createAsyncThunk<
//   EsewaPaymentData,
//   number
// >("/payments/initiateEsewaPayment", async (orderId) => {
//   const response = await initiateEsewaPayment(orderId);
//   return response;
// });

export const updatePaymentStatusThunk = createAsyncThunk<
  Payment,
  { paymentId: number; status: PaymentStatus }
>("/payments/updatePaymentStatus", async ({ paymentId, status }) => {
  const response = await updatePaymentStatus(paymentId, status);
  return response;
});

export const requestRefundThunk = createAsyncThunk<Payment, number>(
  "/payments/requestRefund",
  async (paymentId) => {
    const response = await requestRefund(paymentId);
    return response;
  },
);
export const updateRefundStatusThunk = createAsyncThunk<
  Payment,
  {
    paymentId: number;
    status: RefundStatus;
  }
>("/payments/updateRefundStatus", async ({ paymentId, status }) => {
  const response = await updateRefundStatus(paymentId, status);
  return response;
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //createPayment
    builder.addCase(createPaymentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPaymentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.payments.push(action.payload);
      state.error = null;
    });
    builder.addCase(createPaymentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Can not payment";
    });

    //getMyPayment

    builder.addCase(getMyPaymentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyPaymentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPayment = action.payload;
      state.error = null;
    });
    builder.addCase(getMyPaymentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No payment found";
    });

    //getALlPayment

    builder.addCase(getAllPaymentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllPaymentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.payments = action.payload.payments;
      state.totalPayments = action.payload.totalPayments;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.error = null;
    });

    builder.addCase(getAllPaymentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot get payments";
    });
    //request-Refund

    builder.addCase(requestRefundThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(requestRefundThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPayment = action.payload;

      const index = state.payments.findIndex(
        (payment) => payment.id === action.payload.id,
      );

      if (index !== -1) {
        state.payments[index] = action.payload;
      }

      state.error = null;
    });

    builder.addCase(requestRefundThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot request refund";
    });

    //updatePaymentStatus

    // updatePaymentStatus
    builder.addCase(updatePaymentStatusThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updatePaymentStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPayment = action.payload;

      const index = state.payments.findIndex(
        (payment) => payment.id === action.payload.id,
      );

      if (index !== -1) {
        state.payments[index] = action.payload;
      }

      state.error = null;
    });

    builder.addCase(updatePaymentStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No payment found";
    });

    //updateRefundstatus

    builder.addCase(updateRefundStatusThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRefundStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPayment = action.payload;
      const index = state.payments.findIndex(
        (payment) => payment.id === action.payload.id,
      );
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateRefundStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No payment found";
    });
  },
});

export default paymentSlice.reducer;
