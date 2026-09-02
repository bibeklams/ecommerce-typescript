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
    return <p>Loading wishlist...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (items.length === 0) {
    return <p>Your wishlist is empty.</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <img
            src={item.product.gallery?.images?.[0]?.url}
            alt={item.product.name}
          />

          <p>{item.product.name}</p>

          <p>Rs. {item.product.price}</p>

          <Link
            to={`/products/${item.product.id}`}
            className="mt-5 block w-full rounded-full bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View Product
          </Link>
        </div>
      ))}
    </div>
  );
};

export default WishlistItem;
