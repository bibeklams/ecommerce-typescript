import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const AdminRoute = () => {
  const { user, authChecked } = useAppSelector((state) => state.auth);

  // Wait until getProfile() finishes
  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  // Authentication check finished and no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
