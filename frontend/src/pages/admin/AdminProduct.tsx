import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  createProductThunk,
  getAllProductsThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../../redux/slices/productSlice";

import { getAllCategoriesThunk } from "../../redux/slices/categorySlice";

import type { Product } from "../../types/product";

import ProductForm from "../../components/admin/product/ProductForm";
import ProductTable from "../../components/admin/product/ProductTable";

const AdminProduct = () => {
  const dispatch = useAppDispatch();

  const {
    products,
    loading: productLoading,
    error: productError,
  } = useAppSelector((state) => state.product);

  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useAppSelector((state) => state.category);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // =========================
  // GET PRODUCTS + CATEGORIES
  // =========================

  useEffect(() => {
    dispatch(
      getAllProductsThunk({
        search: "",
        page: 1,
        limit: 20,
      }),
    );

    dispatch(
      getAllCategoriesThunk({
        search: "",
        page: 1,
        limit: 100,
      }),
    );
  }, [dispatch]);

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // =========================
  // CREATE / UPDATE PRODUCT
  // =========================

  const handleSubmit = async (data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    categoryId: number;
    detailsJson?: object;
  }) => {
    // UPDATE
    if (editingProduct) {
      const result = await dispatch(
        updateProductThunk({
          id: editingProduct.id,
          data,
        }),
      );

      if (updateProductThunk.fulfilled.match(result)) {
        toast.success("Product updated successfully");

        setShowForm(false);
        setEditingProduct(null);

        // Refresh product list
        dispatch(
          getAllProductsThunk({
            search: "",
            page: 1,
            limit: 20,
          }),
        );
      } else {
        toast.error(result.error.message ?? "Failed to update product");
      }

      return;
    }

    // CREATE
    const result = await dispatch(createProductThunk(data));

    if (createProductThunk.fulfilled.match(result)) {
      toast.success("Product created successfully");

      setShowForm(false);
      setEditingProduct(null);

      // Refresh product list
      dispatch(
        getAllProductsThunk({
          search: "",
          page: 1,
          limit: 20,
        }),
      );
    } else {
      toast.error(result.error.message ?? "Failed to create product");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteProductThunk(id));

    if (deleteProductThunk.fulfilled.match(result)) {
      toast.success("Product deleted successfully");

      // Refresh product list
      dispatch(
        getAllProductsThunk({
          search: "",
          page: 1,
          limit: 20,
        }),
      );
    } else {
      toast.error(result.error.message ?? "Failed to delete product");
    }
  };

  // =========================
  // LOADING
  // =========================

  const loading = productLoading || categoryLoading;

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Products</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your ShopVerse products.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Add Product
          </button>
        )}
      </div>

      {/* Errors */}
      {productError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {productError}
        </p>
      )}

      {categoryError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {categoryError}
        </p>
      )}

      {/* Product Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ProductForm
            categories={categories}
            editingProduct={editingProduct}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Product Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <ProductTable
          products={products}
          // categories={categories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
};

export default AdminProduct;
