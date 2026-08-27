import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  createProductThunk,
  getAllProductsThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../../redux/slices/productSlice";

import type { Product } from "../../types/product";

import ProductForm from "../../components/admin/product/ProductForm";
import ProductTable from "../../components/admin/product/ProductTable";

const AdminProduct = () => {
  const dispatch = useAppDispatch();

  const { products, loading, error } = useAppSelector((state) => state.product);

  const { categories } = useAppSelector((state) => state.category);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // =========================
  // GET PRODUCTS
  // =========================

  useEffect(() => {
    dispatch(getAllProductsThunk());
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
    // =========================
    // UPDATE
    // =========================

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
      } else {
        toast.error(result.error.message ?? "Failed to update product");
      }

      return;
    }

    // =========================
    // CREATE
    // =========================

    const result = await dispatch(createProductThunk(data));

    if (createProductThunk.fulfilled.match(result)) {
      toast.success("Product created successfully");

      setShowForm(false);
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
    } else {
      toast.error(result.error.message ?? "Failed to delete product");
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <main>
      <h1>Products</h1>

      {/* Add Product Button */}

      {!showForm && (
        <button type="button" onClick={handleAdd}>
          Add Product
        </button>
      )}

      {/* Product Form */}

      {showForm && (
        <ProductForm
          categories={categories}
          editingProduct={editingProduct}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Redux Error */}

      {error && <p>{error}</p>}

      {/* Product Table */}

      <ProductTable
        products={products}
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
};

export default AdminProduct;
