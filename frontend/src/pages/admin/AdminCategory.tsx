import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  createCategoryThunk,
  getAllCategoriesThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../../redux/slices/categorySlice";

import type { Category } from "../../types/category";

import CategoryForm from "../../components/admin/category/CategoryForm";
import CategoryTable from "../../components/admin/category/CategoryTable";

const AdminCategory = () => {
  const dispatch = useAppDispatch();

  const { categories, loading, error } = useAppSelector(
    (state) => state.category,
  );

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Get categories
  useEffect(() => {
    dispatch(getAllCategoriesThunk());
  }, [dispatch]);

  // Add category
  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  // Edit category
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  // Create / Update category
  const handleSubmit = async (data: {
    name: string;
    description?: string;
    parentId?: number;
  }) => {
    // UPDATE
    if (editingCategory) {
      const result = await dispatch(
        updateCategoryThunk({
          id: editingCategory.id,
          data,
        }),
      );

      if (updateCategoryThunk.fulfilled.match(result)) {
        toast.success("Category updated successfully");

        setShowForm(false);
        setEditingCategory(null);
      } else {
        toast.error(result.error.message ?? "Failed to update category");
      }

      return;
    }

    // CREATE
    const result = await dispatch(createCategoryThunk(data));

    if (createCategoryThunk.fulfilled.match(result)) {
      toast.success("Category created successfully");

      setShowForm(false);
    } else {
      toast.error(result.error.message ?? "Failed to create category");
    }
  };

  // Delete category
  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteCategoryThunk(id));

    if (deleteCategoryThunk.fulfilled.match(result)) {
      toast.success("Category deleted successfully");
    } else {
      toast.error(result.error.message ?? "Failed to delete category");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store categories
          </p>
        </div>

        {/* Add Category Button */}
        {!showForm && (
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            + Add Category
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <CategoryForm
          categories={categories}
          editingCategory={editingCategory}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Redux Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Category Table */}
      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
};

export default AdminCategory;
