import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";

export const getCart = async (data: { userId?: number; guestId?: string }) => {
  const cacheKey = data.userId ? `cart:${data.userId}` : `cart:${data.guestId}`;

  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  const cart = await prisma.cart.findUnique({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },

    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,

              gallery: {
                include: {
                  images: {
                    select: {
                      id: true,
                      url: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const result = {
    ...cart,
    total,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 600);

  return result;
};

export const clearCart = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  const cacheKey = data.userId ? `cart:${data.userId}` : `cart:${data.guestId}`;

  const cart = await prisma.cart.findUnique({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  await redis.del(cacheKey);

  return {
    message: "Cart cleared successfully",
  };
};
