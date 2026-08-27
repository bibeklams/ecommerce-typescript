import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Seo } from "../../types/seo";

import { createSeo, updateSeo } from "../../services/seo.service";

interface SeoState {
  seo: Seo | null;
  loading: boolean;
  error: string | null;
}

const initialState: SeoState = {
  seo: null,
  loading: false,
  error: null,
};

type CreateSeoData = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  productId: number;
};

type UpdateSeoData = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
};

// CREATE SEO
export const createSeoThunk = createAsyncThunk<
  Seo,
  { productId: number; data: CreateSeoData }
>("seo/createSeo", async ({ productId, data }) => {
  const response = await createSeo(productId, data);
  return response;
});

// UPDATE SEO
export const updateSeoThunk = createAsyncThunk<
  Seo,
  { productId: number; data: UpdateSeoData }
>("seo/updateSeo", async ({ productId, data }) => {
  const response = await updateSeo(productId, data);
  return response;
});

const seoSlice = createSlice({
  name: "seo",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // CREATE SEO

    builder.addCase(createSeoThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(createSeoThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.seo = action.payload;
      state.error = null;
    });

    builder.addCase(createSeoThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to create SEO";
    });

    // UPDATE SEO

    builder.addCase(updateSeoThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateSeoThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.seo = action.payload;
      state.error = null;
    });

    builder.addCase(updateSeoThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to update SEO";
    });
  },
});

export default seoSlice.reducer;
