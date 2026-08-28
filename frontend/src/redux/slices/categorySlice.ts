import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Category } from "../../types/category";

import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
  updateCategory,
  countCategories,
  type GetAllCategoriesResponse,
} from "../../services/category.service";

// =========================
// STATE
// =========================

interface CategoryState {
  categories: Category[];

  category: Category | null;

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

const initialState: CategoryState = {
  categories: [],
  category: null,
  count: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  loading: false,
  error: null,
};

// =========================
// TYPES
// =========================

type CreateCategoryData = {
  name: string;
  description?: string;
  parentId?: number;
  categoryImage?: File;
};

type UpdateCategoryData = {
  name?: string;
  description?: string;
  parentId?: number;
  categoryImage?: File;
};

type GetCategoriesParams = {
  search?: string;
  page?: number;
  limit?: number;
};

// =========================
// CREATE CATEGORY
// =========================

export const createCategoryThunk = createAsyncThunk<
  Category,
  CreateCategoryData
>("category/createCategory", async (data) => {
  return await createCategory(data);
});

// =========================
// GET ALL CATEGORIES
// =========================

export const getAllCategoriesThunk = createAsyncThunk<
  GetAllCategoriesResponse,
  GetCategoriesParams | undefined
>(
  "category/getAllCategories",
  async ({ search = "", page = 1, limit = 20 } = {}) => {
    return await getAllCategories(search, page, limit);
  },
);

// =========================
// GET SINGLE CATEGORY
// =========================

export const getSingleCategoryThunk = createAsyncThunk<Category, number>(
  "category/getSingleCategory",
  async (id) => {
    return await getSingleCategory(id);
  },
);

// =========================
// UPDATE CATEGORY
// =========================

export const updateCategoryThunk = createAsyncThunk<
  Category,
  {
    id: number;
    data: UpdateCategoryData;
  }
>("category/updateCategory", async ({ id, data }) => {
  return await updateCategory(id, data);
});

// =========================
// DELETE CATEGORY
// =========================

export const deleteCategoryThunk = createAsyncThunk<Category, number>(
  "category/deleteCategory",
  async (id) => {
    return await deleteCategory(id);
  },
);

// =========================
// COUNT CATEGORY
// =========================

export const countCategoryThunk = createAsyncThunk<number>(
  "category/countCategory",
  async () => {
    return await countCategories();
  },
);

// =========================
// SLICE
// =========================

const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // =================================
    // CREATE
    // =================================

    builder.addCase(createCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(createCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.category = action.payload;

      state.categories.push(action.payload);

      state.count += 1;

      state.error = null;
    });

    builder.addCase(createCategoryThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to create category";
    });

    // =================================
    // GET ALL
    // =================================

    builder.addCase(getAllCategoriesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories;
      state.count = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    });

    builder.addCase(getAllCategoriesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to get categories";
    });

    // GET SINGLE
    builder.addCase(getSingleCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getSingleCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.category = action.payload;

      state.error = null;
    });

    builder.addCase(getSingleCategoryThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to get category";
    });

    // =================================
    // UPDATE
    // =================================

    builder.addCase(updateCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.category = action.payload;

      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id,
      );

      if (index !== -1) {
        state.categories[index] = action.payload;
      }

      state.error = null;
    });

    builder.addCase(updateCategoryThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to update category";
    });

    // =================================
    // DELETE
    // =================================

    builder.addCase(deleteCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.categories = state.categories.filter(
        (category) => category.id !== action.payload.id,
      );

      state.count = Math.max(0, state.count - 1);

      if (state.category?.id === action.payload.id) {
        state.category = null;
      }

      state.error = null;
    });

    builder.addCase(deleteCategoryThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to delete category";
    });

    // =================================
    // COUNT
    // =================================

    builder.addCase(countCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(countCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.count = action.payload;

      state.error = null;
    });

    builder.addCase(countCategoryThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message ?? "Failed to count categories";
    });
  },
});

export default categorySlice.reducer;
