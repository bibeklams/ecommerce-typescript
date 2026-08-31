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

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);

  console.log(response.data);

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
