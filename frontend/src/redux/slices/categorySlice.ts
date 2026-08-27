import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Category } from "../../types/category";

import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
  updateCategory,
  countCategories,
} from "../../services/category.service";

interface CategoryState {
  categories: Category[];
  category: Category | null;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  count: 0,
  loading: false,
  error: null,
};

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

// CREATE CATEGORY
export const createCategoryThunk = createAsyncThunk<
  Category,
  CreateCategoryData
>("category/createCategory", async (data) => {
  const response = await createCategory(data);
  return response;
});

// GET ALL CATEGORIES
export const getAllCategoriesThunk = createAsyncThunk<Category[]>(
  "category/getAllCategories",
  async () => {
    const response = await getAllCategories();
    return response;
  },
);

// GET SINGLE CATEGORY
export const getSingleCategoryThunk = createAsyncThunk<Category, number>(
  "category/getSingleCategory",
  async (id) => {
    const response = await getSingleCategory(id);
    return response;
  },
);

// UPDATE CATEGORY
export const updateCategoryThunk = createAsyncThunk<
  Category,
  { id: number; data: UpdateCategoryData }
>("category/updateCategory", async ({ id, data }) => {
  const response = await updateCategory(id, data);
  return response;
});

// DELETE CATEGORY
export const deleteCategoryThunk = createAsyncThunk<Category, number>(
  "category/deleteCategory",
  async (id) => {
    const response = await deleteCategory(id);
    return response;
  },
);

// COUNT CATEGORIES
export const countCategoryThunk = createAsyncThunk<number>(
  "category/countCategory",
  async () => {
    const response = await countCategories();
    return response;
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // =================================
    // CREATE CATEGORY
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
    // GET ALL CATEGORIES
    // =================================

    builder.addCase(getAllCategoriesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.categories = action.payload;

      state.error = null;
    });

    builder.addCase(getAllCategoriesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to get categories";
    });

    // =================================
    // GET SINGLE CATEGORY
    // =================================

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
    // UPDATE CATEGORY
    // =================================

    builder.addCase(updateCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      // Update currently selected category
      state.category = action.payload;

      // Find the category inside the array
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id,
      );

      // Replace old category with updated category
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
    // DELETE CATEGORY
    // =================================

    builder.addCase(deleteCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;

      // Remove deleted category from array
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload.id,
      );

      // Decrease count
      state.count -= 1;

      // If currently selected category was deleted
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
    // COUNT CATEGORIES
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
