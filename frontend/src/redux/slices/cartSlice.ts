import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getCart, clearCart } from "../../services/cart.service";

import {
  addToCart,
  removeCartItem,
  updateCartItem,
  countCartItem,
} from "../../services/cartItem.service";

import type { CartItem } from "../../types/cartItem";
import type { Cart } from "../../types/cart";
interface CartSlice {
  items: CartItem[];
  total: number;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartSlice = {
  items: [],
  total: 0,
  count: 0,
  loading: false,
  error: null,
};
// for cart
export const getCartThunk = createAsyncThunk<Cart>("cart/getCart", async () => {
  const response = await getCart();
  return response;
});
export const clearCartThunk = createAsyncThunk<Cart>(
  "cart/clearCart",
  async () => {
    const response = await clearCart();
    return response;
  },
);
//for cartItem
export const addToCartThunk = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number }
>("cart/items/addToCart", async ({ productId, quantity }) => {
  const response = await addToCart({
    productId,
    quantity,
  });

  return response;
});
export const updateCartItemThunk = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number }
>("cart/items/updateCartItem", async ({ productId, quantity }) => {
  const response = await updateCartItem({
    productId,
    quantity,
  });

  return response;
});

export const removeCartItemThunk = createAsyncThunk<CartItem, number>(
  "cart/items/removeCartItem",
  async (productId) => {
    const response = await removeCartItem(productId);
    return response;
  },
);

export const countCartItemThunk = createAsyncThunk<number>(
  "cart/items/count",
  async () => {
    const response = await countCartItem();
    return response;
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getCartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.error = null;
    });

    builder.addCase(getCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No cart found";
    });
    builder.addCase(clearCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(clearCartThunk.fulfilled, (state) => {
      state.loading = false;
      state.items = [];
      state.total = 0;
      state.count = 0;
      state.error = null;
    });

    builder.addCase(clearCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot clear cart";
    });
    //for cartItem

    builder.addCase(addToCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCartThunk.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
        state.count += 1;
      }

      state.error = null;
    });
    builder.addCase(addToCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "can not add to cart";
    });
    builder.addCase(removeCartItemThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeCartItemThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.items = state.items.filter(
        (item) => item.productId !== action.payload.productId,
      );
      state.count -= 1;
      state.error = null;
    });
    builder.addCase(removeCartItemThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "can not delete the cartItem";
    });
    builder.addCase(updateCartItemThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateCartItemThunk.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.error = null;
    });

    builder.addCase(updateCartItemThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot update cart item";
    });
    builder.addCase(countCartItemThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(countCartItemThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.count = action.payload;
      state.error = null;
    });

    builder.addCase(countCartItemThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Cannot find cart item count";
    });
  },
});

export default cartSlice.reducer;
