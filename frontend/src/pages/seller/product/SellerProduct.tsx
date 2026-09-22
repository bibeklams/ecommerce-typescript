import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import {
  createProductThunk,
  getSellerAllProductsThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../../../redux/slices/productSlice";

import { getAllCategoriesThunk } from "../../../redux/slices/categorySlice";

import type { Product } from "../../../types/product";

import ProductForm from "../../../components/admin/product/ProductForm";
import ProductTable from "../../../components/admin/product/ProductTable";

const SellerProduct = () => {
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
  // GET SELLER PRODUCTS + CATEGORIES
  // =========================

  useEffect(() => {
    dispatch(
      getSellerAllProductsThunk({
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
  // LOCK PAGE SCROLL
  // =========================

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

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
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryId: number;
    detailsJson?: object;
    images?: File[];
    media?: File[];
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

        dispatch(
          getSellerAllProductsThunk({
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

      dispatch(
        getSellerAllProductsThunk({
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
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteProductThunk(id));

    if (deleteProductThunk.fulfilled.match(result)) {
      toast.success("Product deleted successfully");

      dispatch(
        getSellerAllProductsThunk({
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
          <h1 className="text-3xl font-bold text-black">My Products</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add Product
        </button>
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

      {/* Product Table */}

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Product Form Modal */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCancel}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProduct ? "Edit Product" : "Add Product"}
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
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 001.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <ProductForm
              categories={categories}
              editingProduct={editingProduct}
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

export default SellerProduct;
