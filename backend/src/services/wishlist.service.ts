import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";

export const createWishlist = async (data: {
  userId?: number;
  guestId?: string;
  productId: number;
}) => {
  // Exactly one identity must be provided
  if (!data.userId && !data.guestId) {
    throw createError(400, "User ID or Guest ID is required");
  }

  if (data.userId && data.guestId) {
    throw createError(400, "Provide either user ID or guest ID, not both");
  }

  // Check product
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // Check duplicate wishlist item
  const existingWishlist = await prisma.wishlistItem.findFirst({
    where: {
      productId: data.productId,

      ...(data.userId ? { userId: data.userId } : { guestId: data.guestId }),
    },
  });

  if (existingWishlist) {
    throw createError(400, "Product already in wishlist");
  }

  // Create wishlist
  const wishlist = await prisma.wishlistItem.create({
    data: {
      userId: data.userId,
      guestId: data.guestId,
      productId: data.productId,
    },
  });

  // Cache key
  const ownerId = data.userId ? `user:${data.userId}` : `guest:${data.guestId}`;

  await redis.del(`wishlist:${ownerId}`);
  await redis.del(`wishlist:count:${ownerId}`);

  return wishlist;
};

export const getWishlist = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  // Exactly one identity is required
  if (!data.userId && !data.guestId) {
    throw createError(400, "User ID or Guest ID is required");
  }

  if (data.userId && data.guestId) {
    throw createError(400, "Provide either user ID or guest ID, not both");
  }

  // Create cache key based on owner
  const ownerId = data.userId ? `user:${data.userId}` : `guest:${data.guestId}`;

  const cacheKey = `wishlist:${ownerId}`;

  // Check Redis cache
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // Get wishlist from database
  const wishlist = await prisma.wishlistItem.findMany({
    where: {
      product: {
        deletedAt: null,
      },
      ...(data.userId
        ? {
            userId: data.userId,
            user: {
              deletedAt: null,
            },
          }
        : {
            guestId: data.guestId,
          }),
    },

    include: {
      product: {
        include: {
          gallery: {
            include: {
              images: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  await redis.set(cacheKey, JSON.stringify(wishlist), "EX", 600);

  return wishlist;
};

export const removeWishlist = async (data: {
  userId?: number;
  guestId?: string;
  productId: number;
}) => {
  // Exactly one identity is required
  if (!data.userId && !data.guestId) {
    throw createError(400, "User ID or Guest ID is required");
  }

  if (data.userId && data.guestId) {
    throw createError(400, "Provide either user ID or Guest ID, not both");
  }

  // Find the wishlist item
  const wishlist = await prisma.wishlistItem.findFirst({
    where: {
      productId: data.productId,

      ...(data.userId
        ? {
            userId: data.userId,
          }
        : {
            guestId: data.guestId,
          }),
    },
  });

  if (!wishlist) {
    throw createError(404, "Wishlist item not found");
  }

  // Delete using the unique primary key
  const removedWishlist = await prisma.wishlistItem.delete({
    where: {
      id: wishlist.id,
    },
  });

  // Build the same owner-based cache key
  const ownerId = data.userId ? `user:${data.userId}` : `guest:${data.guestId}`;

  // Invalidate wishlist cache
  await redis.del(`wishlist:${ownerId}`);
  await redis.del(`wishlist:count:${ownerId}`);

  return removedWishlist;
};

export const countWishlist = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  // Exactly one identity is required
  if (!data.userId && !data.guestId) {
    throw createError(400, "User ID or Guest ID is required");
  }

  if (data.userId && data.guestId) {
    throw createError(400, "Provide either user ID or Guest ID, not both");
  }

  // Create owner-based cache key
  const ownerId = data.userId ? `user:${data.userId}` : `guest:${data.guestId}`;

  const cacheKey = `wishlist:count:${ownerId}`;

  // Check Redis
  const cache = await redis.get(cacheKey);

  if (cache !== null) {
    return Number(cache);
  }

  const count = await prisma.wishlistItem.count({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  // Store count in Redis for 5 minutes
  await redis.set(cacheKey, count.toString(), "EX", 300);

  return count;
};
