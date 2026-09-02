import api from "./api";

// CREATE
export const createWishlist = async (productId: number) => {
  const response = await api.post(`/wishlist/${productId}`);

  return response.data.data;
};

// GET ALL
export const getWishlist = async () => {
  const response = await api.get("/wishlist");

  return response.data.data;
};

// REMOVE
export const removeWishlist = async (productId: number) => {
  const response = await api.delete(`/wishlist/${productId}`);

  return response.data.data;
};

// COUNT
export const countWishlist = async () => {
  const response = await api.get("/wishlist/count");

  return response.data.data;
};
