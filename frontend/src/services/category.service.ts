import api from "./api";
import type { Category } from "../types/category";

export type GetAllCategoriesResponse = {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// CREATE
export const createCategory = async (data: {
  name: string;
  description?: string;
  parentId?: number;
  categoryImage?: File;
}) => {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.parentId !== undefined) {
    formData.append("parentId", String(data.parentId));
  }

  if (data.categoryImage !== undefined) {
    formData.append("categoryImage", data.categoryImage);
  }

  const response = await api.post("/categories", formData);

  return response.data.data;
};

// GET ALL
export const getAllCategories = async (
  search = "",
  page = 1,
  limit = 20,
): Promise<GetAllCategoriesResponse> => {
  const response = await api.get("/categories", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data.data;
};

// GET SINGLE
export const getSingleCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);

  return response.data.data;
};

// UPDATE
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

  return response.data.data;
};

// DELETE
export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data.data;
};

// COUNT
export const countCategories = async (): Promise<number> => {
  const response = await api.get("/categories/count");

  return response.data.data;
};
