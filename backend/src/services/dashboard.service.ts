import prisma from "../config/prisma.js";

export const getDashboardStats = async () => {
  const users = await prisma.user.count({
    where: {
      deletedAt: null,
    },
  });
  const products = await prisma.product.count({
    where: {
      deletedAt: null,
    },
  });
  const orders = await prisma.order.count();

  return {
    users,
    products,
    orders,
  };
};

export const getRecentOrders = async () => {
  const orders = await prisma.order.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
            gallery: {
              images: true,
            },
          },
        },
      },
      payments: true,
    },
  });

  return orders;
};

export const getTopSellingProducts = async () => {
  // 1. Find the top 5 products based on total quantity sold
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],

    _sum: {
      quantity: true,
    },

    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },

    take: 5,
  });

  // 2. Get the product IDs
  const productIds = topProducts.map((item) => item.productId);

  // 3. Get product information
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      gallery: {
        include: {
          images: true,
        },
      },
    },
  });

  // 4. Combine product information with quantity sold
  const result = topProducts.map((topProduct) => {
    const product = products.find(
      (product) => product.id === topProduct.productId,
    );

    return {
      id: topProduct.productId,
      name: product?.name ?? "Unknown Product",
      quantitySold: topProduct._sum.quantity ?? 0,
      gallery: product?.gallery ?? null,
    };
  });

  return result;
};
export const getSalesOverview = async () => {
  const orders = await prisma.order.findMany({
    where: {
      deletedAt: null,
      status: {
        not: "CANCELLED",
      },
      payments: {
        some: {
          status: "PAID",
        },
      },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const sales = new Map<string, number>();

  for (const order of orders) {
    const date = order.createdAt.toISOString().split("T")[0];

    const currentRevenue = sales.get(date) ?? 0;

    sales.set(date, currentRevenue + Number(order.total));
  }

  return Array.from(sales, ([date, revenue]) => ({
    date,
    revenue,
  }));
};
export const getLowStockProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      inventory: {
        quantity: {
          lte: 10,
        },
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      inventory: {
        select: {
          quantity: true,
        },
      },
      gallery: {
        include: {
          images: true,
        },
      },
    },
    orderBy: {
      inventory: {
        quantity: "asc",
      },
    },
    take: 5,
  });

  return products;
};
