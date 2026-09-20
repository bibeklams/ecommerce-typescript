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

  // Lock page scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

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
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          + Add Category
        </button>
      </div>

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

      {/* Category Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCancel}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>

              <button
                type="button"
                onClick={handleCancel}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <CategoryForm
              categories={categories}
              editingCategory={editingCategory}
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminCategory;
