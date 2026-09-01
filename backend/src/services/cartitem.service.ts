import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";

export const addToCart = async (data: {
  productId: number;
  userId?: number;
  guestId?: string;
  quantity: number;
}) => {
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
    },
  });
  if (!product) {
    throw createError(400, "No product found");
  }
  const cart = await prisma.cart.findFirst({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });
  if (!cart) {
    throw createError(400, "No cart found");
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
    return updatedItem;
  }
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity,
    },
  });
  return cartItem;
};

export const updateCartItem = async (data: {
  productId: number;
  userId?: number;
  guestId?: string;
  quantity: number;
}) => {
  // 1. Check product
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
    where: data.userId
      ? {
          userId: data.userId,
        }
      : {
          guestId: data.guestId,
        },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  // 3. Find CartItem
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

  return updatedItem;
};

export const removeCartItem = async (data: {
  productId: number;
  userId?: number;
  guestId?: string;
}) => {
  // 1. Find cart
  const cart = await prisma.cart.findFirst({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError(404, "Cart not found");
  }

  // 2. Find cart item
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

  // 3. Delete cart item
  const removedCartItem = await prisma.cartItem.delete({
    where: {
      id: existingItem.id,
    },
  });

  return removedCartItem;
};
export const clearCart = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  const cart = await prisma.cart.findFirst({
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

  return { message: "Cart cleared successfully" };
};
export const countCartItems = async (data: {
  userId?: number;
  guestId?: string;
}) => {
  const cart = await prisma.cart.findFirst({
    where: data.userId ? { userId: data.userId } : { guestId: data.guestId },
  });

  if (!cart) {
    throw createError("No cart found");
  }
  const count = await prisma.cartItem.count({
    where: {
      cartId: cart.id,
    },
  });

  return count;
};

// const cart = await prisma.cart.findUnique({
//   where: {
//     id: cart.id,
//   },
//   include: {
//     items: {
//       include: {
//         product: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//           },
//         },
//       },
//     },
//   },
// });
