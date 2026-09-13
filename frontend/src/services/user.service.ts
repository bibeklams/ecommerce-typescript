import api from "./api";

import type { UserListResponse, User } from "../types/user";

export const getAllUsers = async (
  search: string,
  page: number,
  limit: number,
): Promise<UserListResponse> => {
  const response = await api.get("/users", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data.data;
};

export const getSingleUser = async (userId: number): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data.data;
};
