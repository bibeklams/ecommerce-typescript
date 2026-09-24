import createError from "http-errors";
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";

export const createReview = async (
  userId: number,
  productId: number,
  rating: number,
  comment?: string,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "No product found");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(403, "Unauthorized user");
  }

  const existingProductReview = await prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingProductReview) {
    throw createError(400, "Review already exists");
  }

  const createReview = await prisma.productReview.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });
  await redis.del(`productReview:${productId}`);
  return createReview;
};

export const getProductReviews = async (productId: number) => {
  const cacheKey = `productReview:${productId}`;

  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

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
  });

  if (productReviews.length === 0) {
    throw createError(404, "No product reviews");
  }

  const result = {
    productReviews,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

export const updateReview = async (
  userId: number,
  productId: number,
  rating?: number,
  comment?: string,
) => {
  const existingProductReview = await prisma.productReview.findFirst({
    where: {
      userId_productId: {
        userId,
        productId,
      },
      deletedAt: null,
    },
  });

  if (!existingProductReview) {
    throw createError(404, "No review found");
  }

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

  await redis.del(`productReview:${productId}`);

  return updatedReview;
};
export const deleteReview = async (userId: number, productId: number) => {
  const productReview = await prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!productReview || productReview.deletedAt) {
    throw createError(404, "No review found");
  }

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
  await redis.del(`productReview:${productId}`);
  return deletedReview;
};
