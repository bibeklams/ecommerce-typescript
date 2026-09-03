import api from "./api";

export const addToCart = async (data: {
  productId: number;
  quantity: number;
}) => {
  const response = await api.post(`/cart/items/${data.productId}`, {
    quantity: data.quantity,
  });

  return response.data.data;
};

export const updateCartItem = async (data: {
  productId: number;
  quantity: number;
}) => {
  const response = await api.patch(`/cart/items/${data.productId}`, {
    quantity: data.quantity,
  });

  return response.data.data;
};

export const removeCartItem = async (productId: number) => {
  const response = await api.delete(`/cart/items/${productId}`);

  return response.data.data;
};

export const countCartItem = async () => {
  const response = await api.get(`/cart/items/count`);

  return response.data.data;
};
