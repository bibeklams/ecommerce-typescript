import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";

export const createCategory = async (data: {
  name: string;
  description?: string;
  parentId?: number;
}) => {
  // Check duplicate category name
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw createError(400, "Category already exists");
  }

  // Check parent category
  if (data.parentId !== undefined) {
    const parentCategory = await prisma.category.findFirst({
      where: {
        id: data.parentId,
        deletedAt: null,
      },
    });

    if (!parentCategory) {
      throw createError(404, "Parent category not found");
    }
  }

  const category = await prisma.category.create({
    data,
  });
  await redis.del(`categories:count`);
  // 6. Delete all category-list caches
  const categoryListKeys = await redis.keys("categories:*");

  if (categoryListKeys.length > 0) {
    await redis.del(...categoryListKeys);
  }
  return category;
};

export const getAllCategories = async (
  search: string = "",
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const cacheKey = `categories:search:${search}:page:${page}:limit:${limit}`;

  // 1. Check Redis
  const cachedCategories = await redis.get(cacheKey);

  if (cachedCategories) {
    return JSON.parse(cachedCategories);
  }

  // 2. If cache doesn't exist, query PostgreSQL
  const categories = await prisma.category.findMany({
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

  if (categories.length === 0) {
    throw createError(404, "No categories found");
  }

  const total = await prisma.category.count({
    where: {
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const result = {
    categories,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  // 3. Store result in Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  // 4. Return result
  return result;
};

export const countCategories = async () => {
  const cacheKey = `categories:count`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    return Number(cache);
  }
  const totalCategories = await prisma.category.count({
    where: {
      deletedAt: null,
    },
  });
  await redis.set(cacheKey, totalCategories, "EX", 600);
  return totalCategories;
};
export const getSingleCategory = async (id: number) => {
  const cacheKey = `category:${id}`;
  const cacheCategory = await redis.get(cacheKey);
  if (cacheCategory) {
    return JSON.parse(cacheCategory);
  }
  const category = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }
  await redis.set(cacheKey, JSON.stringify(category), "EX", 600);
  return category;
};

export const updateCategory = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    parentId?: number;
  },
) => {
  // 1. Check category exists and is active
  const category = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }

  // 2. Check duplicate name
  if (data.name && data.name !== category.name) {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingCategory) {
      throw createError(400, "Category already exists");
    }
  }

  // 3. Check parent category
  if (data.parentId !== undefined) {
    // Category cannot be its own parent
    if (data.parentId === id) {
      throw createError(400, "Category cannot be its own parent");
    }

    const parentCategory = await prisma.category.findFirst({
      where: {
        id: data.parentId,
        deletedAt: null,
      },
    });

    if (!parentCategory) {
      throw createError(404, "Parent category not found");
    }
  }

  // 4. Update category in PostgreSQL
  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  // 5. Delete individual category cache
  await redis.del(`category:${id}`);
  await redis.del(`categories:count`);
  // 6. Delete all category-list caches
  const categoryListKeys = await redis.keys("categories:*");

  if (categoryListKeys.length > 0) {
    await redis.del(...categoryListKeys);
  }

  // 7. Return updated category
  return updatedCategory;
};

export const deleteCategory = async (id: number) => {
  // Check category exists and is active
  const category = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }

  // Soft delete
  const deletedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  await redis.del(`category:${id}`);
  await redis.del(`categories:count`);
  // 6. Delete all category-list caches
  const categoryListKeys = await redis.keys("categories:*");

  if (categoryListKeys.length > 0) {
    await redis.del(...categoryListKeys);
  }
  return deletedCategory;
};
