import api from "./api";
import axios from "axios";
import type { User } from "../types/user";

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const emailVerify = async (data: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-email", data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyResetOtp = async (data: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-reset-otp", data);
  return response.data;
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
}) => {
  const response = await api.patch("/auth/reset-password", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch("/auth/change-password", data);
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);

  return response.data.data.user;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const refreshToken = async () => {
  const response = await refreshApi.post("/auth/refresh-token");

  return response.data;
};

export const profile = async (): Promise<User> => {
  const response = await api.get("/auth/profile");

  return response.data.user;
};
