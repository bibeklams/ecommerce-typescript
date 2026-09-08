import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { removeCartItemThunk } from "../../redux/slices/cartSlice";

import {
  addToWishlist,
  removeWishlistThunk,
} from "../../redux/slices/wishlistSlice";

import type { CartItem as CartItemType } from "../../types/cartItem";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();

  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some(
    (wishlistItem) => wishlistItem.productId === item.productId,
  );

  const handleRemove = () => {
    dispatch(removeCartItemThunk(item.productId));
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeWishlistThunk(item.productId));
    } else {
      dispatch(addToWishlist(item.productId));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Checkbox */}
      <input
        type="checkbox"
        className="w-4 h-4 mt-1 sm:mt-0 accent-blue-600 cursor-pointer"
      />

      {/* Product Image */}
      {item.product?.gallery?.images?.[0]?.url && (
        <img
          src={item.product.gallery.images[0].url}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-md border border-gray-100 flex-shrink-0"
        />
      )}

      {/* Product Name + Price */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
          {item.product?.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1">Rs. {item.product?.price}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1">
        <span className="w-6 text-center text-sm font-medium text-gray-900">
          {item.quantity}
        </span>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={handleRemove}
        className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline transition-colors"
      >
        Delete
      </button>

      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        className={`text-2xl transition-colors ${
          isWishlisted ? "text-pink-600" : "text-gray-400 hover:text-pink-500"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default CartItem;
