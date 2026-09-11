import prisma from "../config/prisma.js";
import createError from "http-errors";
import { OrderStatus } from "../generated/prisma/client.js";
import redis from "../config/redis.js";

export const createOrder = async (data: {
  userId: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}) => {
  // 1. Find user's cart
  const cart = await prisma.cart.findUnique({
    where: {
      userId: data.userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              inventory: true,
            },
          },
        },
      },
    },
  });

  console.log("Looking for userId:", data.userId);
  console.log("Cart found:", cart);

  if (!cart) {
    throw createError(400, "No cart found");
  }

  if (cart.items.length === 0) {
    throw createError(400, "Cart is empty");
  }

  // 2. Validate products and stock
  for (const item of cart.items) {
    if (item.product.deletedAt !== null) {
      throw createError(
        400,
        `Product ${item.productId} is no longer available`,
      );
    }

    if (item.quantity <= 0) {
      throw createError(400, `Invalid quantity for product ${item.productId}`);
    }

    if (
      item.product.inventory &&
      item.quantity > item.product.inventory.quantity
    ) {
      throw createError(400, `Not enough stock for product ${item.productId}`);
    }
  }

  // 3. Calculate total
  const total = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  // 4. Create order + order items + clear cart
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        userId: data.userId,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        total,

        // Create OrderItems
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.product.price),
            total: Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart only after order + order items are created
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return newOrder;
  });

  console.log("ORDER CREATED:", order);

  // 5. Invalidate order cache
  await redis.del("order:count");

  const orderListKeys = await redis.keys("orders:*");

  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  return order;
};

export const getMyOrders = async (
  userId: number,
  search: string = "",
  limit: number = 20,
  page: number = 1,
) => {
  // 1. Create Redis cache key
  const cacheKey = `orders:${userId}:search:${search}:limit:${limit}:page:${page}`;

  // 2. Check Redis
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // 3. Calculate how many orders to skip
  const skip = (page - 1) * limit;

  // 4. Find user's orders
  const orders = await prisma.order.findMany({
    where: {
      userId,
      deletedAt: null,

      // Search by product name
      orderItems: {
        some: {
          product: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    },

    // Get order items and product information
    include: {
      orderItems: {
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
      },
    },

    // Pagination
    skip,
    take: limit,

    // Newest orders first
    orderBy: {
      createdAt: "desc",
    },
  });

  // 5. Count total matching orders
  const totalOrders = await prisma.order.count({
    where: {
      userId,
      deletedAt: null,

      orderItems: {
        some: {
          product: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    },
  });

  // 6. Calculate total pages
  const totalPages = Math.ceil(totalOrders / limit);

  // 7. Create response
  const result = {
    orders,
    page,
    limit,
    totalOrders,
    totalPages,
  };

  // 8. Store result in Redis for 5 minutes
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  // 9. Return result
  return result;
};

export const getAllOrders = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
) => {
  const cacheKey = `orders:search:${search}:page:${page}:limit:${limit}`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
  const skip = (page - 1) * limit;

  const orders = await prisma.order.findMany({
    where: {
      deletedAt: null,

      // Search by product name
      orderItems: {
        some: {
          product: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    },

    include: {
      user: {
        select: {
          email: true,
        },
      },

      payments: true,

      orderItems: {
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
      },
    },

    // Pagination
    skip,
    take: limit,

    // Newest orders first
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalOrders = await prisma.order.count({
    where: {
      deletedAt: null,

      orderItems: {
        some: {
          product: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    },
  });
  const totalPages = Math.ceil(totalOrders / limit);
  const result = {
    orders,
    page,
    limit,
    totalOrders,
    totalPages,
  };

  // 8. Store result in Redis for 5 minutes
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  // 9. Return result
  return result;
};

export const getMyOrderById = async (userId: number, orderId: number) => {
  const cacheKey = `order:${userId}:${orderId}`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
      deletedAt: null,
    },
    include: {
      orderItems: {
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
      },
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }
  await redis.set(cacheKey, JSON.stringify(order), "EX", 300);
  return order;
};
export const getOrderById = async (orderId: number) => {
  const cacheKey = `order:${orderId}`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      payments: true,
      orderItems: {
        include: {
          product: {
            include: {
              category: true,
              gallery: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }
  await redis.set(cacheKey, JSON.stringify(order), "EX", 300);
  return order;
};
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  // Invalidate individual order cache
  await redis.del(`order:${orderId}`);

  // Invalidate order list caches
  const orderListKeys = await redis.keys("orders:*");

  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  return updatedOrder;
};
export const cancelOrder = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
      deletedAt: null,
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
    throw createError(400, "Order cannot be cancelled at this stage");
  }

  const cancelledOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELLED",
    },
  });

  // Invalidate individual order caches
  await redis.del(`order:${orderId}`);
  await redis.del(`order:${userId}:${orderId}`);

  // Invalidate cached order lists
  const orderListKeys = await redis.keys("orders:*");

  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  return cancelledOrder;
};
export const countOrder = async () => {
  const cacheKey = "order:count";

  const cache = await redis.get(cacheKey);

  if (cache) {
    return Number(cache);
  }
  const countOrder = await prisma.order.count({ where: { deletedAt: null } });
  await redis.set(cacheKey, countOrder.toString(), "EX", 300);
  return countOrder;
};
