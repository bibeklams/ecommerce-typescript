import createError from "http-errors";

import prisma from "../config/prisma.js";
import redis from "../config/redis.js";

export const createReview = async (
  userId: number,
  productId: number,
  rating: number,
  comment?: string,
) => {
  // Check whether product exists and is not deleted
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "No product found");
  }

  // Check whether user exists and is not deleted
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(403, "Unauthorized user");
  }

  // Check whether this user already reviewed this product
  const existingProductReview = await prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  // Active review already exists
  if (existingProductReview && existingProductReview.deletedAt === null) {
    throw createError(400, "Review already exists");
  }

  // Previously deleted review exists → restore it
  if (existingProductReview && existingProductReview.deletedAt !== null) {
    const restoredReview = await prisma.productReview.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        rating,
        comment,
        deletedAt: null,
      },
    });

    const keys = await redis.keys(`productReviews:${productId}:*`);

    if (keys.length > 0) {
      await redis.del(...keys);
    }

    return restoredReview;
  }

  // No previous review → create new review
  const review = await prisma.productReview.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });

  // Invalidate all cached review pages for this product
  const keys = await redis.keys(`productReviews:${productId}:*`);

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return review;
};

export const getProductReviews = async (
  productId: number,
  page = 1,
  limit = 5,
) => {
  const skip = (page - 1) * limit;

  const cacheKey = `productReviews:${productId}:page:${page}:limit:${limit}`;

  // Check Redis cache
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // Get reviews
  const productReviews = await prisma.productReview.findMany({
    where: {
      productId,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get total number of reviews
  const totalReviews = await prisma.productReview.count({
    where: {
      productId,
      deletedAt: null,
    },
  });

  const result = {
    productReviews,
    pagination: {
      page,
      limit,
      total: totalReviews,
      hasMore: skip + productReviews.length < totalReviews,
    },
  };

  // Cache for 5 minutes
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

export const updateReview = async (
  userId: number,
  productId: number,
  rating?: number,
  comment?: string,
) => {
  // Find the review belonging to this user and product
  const existingProductReview = await prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  // Review doesn't exist OR was soft deleted
  if (!existingProductReview || existingProductReview.deletedAt !== null) {
    throw createError(404, "No review found");
  }

  // Update only the fields that were provided
  const updatedReview = await prisma.productReview.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: {
      ...(rating !== undefined && { rating }),
      ...(comment !== undefined && { comment }),
    },
  });

  // Invalidate all cached review pages
  const keys = await redis.keys(`productReviews:${productId}:*`);

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return updatedReview;
};

export const deleteReview = async (userId: number, productId: number) => {
  // Find the review
  const productReview = await prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  // Check whether review exists and is not already deleted
  if (!productReview || productReview.deletedAt) {
    throw createError(404, "No review found");
  }

  // Soft delete
  const deletedReview = await prisma.productReview.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // Invalidate all cached review pages
  const keys = await redis.keys(`productReviews:${productId}:*`);

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return deletedReview;
};
