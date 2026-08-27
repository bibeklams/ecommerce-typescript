import React from "react";
import { useAppSelector } from "../redux/hooks";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
