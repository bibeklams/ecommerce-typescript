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
  // when homepage first loads
  useEffect(() => {
    dispatch(
      getAllProductsThunk({
        search: "",
        page: 1,
        limit: 10,
      }),
    );

    dispatch(getAllCategoriesThunk());
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
    console.log("Category:", categoryId);

    // We will connect this
    // to category filtering later.
  };

  return (
    <main>
      <h1>ShopVerse</h1>

      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Categories */}
      {categoryLoading ? (
        <p>Loading categories...</p>
      ) : categoryError ? (
        <p>{categoryError}</p>
      ) : (
        <CategoryList
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Products */}
      {productError ? (
        <p>{productError}</p>
      ) : (
        <ProductList products={products} loading={productLoading} />
      )}
    </main>
  );
};

export default HomePage;
