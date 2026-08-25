import api from "./api";
import type { Category } from "../types/Category";
export const createCategory = async (data: {
  name: string;
  description?: string;
  parentId?: number;
  categoryImage?: File;
}) => {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.parentId !== undefined) {
    formData.append("parentId", String(data.parentId));
  }

  if (data.categoryImage) {
    formData.append("categoryImage", data.categoryImage);
  }

  const response = await api.post("/categories", formData);

  return response.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

export const getSingleCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories:${id}`);
  return response.data;
};

export const countCategories = async () => {
  const response = await api.get("/categories/count");
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    parentId?: number;
    categoryImage?: File;
  },
) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.parentId !== undefined) {
    formData.append("parentId", String(data.parentId));
  }

  if (data.categoryImage !== undefined) {
    formData.append("categoryImage", data.categoryImage);
  }

  const response = await api.put(`/categories/${id}`, formData);

  return response.data;
};
