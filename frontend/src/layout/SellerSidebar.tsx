import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";

const SellerSidebar = () => {
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-xl font-bold text-gray-900">Seller Dashboard</h2>

        <p className="mt-1 text-xs text-gray-500">ShopVerse Seller Center</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
        <NavLink to="/seller" end className={navLinkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/seller/products" className={navLinkClass}>
          Products
        </NavLink>

        <NavLink to="/seller/orders" className={navLinkClass}>
          Orders
        </NavLink>

        {/* Logout */}
        <div className="mt-auto border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SellerSidebar;
