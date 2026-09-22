import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../redux/hooks";

const SellerRoute = () => {
  const { user, authChecked } = useAppSelector((state) => state.auth);

  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "SELLER" || user.sellerStatus !== "APPROVED") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
