import api from "./api";
import type { Product } from "../types/Product";
export const createProduct = async (data: {
  name: string;
  slug: string;
  price: number;
  description: string;
  categoryId: number;
  detailsJson: string;
  images: File[];
  media: File[];
}) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("slug", data.slug);
  formData.append("price", String(data.price));
  formData.append("description", data.description);
  formData.append("categoryId", String(data.categoryId));
  formData.append("detailsJson", data.detailsJson);

  data.images.forEach((image) => {
    formData.append("images", image);
  });

  data.media.forEach((file) => {
    formData.append("media", file);
  });

  const response = await api.post("/products", formData);

  return response.data;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data;
};

export const getSingleProduct = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    images?: File[];
    media?: File[];
  },
) => {
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

  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  data.media?.forEach((file) => {
    formData.append("media", file);
  });

  const response = await api.put(`/products/${id}`, formData);

  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const countProducts = async () => {
  const response = await api.get("/products/count");
  return response.data;
};
