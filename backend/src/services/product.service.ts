import redis from "../config/redis.js";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import { generateSlug } from "../utils/generateSlug.js";

export const createProduct = async (data: {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  detailsJson?: object;
}) => {
  const slug = generateSlug(data.name);

  const existingProduct = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (existingProduct) {
    throw createError(400, "Product already exists");
  }

  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId,
      detailsJson: data.detailsJson,
    },
  });

  await redis.del("products:count");

  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  return product;
};

export const getAllProducts = async (
  search: string = "",
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const cacheKey = `products:search:${search}:page:${page}:limit:${limit}`;

  // Check Redis
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // Get products
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    skip,
    take: limit,
  });

  if (products.length === 0) {
    throw createError(404, "No products found");
  }

  // Count matching products
  const total = await prisma.product.count({
    where: {
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const result = {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  // Store in Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 600);

  return result;
};

export const getSingleProduct = async (id: number) => {
  const cacheKey = `product:${id}`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
  const product = await prisma.product.findUnique({
    where: {
      deletedAt: null,
      id,
    },
  });
  if (!product) {
    throw createError(400, "No product found");
  }
  await redis.set(cacheKey, JSON.stringify(product), "EX", 600);
  return product;
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    detailsJson?: object;
  },
) => {
  // 1. Check product exists and is active
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 2. If category is being changed, check category
  if (data.categoryId !== undefined) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw createError(404, "Category not found");
    }
  }

  // 3. Update product
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data,
  });

  await redis.del(`product:${id}`);
  const cacheKeys = await redis.keys(`products:*`);
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }
  return updatedProduct;
};

export const countProduct = async () => {
  const cacheKey = `products:count`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return Number(cache);
  }
  const count = await prisma.product.count({
    where: {
      deletedAt: null,
    },
  });
  await redis.set(cacheKey, count, "EX", 600);
  return count;
};

export const deleteProduct = async (id: number) => {
  // 1. Check product exists and is active
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 2. Soft delete
  const deletedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // 3. Clear Redis caches
  await redis.del(`product:${id}`);
  await redis.del("products:count");

  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  return deletedProduct;
};
