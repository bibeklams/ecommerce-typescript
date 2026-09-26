import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { getAllProductsThunk } from "../redux/slices/productSlice";

import ProductList from "../components/user/home/ProductList";

const CategoryProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const dispatch = useAppDispatch();

  const {
    products,
    loading: productLoading,
    error: productError,
  } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (!categoryId) return;

    const id = Number(categoryId);

    if (Number.isNaN(id)) return;

    dispatch(
      getAllProductsThunk({
        search: "",
        page: 1,
        limit: 10,
        categoryId: id,
      }),
    );
  }, [categoryId, dispatch]);

  if (productError) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back to Home
          </Link>

          <div className="mt-10 rounded-2xl bg-red-50 p-4">
            <p className="text-sm text-red-600">{productError}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Back */}
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Category Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse products from this category.
          </p>
        </div>

        {/* Products */}
        <section className="mt-10">
          <ProductList products={products} loading={productLoading} />
        </section>
      </div>
    </main>
  );
};

export default CategoryProductsPage;
