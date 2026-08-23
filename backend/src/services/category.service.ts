import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";
import * as categoryImageService from "./categoryImage.service.js";

export const createCategory = async (
  data: {
    name: string;
    description?: string;
    parentId?: number;
  },
  file?: Express.Multer.File,
) => {
  // 1. Check duplicate category name
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw createError(400, "Category already exists");
  }

  // 2. Check parent category
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

  // 3. Create category
  const category = await prisma.category.create({
    data,
  });

  // 4. Create category image
  if (file) {
    await categoryImageService.createCategoryImage(category.id, file);
  }

  // 5. Clear Redis caches
  await redis.del("categories:count");

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

  // 2. Get categories
  const categories = await prisma.category.findMany({
    where: {
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    include: {
      categoryImage: true,
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

  // 3. Get total count
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

  // 4. Store in Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

export const countCategories = async () => {
  const cacheKey = "categories:count";

  // 1. Check Redis
  const cache = await redis.get(cacheKey);

  if (cache) {
    return Number(cache);
  }

  // 2. Get count
  const totalCategories = await prisma.category.count({
    where: {
      deletedAt: null,
    },
  });

  // 3. Store in Redis
  await redis.set(cacheKey, totalCategories, "EX", 600);

  return totalCategories;
};

export const getSingleCategory = async (id: number) => {
  const cacheKey = `category:${id}`;

  // 1. Check Redis
  const cachedCategory = await redis.get(cacheKey);

  if (cachedCategory) {
    return JSON.parse(cachedCategory);
  }

  // 2. Get category
  const category = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      categoryImage: true,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }

  // 3. Store in Redis
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
  file?: Express.Multer.File,
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

  // 4. Update category
  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  // 5. Update category image
  if (file) {
    await categoryImageService.updateCategoryImage(id, file);
  }

  // 6. Clear category cache
  await redis.del(`category:${id}`);

  // 7. Clear count cache
  await redis.del("categories:count");

  // 8. Clear category list caches
  const categoryListKeys = await redis.keys("categories:*");

  if (categoryListKeys.length > 0) {
    await redis.del(...categoryListKeys);
  }

  return updatedCategory;
};

export const deleteCategory = async (id: number) => {
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

  // 2. Soft delete category
  const deletedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // 3. Clear individual category cache
  await redis.del(`category:${id}`);

  // 4. Clear count cache
  await redis.del("categories:count");

  // 5. Clear category list caches
  const categoryListKeys = await redis.keys("categories:*");

  if (categoryListKeys.length > 0) {
    await redis.del(...categoryListKeys);
  }

  return deletedCategory;
};
