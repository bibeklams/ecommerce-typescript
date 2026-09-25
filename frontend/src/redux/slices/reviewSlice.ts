import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../../services/review.service";

import type {
  ProductReview,
  ProductReviewListResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "../../types/review";

interface ReviewState {
  productReviews: ProductReview[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };

  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  productReviews: [],

  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    hasMore: false,
  },

  loading: false,
  error: null,
};

// Get product reviews
export const getProductReviewsThunk = createAsyncThunk<
  ProductReviewListResponse,
  {
    productId: number;
    page?: number;
    limit?: number;
  }
>("review/getProductReviews", async ({ productId, page = 1, limit = 5 }) => {
  const response = await getProductReviews(productId, page, limit);

  return response;
});

// Create review
export const createReviewThunk = createAsyncThunk<
  ProductReview,
  {
    productId: number;
    data: CreateReviewPayload;
  }
>("review/createReview", async ({ productId, data }) => {
  const response = await createReview(productId, data);

  return response;
});

// Update review
export const updateReviewThunk = createAsyncThunk<
  ProductReview,
  {
    productId: number;
    data: UpdateReviewPayload;
  }
>("review/updateReview", async ({ productId, data }) => {
  const response = await updateReview(productId, data);

  return response;
});

// Delete review
export const deleteReviewThunk = createAsyncThunk<ProductReview, number>(
  "review/deleteReview",
  async (productId) => {
    const response = await deleteReview(productId);

    return response;
  },
);

const reviewSlice = createSlice({
  name: "review",
  initialState,

  reducers: {
    clearReviews: (state) => {
      state.productReviews = [];

      state.pagination = {
        page: 1,
        limit: 5,
        total: 0,
        hasMore: false,
      };

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // GET REVIEWS
    // =========================

    builder
      .addCase(getProductReviewsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProductReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { productReviews, pagination } = action.payload;
        if (pagination.page === 1) {
          state.productReviews = productReviews;
        }
        // Next pages
        else {
          state.productReviews.push(...productReviews);
        }
        state.pagination = pagination;
      })

      .addCase(getProductReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to get reviews";
      });

    // =========================
    // CREATE REVIEW
    // =========================

    builder
      .addCase(createReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews.unshift(action.payload);
        state.pagination.total += 1;
      })

      .addCase(createReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to create review";
      });

    // =========================
    // UPDATE REVIEW
    // =========================

    builder
      .addCase(updateReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productReviews.findIndex(
          (review) => review.id === action.payload.id,
        );
        if (index !== -1) {
          state.productReviews[index] = action.payload;
        }
      })

      .addCase(updateReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update review";
      });

    // =========================
    // DELETE REVIEW
    // =========================

    builder
      .addCase(deleteReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = state.productReviews.filter(
          (review) => review.id !== action.payload.id,
        );
        state.pagination.total -= 1;
      })

      .addCase(deleteReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to delete review";
      });
  },
});

export const { clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;
