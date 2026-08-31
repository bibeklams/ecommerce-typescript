import prisma from "../config/prisma.js";
import createError from "http-errors";

export const createWishlist = async (data: {
  userId: number;
  productId: number;
}) => {
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  const existingWishlist = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: data.userId,
        productId: data.productId,
      },
    },
  });

  if (existingWishlist) {
    throw createError(400, "Product already in wishlist");
  }

  const wishlist = await prisma.wishlistItem.create({
    data: {
      userId: data.userId,
      productId: data.productId,
    },
  });

  return wishlist;
};
export const getWishlist = async (userId: number) => {
  const wishlist = await prisma.wishlistItem.findMany({
    where: {
      user: {
        id: userId,
        deletedAt: null,
      },
      product: {
        deletedAt: null,
      },
    },
    include: {
      product: true,
    },
  });

  return wishlist;
};

export const removeWishlist = async (data: {
  userId: number;
  productId: number;
}) => {
  const wishlist = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: data.userId,
        productId: data.productId,
      },
    },
  });

  if (!wishlist) {
    throw createError(404, "Wishlist item not found");
  }

  const removedWishlist = await prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId: data.userId,
        productId: data.productId,
      },
    },
  });

  return removedWishlist;
};
export const countWishlist = async (userId: number) => {
  const wishlist = await prisma.wishlistItem.count({
    where: {
      user: {
        id: userId,
      },
    },
  });
  return wishlist;
};
