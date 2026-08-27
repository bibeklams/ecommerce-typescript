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
    <header>
      <nav>
        {/* Home */}
        <Link to="/home">Home</Link>

        {/* Search */}
        <Link to="/search">Search</Link>

        {/* Authentication */}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button type="button" onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
