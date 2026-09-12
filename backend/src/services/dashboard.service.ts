// getSalesOverview()

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
  const products = await prisma.orderItem.groupBy({
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

  return products;
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
