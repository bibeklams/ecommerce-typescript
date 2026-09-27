import prisma from "../config/prisma.js";
import createError from "http-errors";
import { OrderStatus, PaymentStatus } from "../generated/prisma/client.js";
import redis from "../config/redis.js";

interface CreateOrderItem {
  productId: number;
  quantity: number;
}
interface CreateOrderData {
  userId: number;

  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;

  // Required only for Buy Now.
  // For cart checkout, leave this undefined.
  items?: CreateOrderItem[];
}

export const createOrder = async (data: CreateOrderData) => {
  let orderItems: CreateOrderItem[];
  let cartId: number | null = null;

  if (data.items && data.items.length > 0) {
    orderItems = data.items;
  } else {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: data.userId,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      throw createError(400, "No cart found");
    }

    if (cart.items.length === 0) {
      throw createError(400, "Cart is empty");
    }

    orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    cartId = cart.id;
  }

  const productIds = orderItems.map((item) => item.productId);

  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    throw createError(400, "Duplicate products are not allowed");
  }
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      deletedAt: null,
    },
    include: {
      inventory: true,
    },
  });

  if (products.length !== productIds.length) {
    throw createError(400, "One or more products are no longer available");
  }

  for (const item of orderItems) {
    if (item.quantity <= 0) {
      throw createError(400, `Invalid quantity for product ${item.productId}`);
    }

    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      throw createError(400, `Product ${item.productId} not found`);
    }

    if (!product.inventory) {
      throw createError(
        400,
        `Inventory not found for product ${item.productId}`,
      );
    }

    if (item.quantity > product.inventory.quantity) {
      throw createError(400, `Not enough stock for product ${item.productId}`);
    }
  }

  const total = orderItems.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return sum;
    }

    return sum + Number(product.price) * item.quantity;
  }, 0);

  /*
   * =====================================================
   * 6. CREATE ORDER
   * =====================================================
   */

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: data.userId,

        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,

        total,

        orderItems: {
          create: orderItems.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId,
            );

            if (!product) {
              throw createError(400, `Product ${item.productId} not found`);
            }

            const price = Number(product.price);

            return {
              productId: item.productId,
              quantity: item.quantity,
              price,
              total: price * item.quantity,
            };
          }),
        },
      },

      include: {
        user: true,

        orderItems: {
          include: {
            product: true,
          },
        },

        payments: true,
      },
    });

    /*
     * =================================================
     * REDUCE INVENTORY
     * =================================================
     */

    for (const item of orderItems) {
      const result = await tx.inventory.updateMany({
        where: {
          productId: item.productId,

          // Important for concurrency.
          quantity: {
            gte: item.quantity,
          },
        },

        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      if (result.count === 0) {
        throw createError(
          400,
          `Not enough stock for product ${item.productId}`,
        );
      }
    }

    /*
     * =================================================
     * CLEAR CART ONLY FOR CART CHECKOUT
     * =================================================
     *
     * Buy Now:
     *     cartId === null
     *     → do NOT touch cart
     *
     * Cart checkout:
     *     cartId exists
     *     → clear cart
     */

    if (cartId !== null) {
      await tx.cartItem.deleteMany({
        where: {
          cartId,
        },
      });
    }

    return newOrder;
  });

  /*
   * =====================================================
   * 7. INVALIDATE PRODUCT CACHE
   * =====================================================
   */

  for (const item of orderItems) {
    await redis.del(`product:${item.productId}`);
  }

  /*
   * =====================================================
   * 8. INVALIDATE ORDER CACHE
   * =====================================================
   */

  await redis.del("order:count");

  const orderListKeys = await redis.keys("orders:*");

  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  /*
   * =====================================================
   * 9. INVALIDATE SELLER ORDER CACHE
   * =====================================================
   */

  const sellerIds = [
    ...new Set(
      products
        .map((product) => product.sellerId)
        .filter((sellerId): sellerId is number => sellerId !== null),
    ),
  ];

  for (const sellerId of sellerIds) {
    const sellerOrderKeys = await redis.keys(`seller-orders:${sellerId}:*`);

    if (sellerOrderKeys.length > 0) {
      await redis.del(...sellerOrderKeys);
    }
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
  status?: OrderStatus,
  paymentStatus?: PaymentStatus,
  sortOrder: "asc" | "desc" = "desc",
) => {
  const cacheKey = `orders:search:${search}:page:${page}:limit:${limit}:status:${status ?? "all"}:paymentStatus:${paymentStatus ?? "all"}:sort:${sortOrder}`;

  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,

    ...(status && {
      status,
    }),

    ...(paymentStatus && {
      payments: {
        some: {
          status: paymentStatus,
        },
      },
    }),

    orderItems: {
      some: {
        product: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
    },
  };

  const orders = await prisma.order.findMany({
    where,

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

    skip,
    take: limit,

    orderBy: {
      createdAt: sortOrder,
    },
  });

  const totalOrders = await prisma.order.count({
    where,
  });

  const totalPages = Math.ceil(totalOrders / limit);

  const result = {
    orders,
    page,
    limit,
    totalOrders,
    totalPages,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

export const getAllSellerOrders = async (
  sellerId: number,
  search: string = "",
  page: number = 1,
  limit: number = 10,
  status?: OrderStatus,
  paymentStatus?: PaymentStatus,
  sortOrder: "asc" | "desc" = "desc",
) => {
  const cacheKey = `seller-orders:${sellerId}:search:${search}:page:${page}:limit:${limit}:status:${status ?? "all"}:paymentStatus:${paymentStatus ?? "all"}:sort:${sortOrder}`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,

    ...(status && {
      status,
    }),

    ...(paymentStatus && {
      payments: {
        some: {
          status: paymentStatus,
        },
      },
    }),

    orderItems: {
      some: {
        product: {
          sellerId,

          ...(search && {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          }),
        },
      },
    },
  };

  const orders = await prisma.order.findMany({
    where,

    include: {
      user: {
        select: {
          email: true,
        },
      },

      payments: true,

      orderItems: {
        where: {
          product: {
            sellerId,
          },
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
      },
    },

    skip,
    take: limit,

    orderBy: {
      createdAt: sortOrder,
    },
  });

  const totalOrders = await prisma.order.count({
    where,
  });

  const totalPages = Math.ceil(totalOrders / limit);

  const result = {
    orders,
    page,
    limit,
    totalOrders,
    totalPages,
  };
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
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

export const getSellerOrderById = async (sellerId: number, orderId: number) => {
  const cacheKey = `seller-order:${sellerId}:${orderId}`;

  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
      orderItems: {
        some: {
          product: {
            sellerId,
          },
        },
      },
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
        where: {
          product: {
            sellerId,
          },
        },
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
    include: {
      orderItems: {
        select: {
          product: {
            select: {
              sellerId: true,
            },
          },
        },
      },
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
  const sellerIds = [
    ...new Set(order.orderItems.map((item) => item.product.sellerId)),
  ];

  for (const sellerId of sellerIds) {
    const sellerOrderKeys = await redis.keys(`seller-orders:${sellerId}:*`);

    if (sellerOrderKeys.length > 0) {
      await redis.del(...sellerOrderKeys);
    }
  }
  return updatedOrder;
};

export const updateSellerOrderStatus = async (
  sellerId: number,
  orderId: number,
  status: OrderStatus,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
      orderItems: {
        some: {
          product: {
            sellerId,
          },
        },
      },
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

  await redis.del(`order:${orderId}`);

  const orderListKeys = await redis.keys("orders:*");
  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  // Seller order list caches
  const sellerOrderListKeys = await redis.keys(`seller-orders:${sellerId}:*`);

  if (sellerOrderListKeys.length > 0) {
    await redis.del(...sellerOrderListKeys);
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
    include: {
      orderItems: {
        select: {
          product: {
            select: {
              sellerId: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  if (
    order.status !== OrderStatus.PENDING &&
    order.status !== OrderStatus.CONFIRMED
  ) {
    throw createError(400, "Order cannot be cancelled at this stage");
  }

  const cancelledOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: OrderStatus.CANCELLED,
    },
  });

  // Invalidate individual order cache
  await redis.del(`order:${orderId}`);

  // Invalidate order count
  await redis.del("order:count");

  // Invalidate admin/global order-list caches
  const orderListKeys = await redis.keys("orders:*");

  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  // Invalidate user's order-list caches
  const userOrderKeys = await redis.keys(`user-orders:${userId}:*`);

  if (userOrderKeys.length > 0) {
    await redis.del(...userOrderKeys);
  }
  const sellerIds = [
    ...new Set(order.orderItems.map((item) => item.product.sellerId)),
  ];

  for (const sellerId of sellerIds) {
    const sellerOrderKeys = await redis.keys(`seller-orders:${sellerId}:*`);

    if (sellerOrderKeys.length > 0) {
      await redis.del(...sellerOrderKeys);
    }
  }
  return cancelledOrder;
};

export const cancelSellerOrder = async (sellerId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
      orderItems: {
        some: {
          product: {
            sellerId,
          },
        },
      },
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  // Seller can cancel only before shipping
  if (
    order.status === "SHIPPED" ||
    order.status === "DELIVERED" ||
    order.status === "CANCELLED"
  ) {
    throw createError(
      400,
      `Order cannot be cancelled because it is already ${order.status}`,
    );
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELLED",
    },
  });
  await redis.del(`order:${orderId}`);
  await redis.del("order:count");
  const orderListKeys = await redis.keys("orders:*");

  if (orderListKeys.length > 0) {
    await redis.del(...orderListKeys);
  }

  const sellerOrderKeys = await redis.keys(`seller-orders:${sellerId}:*`);

  if (sellerOrderKeys.length > 0) {
    await redis.del(...sellerOrderKeys);
  }
  return updatedOrder;
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
