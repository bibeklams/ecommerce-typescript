import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";

import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";

import WishListPage from "../pages/wishlist/wishlistPage";
import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import MyOrdersPage from "../pages/order/MyOrdersPage";
import OrderDetailsPage from "../pages/order/OrderDetailsPage";

import OrderSuccessPage from "../pages/order/OrderSuccessPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProduct from "../pages/admin/AdminProduct";
import AdminCategory from "../pages/admin/AdminCategory";
import AdminUser from "../pages/admin/AdminUser";
import AdminOrdersPage from "../pages/admin/order/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/order/AdminOrderDetailsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route path="/wishlist" element={<WishListPage />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* =========================
          PROTECTED USER ROUTES
          Login required
      ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-order" element={<MyOrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
      </Route>
      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
      {/* =========================
          ADMIN ROUTES
          Login + ADMIN role required
      ========================= */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="products" element={<AdminProduct />} />

          <Route path="categories" element={<AdminCategory />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUser />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
