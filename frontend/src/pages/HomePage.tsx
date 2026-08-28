import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { getAllProductsThunk } from "../redux/slices/productSlice";
import { getAllCategoriesThunk } from "../redux/slices/categorySlice";

import SearchBar from "../components/user/home/SearchBar";
import CategoryList from "../components/user/home/CategoryList";
import ProductList from "../components/user/home/ProductList";

const HomePage = () => {
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

  // Load products and categories
  useEffect(() => {
    dispatch(
      getAllProductsThunk({
        search: "",
        page: 1,
        limit: 10,
      }),
    );

    dispatch(
      getAllCategoriesThunk({
        search: "",
        page: 1,
        limit: 20,
      }),
    );
  }, [dispatch]);

  // Search products
  const handleSearch = (search: string) => {
    dispatch(
      getAllProductsThunk({
        search,
        page: 1,
        limit: 10,
      }),
    );
  };

  // Filter products by category
  const handleCategoryClick = (categoryId: number) => {
    console.log("Selected category:", categoryId);

    // Category filtering can be connected here
    // once the product API accepts categoryId.
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            ShopVerse
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Find the products you need from our collection.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Categories */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-black">Categories</h2>

            <p className="mt-1 text-sm text-gray-500">
              Browse products by category
            </p>
          </div>

          {categoryLoading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-600">{categoryError}</p>
          ) : (
            <CategoryList
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </section>

        {/* Products */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-black">Products</h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore our latest products
            </p>
          </div>

          {productError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{productError}</p>
            </div>
          ) : (
            <ProductList products={products} loading={productLoading} />
          )}
        </section>
      </div>
    </main>
  );
};

export default HomePage;
