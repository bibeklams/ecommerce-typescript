import api from "./api";
import type { User } from "../types/user";

export const applyForSeller = async (): Promise<User> => {
  const response = await api.post("/sellers/apply-seller");

  return response.data;
};

export const approveSeller = async (userId: number): Promise<User> => {
  const response = await api.patch(`/sellers/${userId}/approve-seller`);

  return response.data;
};

export const rejectSeller = async (userId: number): Promise<User> => {
  const response = await api.patch(`/sellers/${userId}/reject-seller`);

  return response.data;
};

export const deactivateSeller = async (): Promise<User> => {
  const response = await api.patch("/sellers/deactive-seller");

  return response.data;
};
