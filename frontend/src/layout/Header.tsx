import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, loading } = useAppSelector((state) => state.auth);

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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/home"
          className="text-2xl font-bold tracking-tight text-black"
        >
          ShopVerse
        </Link>

        {/* Center Navigation */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
          <Link
            to="/home"
            className="group relative py-5 text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Home
            <span className="absolute bottom-2 left-0 h-[2px] w-0 bg-black transition-all duration-200 group-hover:w-full" />
          </Link>

          <Link
            to="/search"
            className="group relative py-5 text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Search
            <span className="absolute bottom-2 left-0 h-[2px] w-0 bg-black transition-all duration-200 group-hover:w-full" />
          </Link>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
