import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getWishlistThunk } from "../../redux/slices/wishlistSlice";

const WishlistItem = () => {
  const dispatch = useAppDispatch();

  const { items, loading, error } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlistThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square rounded-lg bg-gray-100" />
            <div className="mt-3 h-3 w-3/4 rounded bg-gray-100" />
            <div className="mt-2 h-3 w-1/3 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-16 text-center">
        <p className="text-sm text-gray-500">Your wishlist is empty.</p>
        <Link
          to="/"
          className="mt-3 text-sm font-medium text-gray-900 underline underline-offset-4"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const image = item.product.gallery?.images?.[0]?.url;

        return (
          <div key={item.id} className="group">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              {image ? (
                <img
                  src={image}
                  alt={item.product.name}
                  className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>

            <p className="mt-3 truncate text-sm font-medium text-gray-900">
              {item.product.name}
            </p>

            <p className="mt-0.5 text-sm text-gray-500">
              Rs. {Number(item.product.price).toLocaleString()}
            </p>

            <Link
              to={`/products/${item.product.id}`}
              className="mt-3 block w-full rounded-full bg-gray-900 px-4 py-2 text-center text-xs font-medium text-white transition hover:bg-gray-800"
            >
              View Product
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default WishlistItem;
