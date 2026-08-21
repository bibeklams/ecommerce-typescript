import prisma from "../config/prisma.js";
import createError from "http-errors";

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

  return category;
};

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      deletedAt: null,
    },
  });

  if (categories.length === 0) {
    throw createError(404, "No categories found");
  }

  return categories;
};

export const getSingleCategory = async (id: number) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }

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

  // Check duplicate name
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

  // Check parent category
  if (data.parentId !== undefined) {
    // A category cannot be its own parent
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

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

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

  return deletedCategory;
};
