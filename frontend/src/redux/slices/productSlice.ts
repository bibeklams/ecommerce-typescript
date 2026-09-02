import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Product } from "../../types/product";

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  countProducts,
} from "../../services/product.service";

// =========================
// TYPES
// =========================

export type GetProductsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type GetProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

interface ProductState {
  products: Product[];
  product: Product | null;

  // Pagination
  count: number;
  page: number;
  limit: number;
  totalPages: number;

  loading: boolean;
  error: string | null;
}

// =========================
// INITIAL STATE
// =========================

const initialState: ProductState = {
  products: [],
  product: null,

  count: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  loading: false,
  error: null,
};

// =========================
// CREATE PRODUCT DATA
// =========================

export type CreateProductData = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: number;
  quantity: number;
  detailsJson?: object;
  images?: File[];
  media?: File[];
};

// =========================
// UPDATE PRODUCT DATA
// =========================

export type UpdateProductData = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  quantity?: number;
  detailsJson?: object;
  images?: File[];
  media?: File[];
};

// =========================
// CREATE PRODUCT
// =========================

export const createProductThunk = createAsyncThunk<Product, CreateProductData>(
  "product/createProduct",

  async (data) => {
    const response = await createProduct(data);

    return response;
  },
);

// =========================
// GET ALL PRODUCTS
// =========================

export const getAllProductsThunk = createAsyncThunk<
  GetProductsResponse,
  GetProductsParams | undefined
>(
  "product/getAllProducts",
  async ({ search = "", page = 1, limit = 20 } = {}) => {
    const response = await getAllProducts(search, page, limit);

    return response;
  },
);

// =========================
// GET SINGLE PRODUCT
// =========================

export const getSingleProductThunk = createAsyncThunk<Product, number>(
  "product/getSingleProduct",

  async (id) => {
    const response = await getSingleProduct(id);

    return response;
  },
);

// =========================
// UPDATE PRODUCT
// =========================

export const updateProductThunk = createAsyncThunk<
  Product,
  {
    id: number;
    data: UpdateProductData;
  }
>(
  "product/updateProduct",

  async ({ id, data }) => {
    const response = await updateProduct(id, data);

    return response;
  },
);

// =========================
// DELETE PRODUCT
// =========================

export const deleteProductThunk = createAsyncThunk<Product, number>(
  "product/deleteProduct",

  async (id) => {
    const response = await deleteProduct(id);

    return response;
  },
);

// =========================
// COUNT PRODUCTS
// =========================

export const countProductsThunk = createAsyncThunk<number>(
  "product/countProducts",

  async () => {
    const response = await countProducts();

    return response;
  },
);

// =========================
// SLICE
// =========================

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // =========================
    // CREATE PRODUCT
    // =========================

    builder.addCase(createProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(createProductThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.product = action.payload;

      state.count += 1;

      state.error = null;
    });

    builder.addCase(createProductThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to create product";
    });

    // =========================
    // GET ALL PRODUCTS
    // =========================

    builder.addCase(getAllProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllProductsThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.products = action.payload.products;

      state.count = action.payload.total;

      state.page = action.payload.page;

      state.limit = action.payload.limit;

      state.totalPages = action.payload.totalPages;

      state.error = null;
    });

    builder.addCase(getAllProductsThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to get products";
    });

    // =========================
    // GET SINGLE PRODUCT
    // =========================

    builder.addCase(getSingleProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSingleProductThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.product = action.payload;

      state.error = null;
    });

    builder.addCase(getSingleProductThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to get product";
    });

    // =========================
    // UPDATE PRODUCT
    // =========================

    builder.addCase(updateProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProductThunk.fulfilled, (state, action) => {
      state.loading = false;

      // Selected product
      state.product = action.payload;

      // Update product in current list
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id,
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }

      state.error = null;
    });

    builder.addCase(updateProductThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to update product";
    });

    // =========================
    // DELETE PRODUCT
    // =========================

    builder.addCase(deleteProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteProductThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.products = state.products.filter(
        (product) => product.id !== action.payload.id,
      );

      state.count = Math.max(0, state.count - 1);

      if (state.product?.id === action.payload.id) {
        state.product = null;
      }

      state.error = null;
    });

    builder.addCase(deleteProductThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to delete product";
    });

    // =========================
    // COUNT PRODUCTS
    // =========================

    builder.addCase(countProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(countProductsThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.count = action.payload;

      state.error = null;
    });

    builder.addCase(countProductsThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to count products";
    });
  },
});

export default productSlice.reducer;
