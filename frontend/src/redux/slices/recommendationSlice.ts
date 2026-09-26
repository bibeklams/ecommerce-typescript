import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getRecommendationProducts,
  type RecommendedProduct,
} from "../../services/recommendation.service";

interface RecommendationState {
  recommendations: RecommendedProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationState = {
  recommendations: [],
  loading: false,
  error: null,
};

export const getRecommendedProductsThunk = createAsyncThunk<
  RecommendedProduct[],
  number,
  { rejectValue: string }
>(
  "recommendation/getRecommendedProducts",
  async (productId, { rejectWithValue }) => {
    try {
      const products = await getRecommendationProducts(productId);

      return products;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to get recommended products",
      );
    }
  },
);

const recommendationSlice = createSlice({
  name: "recommendation",

  initialState,

  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRecommendedProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRecommendedProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })

      .addCase(getRecommendedProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to get recommended products";
      });
  },
});

export const { clearRecommendations } = recommendationSlice.actions;

export default recommendationSlice.reducer;
