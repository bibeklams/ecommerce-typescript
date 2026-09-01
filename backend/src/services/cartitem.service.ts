import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";

export const addToCart = async (data: {
  productId: number;
  userId?: number;
  guestId?: string;
  quantity: number;
}) => {
  const cacheKey = data.userId ? `cart:${data.userId}` : `cart:${data.guestId}`;

  const countCacheKey = data.userId
    ? `cart:count:${data.userId}`
    : `cart:count:${data.guestId}`;

  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  const cart = await prisma.cart.findFirst({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: data.quantity,
        },
      },
    });

    await redis.del(cacheKey, countCacheKey);

    return updatedItem;
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity,
    },
  });

  await redis.del(cacheKey, countCacheKey);

  return cartItem;
};

export const updateCartItem = async (data: {
  productId: number;
  userId?: number;
  guestId?: string;
  quantity: number;
}) => {
  const cacheKey = data.userId ? `cart:${data.userId}` : `cart:${data.guestId}`;

  const countCacheKey = data.userId
    ? `cart:count:${data.userId}`
    : `cart:count:${data.guestId}`;

  const cart = await prisma.cart.findUnique({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  if (!cartItem) {
    throw createError(404, "Product is not in cart");
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },
    data: {
      quantity: data.quantity,
    },
  });

  await redis.del(cacheKey, countCacheKey);

  return updatedItem;
};

export const removeCartItem = async (data: {
  productId: number;
  userId?: number;
  guestId?: string;
}) => {
  const cacheKey = data.userId ? `cart:${data.userId}` : `cart:${data.guestId}`;

  const countCacheKey = data.userId
    ? `cart:count:${data.userId}`
    : `cart:count:${data.guestId}`;

  const cart = await prisma.cart.findUnique({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  if (!existingItem) {
    throw createError(404, "Cart item not found");
  }

  const removedCartItem = await prisma.cartItem.delete({
    where: {
      id: existingItem.id,
    },
  });

  await redis.del(cacheKey, countCacheKey);

  return removedCartItem;
};

export const clearCart = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  const cacheKey = data.userId ? `cart:${data.userId}` : `cart:${data.guestId}`;

  const countCacheKey = data.userId
    ? `cart:count:${data.userId}`
    : `cart:count:${data.guestId}`;

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

  await redis.del(cacheKey, countCacheKey);

  return {
    message: "Cart cleared successfully",
  };
};

export const countCartItems = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  const countCacheKey = data.userId
    ? `cart:count:${data.userId}`
    : `cart:count:${data.guestId}`;

  const cache = await redis.get(countCacheKey);

  if (cache !== null) {
    return Number(cache);
  }

  const cart = await prisma.cart.findUnique({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  const count = await prisma.cartItem.count({
    where: {
      cartId: cart.id,
    },
  });

  await redis.set(countCacheKey, count.toString(), "EX", 600);

  return count;
};
