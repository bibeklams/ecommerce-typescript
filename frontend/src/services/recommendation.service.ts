import api from "./api";

import type { Product } from "../types/product";

export interface RecommendedProduct extends Product {
  recommendationScore: number;
}

export const getRecommendationProducts = async (
  productId: number,
): Promise<RecommendedProduct[]> => {
  const response = await api.get(`/products/${productId}/recommendations`);

  return response.data.data;
};
