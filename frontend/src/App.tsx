import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { getProfile } from "./redux/slices/authSlice";

import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
