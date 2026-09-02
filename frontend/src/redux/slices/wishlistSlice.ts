import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { WishlistItem } from "../../types/wishlist";

import {
  createWishlist,
  getWishlist,
  removeWishlist,
  countWishlist,
} from "../../services/wishlist.service";

interface WishlistState {
  items: WishlistItem[];
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
};

export const addToWishlist = createAsyncThunk<WishlistItem, number>(
  "wishlist/addToWishlist",
  async (productId) => {
    const response = await createWishlist(productId);

    return response;
  },
);

export const getWishlistThunk = createAsyncThunk<WishlistItem[]>(
  "wishlist/getWishlist",
  async () => {
    const response = await getWishlist();

    return response;
  },
);

export const removeWishlistThunk = createAsyncThunk<WishlistItem, number>(
  "wishlist/removeWishlist",
  async (productId) => {
    const response = await removeWishlist(productId);

    return response;
  },
);

export const countWishlistThunk = createAsyncThunk<number>(
  "wishlist/countWishlist",
  async () => {
    const response = await countWishlist();

    return response;
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(addToWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.count += 1;
      state.error = null;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot add to wishlist";
    });

    builder.addCase(getWishlistThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWishlistThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(getWishlistThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot get wishlist";
    });
    builder.addCase(removeWishlistThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeWishlistThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.items = state.items.filter(
        (item) => item.productId !== action.payload.productId,
      );
      state.count -= 1;
      state.error = null;
    });
    builder.addCase(removeWishlistThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "can not remove wishlist";
    });
    builder.addCase(countWishlistThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(countWishlistThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.count = action.payload;
      state.error = null;
    });
    builder.addCase(countWishlistThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "can not get count";
    });
  },
});

export default wishlistSlice.reducer;
