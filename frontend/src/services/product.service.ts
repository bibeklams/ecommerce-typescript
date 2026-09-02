import api from "./api";

import type { Product } from "../types/product";

export const createProduct = async (data: {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  detailsJson?: object;
  quantity: number;
  images?: File[];
  media?: File[];
}) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", String(data.price));
  formData.append("categoryId", String(data.categoryId));
  formData.append("quantity", String(data.quantity));

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.detailsJson !== undefined) {
    formData.append("detailsJson", JSON.stringify(data.detailsJson));
  }

  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  data.media?.forEach((file) => {
    formData.append("media", file);
  });

  const response = await api.post("/products", formData);

  return response.data.data;
};

export const getAllProducts = async (search = "", page = 1, limit = 20) => {
  const response = await api.get("/products", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data.data;
};

export const getSingleProduct = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);

  return response.data.data;
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    detailsJson?: object;
    quantity?: number;
    categoryId?: number;
    images?: File[];
    media?: File[];
  },
) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.price !== undefined) {
    formData.append("price", String(data.price));
  }

  if (data.categoryId !== undefined) {
    formData.append("categoryId", String(data.categoryId));
  }

  if (data.quantity !== undefined) {
    formData.append("quantity", String(data.quantity));
  }

  if (data.detailsJson !== undefined) {
    formData.append("detailsJson", JSON.stringify(data.detailsJson));
  }

  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  data.media?.forEach((file) => {
    formData.append("media", file);
  });

  const response = await api.put(`/products/${id}`, formData);

  return response.data.data;
};
// =========================
// DELETE PRODUCT
// =========================

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);

  return response.data.data;
};

// =========================
// COUNT PRODUCTS
// =========================

export const countProducts = async (): Promise<number> => {
  const response = await api.get("/products/count");

  return response.data.data;
};
