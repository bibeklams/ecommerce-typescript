import api from "./api";

import type { Product } from "../types/product";

// =========================
// CREATE PRODUCT DATA
// =========================

export type CreateProductData = {
  name: string;
  slug: string;
  price: number;
  description?: string;
  categoryId: number;
  detailsJson?: object;
  images?: File[];
  media?: File[];
};

// =========================
// UPDATE PRODUCT DATA
// =========================

export type UpdateProductData = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  detailsJson?: object;
  images?: File[];
  media?: File[];
};

// =========================
// CREATE PRODUCT
// =========================

export const createProduct = async (
  data: CreateProductData,
): Promise<Product> => {
  const formData = new FormData();

  formData.append("name", data.name);

  formData.append("slug", data.slug);

  formData.append("price", String(data.price));

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  formData.append("categoryId", String(data.categoryId));

  if (data.detailsJson !== undefined) {
    formData.append("detailsJson", JSON.stringify(data.detailsJson));
  }

  // Images

  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  // Media

  data.media?.forEach((file) => {
    formData.append("media", file);
  });

  const response = await api.post("/products", formData);

  return response.data.data;
};

// =========================
// GET ALL PRODUCTS
// =========================

// export const getAllProducts = async (): Promise<Product[]> => {
//   const response = await api.get("/products");

//   return response.data.data;
// };
export const getAllProducts = async (
  search: string = "",
  page: number = 1,
  limit: number = 10,
) => {
  const response = await api.get("/products", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data.data;
};
// =========================
// GET SINGLE PRODUCT
// =========================

export const getSingleProduct = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);

  return response.data.data;
};

// =========================
// UPDATE PRODUCT
// =========================

export const updateProduct = async (
  id: number,
  data: UpdateProductData,
): Promise<Product> => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.slug !== undefined) {
    formData.append("slug", data.slug);
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

  if (data.detailsJson !== undefined) {
    formData.append("detailsJson", JSON.stringify(data.detailsJson));
  }

  // New images

  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  // New media

  data.media?.forEach((file) => {
    formData.append("media", file);
  });

  const response = await api.put(`/products/${id}`, formData);

  return response.data.data;
};

// =========================
// DELETE PRODUCT
// =========================

export const deleteProduct = async (id: number): Promise<Product> => {
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
