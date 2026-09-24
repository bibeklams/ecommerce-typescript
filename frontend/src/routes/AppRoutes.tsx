import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";

import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

import VerifyEmailPage from "../components/auth/VerifyEmailPage";
import LoginPage from "../components/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyResetOtpPage from "../pages/auth/VerifyResetOtpPage";
import RegisterPage from "../components/auth/RegisterPage";

import WishListPage from "../pages/wishlist/wishlistPage";
import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import MyOrdersPage from "../pages/order/MyOrdersPage";
import OrderDetailsPage from "../pages/order/OrderDetailsPage";

import OrderSuccessPage from "../pages/order/OrderSuccessPage";

import SellerLayout from "../layout/SellerLayout";
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProduct from "../pages/seller/product/SellerProduct";
import SellerOrderPage from "../pages/seller/order/SellerOrdersPage";
import SellerOrderDetailsPage from "../pages/seller/order/SellerOrderDetailsPage";
// import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDashboardPage from "../pages/admin/dashboard/AdminDashboardPage";
import AdminProduct from "../pages/admin/AdminProduct";
import AdminCategory from "../pages/admin/AdminCategory";
// import AdminUser from "../pages/admin/AdminUser";
import AdminUsersPage from "../pages/admin/user/AdminUsersPage";
import AdminUserDetailsPage from "../pages/admin/user/AdminUserDetailsPage";
import AdminOrdersPage from "../pages/admin/order/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/order/AdminOrderDetailsPage";
import SellerRoute from "./SellerRoute";
import SellerRequests from "../pages/admin/user/seller/SellerRequests";

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
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
      </Route>

      {/**Seller Route */}
      <Route element={<SellerRoute />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProduct />} />
          <Route path="orders" element={<SellerOrderPage />} />
          <Route path="orders/:orderId" element={<SellerOrderDetailsPage />} />
        </Route>
      </Route>
      {/* =========================
          ADMIN ROUTES
          Login + ADMIN role required
      ========================= */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="seller-request" element={<SellerRequests />} />
          <Route path="users/:userId" element={<AdminUserDetailsPage />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
