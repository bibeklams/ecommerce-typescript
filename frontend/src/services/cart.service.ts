import api from "./api";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart");
  return response.data.data;
};
