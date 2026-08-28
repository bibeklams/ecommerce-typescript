import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";

import AdminRoute from "./AdminRoute";
// import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProduct from "../pages/admin/AdminProduct";
import AdminCategory from "../pages/admin/AdminCategory";
import AdminUser from "../pages/admin/AdminUser";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages that should have Header */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="users" element={<AdminUser />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
