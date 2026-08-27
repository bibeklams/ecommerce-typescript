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

  // Get products
  useEffect(() => {
    dispatch(getAllProductsThunk());
  }, [dispatch]);

  // Add product
  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Edit product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Create / Update
  const handleSubmit = async (data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    categoryId: number;
    published: boolean;
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
    } else {
      toast.error(result.error.message ?? "Failed to create product");
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteProductThunk(id));

    if (deleteProductThunk.fulfilled.match(result)) {
      toast.success("Product deleted successfully");
    } else {
      toast.error(result.error.message ?? "Failed to delete product");
    }
  };

  return (
    <main>
      <h1>Products</h1>

      {/* Add Product */}
      {!showForm && (
        <button type="button" onClick={handleAdd}>
          Add Product
        </button>
      )}

      {/* Form */}
      {showForm && (
        <ProductForm
          categories={categories}
          editingProduct={editingProduct}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Redux error */}
      {error && <p>{error}</p>}

      {/* Table */}
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
