import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";

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

  await redis.del(`wishlist:${data.userId}`);
  await redis.del(`wishlist:count:${data.userId}`);

  return wishlist;
};

export const getWishlist = async (userId: number) => {
  const cacheKey = `wishlist:${userId}`;

  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

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

  await redis.set(cacheKey, JSON.stringify(wishlist), "EX", 600);

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
  await redis.del(`wishlist:${data.userId}`);

  await redis.del(`wishlist:count:${data.userId}`);

  return removedWishlist;
};

export const countWishlist = async (userId: number) => {
  const cacheKey = `wishlist:count:${userId}`;

  const cache = await redis.get(cacheKey);

  if (cache !== null) {
    return Number(cache);
  }

  const count = await prisma.wishlistItem.count({
    where: {
      userId,
    },
  });

  await redis.set(cacheKey, count.toString(), "EX", 300);

  return count;
};
