import api from "./api";

type SeoData = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
};

export const createSeo = async (productId: number, data: SeoData) => {
  const response = await api.post(`/products/${productId}/seo`, {
    ...data,
    productId,
  });

  return response.data;
};

export const updateSeo = async (productId: number, data: SeoData) => {
  const response = await api.put(`/products/${productId}/seo`, data);

  return response.data;
};
