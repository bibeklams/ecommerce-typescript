import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CartItem from "../../components/cart/CartItem";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { getCartThunk, clearCartThunk } from "../../redux/slices/cartSlice";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, total, loading, error } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-sm">Loading cart...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Total: Rs. {total}
            </h2>

            <div className="flex items-center gap-4">
              {/* Clear Cart */}
              <button
                type="button"
                onClick={() => dispatch(clearCartThunk())}
                className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline transition-colors"
              >
                Clear Cart
              </button>

              {/* Checkout */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default CartPage;
