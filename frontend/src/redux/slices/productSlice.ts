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

type GetProductsParams = {
  search?: string;
  page?: number;
  limit?: number;
};
interface ProductState {
  products: Product[];
  product: Product | null;
  count: number;
  page: number;
  limit: number;

  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  count: 0,
  page: 1,
  limit: 20,
  loading: false,
  error: null,
};

type CreateProductData = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: number;
  detailsJson?: object;
  images?: File[];
  media?: File[];
};

type UpdateProductData = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  detailsJson?: object;
  images?: File[];
  media?: File[];
};

// CREATE
export const createProductThunk = createAsyncThunk<Product, CreateProductData>(
  "product/createProduct",
  async (data) => {
    const response = await createProduct(data);
    return response;
  },
);

// GET ALL
export const getAllProductsThunk = createAsyncThunk<
  {
    products: Product[];
    total: number;
    page: number;
    limit: number;
  },
  GetProductsParams
>("product/getAllProducts", async ({ search = "", page = 1, limit = 10 }) => {
  const response = await getAllProducts(search, page, limit);

  return response;
});

// GET SINGLE
export const getSingleProductThunk = createAsyncThunk<Product, number>(
  "product/getSingleProduct",
  async (id) => {
    const response = await getSingleProduct(id);
    return response;
  },
);

// UPDATE
export const updateProductThunk = createAsyncThunk<
  Product,
  { id: number; data: UpdateProductData }
>("product/updateProduct", async ({ id, data }) => {
  const response = await updateProduct(id, data);
  return response;
});

// DELETE
export const deleteProductThunk = createAsyncThunk<Product, number>(
  "product/deleteProduct",
  async (id) => {
    const response = await deleteProduct(id);
    return response;
  },
);

// COUNT
export const countProductsThunk = createAsyncThunk<number>(
  "product/count",
  async () => {
    const response = await countProducts();
    return response;
  },
);

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
      state.products.push(action.payload);
      state.count += 1;
    });

    builder.addCase(createProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to create product";
    });

    // GET ALL PRODUCTS

    builder.addCase(getAllProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllProductsThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.products = action.payload.products;
      state.page = action.payload.page;
      state.limit = action.payload.limit;

      state.error = null;
    });

    builder.addCase(getAllProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to get products";
    });

    // GET SINGLE PRODUCT

    builder.addCase(getSingleProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSingleProductThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
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

      // Update currently selected product
      state.product = action.payload;

      // Update product inside products array
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id,
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    });

    builder.addCase(updateProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to update product";
    });

    // DELETE PRODUCT

    builder.addCase(deleteProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteProductThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.products = state.products.filter(
        (product) => product.id !== action.payload.id,
      );

      state.count -= 1;

      // If deleted product is currently selected
      if (state.product?.id === action.payload.id) {
        state.product = null;
      }
    });

    builder.addCase(deleteProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to delete product";
    });

    // COUNT PRODUCTS

    builder.addCase(countProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(countProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.count = action.payload;
    });

    builder.addCase(countProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to count products";
    });
  },
});

export default productSlice.reducer;
