import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ProtectedRoute = () => {
  const { user, authChecked } = useAppSelector((state) => state.auth);

  // Wait until authentication check finishes
  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  // Authentication check finished and user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
