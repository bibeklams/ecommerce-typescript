import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { useEffect } from "react";
import { countWishlistThunk } from "../redux/slices/wishlistSlice";
import { countCartItemThunk } from "../redux/slices/cartSlice";
const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, loading } = useAppSelector((state) => state.auth);

  const { count } = useAppSelector((state) => state.wishlist);
  const { count: cartCount } = useAppSelector((state) => state.cart);
  useEffect(() => {
    dispatch(countWishlistThunk());
    dispatch(countCartItemThunk());
  }, [dispatch]);
  const handleLogout = async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      toast.success("Logout successful");
      navigate("/login");
    } else {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/home"
          className="text-xl font-semibold tracking-tight text-gray-900"
        >
          ShopVerse
        </Link>

        {/* Center Navigation */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
          <Link
            to="/home"
            className="group relative py-5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            Home
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
          </Link>

          <Link
            to="/search"
            className="group relative py-5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            Search
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            to="/wishlist"
            className="group relative flex items-center gap-1.5 py-5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <span className="relative">
              <FaHeart className="text-base" />

              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-medium text-white">
                  {count}
                </span>
              )}
            </span>

            <span>Wishlist</span>

            <span className="absolute bottom-0 left-0 h-px w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            to="/cart"
            className="group relative flex items-center gap-1.5 py-5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <span className="relative">
              <FaShoppingCart className="text-base" />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </span>

            <span>Cart</span>

            <span className="absolute bottom-0 left-0 h-px w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            to="/my-order"
            className="group relative py-5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            My Order
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
          </Link>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
