import api from "./api";

import type {
  ProductReviewListResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "../types/review";

export const getProductReviews = async (
  productId: number,
  page = 1,
  limit = 5,
): Promise<ProductReviewListResponse> => {
  const response = await api.get(
    `/reviews/${productId}?page=${page}&limit=${limit}`,
  );

  return response.data;
};

export const createReview = async (
  productId: number,
  data: CreateReviewPayload,
) => {
  const response = await api.post(`/reviews/${productId}`, data);

  return response.data;
};

export const updateReview = async (
  productId: number,
  data: UpdateReviewPayload,
) => {
  const response = await api.put(`/reviews/${productId}`, data);

  return response.data;
};

export const deleteReview = async (productId: number) => {
  const response = await api.delete(`/reviews/${productId}`);

  return response.data;
};
