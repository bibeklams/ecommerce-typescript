import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/user";

import {
  applyForSeller,
  approveSeller,
  rejectSeller,
  deactivateSeller,
} from "../../services/seller.service";

interface SellerState {
  seller: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SellerState = {
  seller: null,
  loading: false,
  error: null,
  success: false,
};

export const applyForSellerThunk = createAsyncThunk<User>(
  "/sellers/apply-seller",
  async () => {
    return await applyForSeller();
  },
);

export const approveSellerThunk = createAsyncThunk<User, number>(
  "/sellers/approve-seller",
  async (userId) => {
    return await approveSeller(userId);
  },
);
export const rejectSellerThunk = createAsyncThunk<User, number>(
  "/sellers/reject-seller",
  async (userId) => {
    return await rejectSeller(userId);
  },
);
export const deactivateSellerThunk = createAsyncThunk<User>(
  "/sellers/deactive-seller",
  async () => {
    return await deactivateSeller();
  },
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(applyForSellerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(applyForSellerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(applyForSellerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
      state.success = false;
    });

    //approve seller

    builder.addCase(approveSellerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(approveSellerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.error = null;
      state.success = true;
    });

    builder.addCase(approveSellerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
      state.success = false;
    });

    //reject
    builder.addCase(rejectSellerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(rejectSellerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(rejectSellerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
      state.success = false;
    });

    //deactive seller
    builder.addCase(deactivateSellerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deactivateSellerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(deactivateSellerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
      state.success = false;
    });
  },
});

export default sellerSlice.reducer;
