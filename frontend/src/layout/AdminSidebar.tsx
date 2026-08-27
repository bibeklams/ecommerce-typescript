import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";

const AdminSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    <aside>
      <h2>Admin Dashboard</h2>

      <nav>
        <NavLink to="/admin">Dashboard</NavLink>

        <NavLink to="/admin/products">Products</NavLink>

        <NavLink to="/admin/categories">Categories</NavLink>

        <NavLink to="/admin/users">Users</NavLink>

        <NavLink to="/admin/seo">SEO</NavLink>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
