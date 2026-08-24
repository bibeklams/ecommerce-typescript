import redis from "../config/redis.js";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import { generateSlug } from "../utils/generateSlug.js";

import * as galleryService from "./gallery.service.js";
import * as galleryImageService from "./galleryImage.service.js";
import * as mediaService from "./media.service.js";

export const createProduct = async (
  data: {
    name: string;
    price: number;
    description?: string;
    categoryId: number;
    detailsJson?: object;
  },
  imageFiles: Express.Multer.File[] = [],
  mediaFiles: Express.Multer.File[] = [],
) => {
  // 1. Generate slug
  const slug = generateSlug(data.name);

  // 2. Check duplicate slug
  const existingProduct = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (existingProduct) {
    throw createError(400, "Product already exists");
  }

  // 3. Check category
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw createError(404, "Category not found");
  }

  // 4. Create product
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

  // 5. Create gallery
  const gallery = await galleryService.createGallery(product.id);

  // 6. Create multiple gallery images
  if (imageFiles.length > 0) {
    await galleryImageService.createGalleryImages(gallery.id, imageFiles);
  }

  // 7. Create multiple media files
  if (mediaFiles.length > 0) {
    await mediaService.createMedia(gallery.id, mediaFiles);
  }

  // 8. Clear product count cache
  await redis.del("products:count");

  // 9. Clear product list caches
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

  // 1. Check Redis
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // 2. Get products
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,

      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    include: {
      seo: true,
      category: true,
      gallery: {
        include: {
          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
          media: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
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

  // 3. Count matching products
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

  // 4. Store in Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 600);

  return result;
};

export const getSingleProduct = async (id: number) => {
  const cacheKey = `product:${id}`;

  // 1. Check Redis
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // 2. Get product
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      seo: true,
      category: true,
      gallery: {
        include: {
          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
          media: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 3. Store in Redis
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
  // 1. Check product exists
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 2. Generate new slug if name changes
  let slug: string | undefined;

  if (data.name && data.name !== product.name) {
    slug = generateSlug(data.name);

    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        id: {
          not: id,
        },
      },
    });

    if (existingProduct) {
      throw createError(400, "Another product with this name already exists");
    }
  }

  // 3. Check category if category is changing
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

  // 4. Update product
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...data,
      ...(slug && { slug }),
    },
  });

  // 5. Clear individual product cache
  await redis.del(`product:${id}`);

  // 6. Clear product count cache
  await redis.del("products:count");

  // 7. Clear product list caches
  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  return updatedProduct;
};

export const countProducts = async () => {
  const cacheKey = "products:count";

  // 1. Check Redis
  const cache = await redis.get(cacheKey);

  if (cache) {
    return Number(cache);
  }

  // 2. Count products
  const count = await prisma.product.count({
    where: {
      deletedAt: null,
    },
  });

  // 3. Store count in Redis
  await redis.set(cacheKey, count, "EX", 600);

  return count;
};

export const deleteProduct = async (id: number) => {
  // 1. Check product exists
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

  // 3. Clear individual product cache
  await redis.del(`product:${id}`);

  // 4. Clear product count cache
  await redis.del("products:count");

  // 5. Clear product list caches
  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  return deletedProduct;
};
