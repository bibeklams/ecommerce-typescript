import redis from "../config/redis.js";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import { generateSlug } from "../utils/generateSlug.js";
import * as galleryService from "./gallery.service.js";
import * as galleryImageService from "./galleryImage.service.js";
import * as mediaService from "./media.service.js";
import * as inventoryService from "./inventory.service.js";

export const createProduct = async (
  data: {
    name: string;
    price: number;
    description?: string;
    categoryId: number;
    detailsJson?: object;
    quantity: number;
  },
  imageFiles: Express.Multer.File[] = [],
  mediaFiles: Express.Multer.File[] = [],
) => {
  // 1. Generate slug
  const slug = generateSlug(data.name);

  // 2. Check duplicate product
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

  // 5. Create inventory
  await inventoryService.createInventory(product.id, data.quantity);

  // 6. Create gallery
  const gallery = await galleryService.createGallery(product.id);

  // 7. Upload images
  if (imageFiles.length > 0) {
    await galleryImageService.createGalleryImages(gallery.id, imageFiles);
  }

  // 8. Upload media
  if (mediaFiles.length > 0) {
    await mediaService.createMedia(gallery.id, mediaFiles);
  }

  // 9. Clear product count cache
  await redis.del("products:count");

  // 10. Clear product list caches
  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  // 11. Return created product
  return product;
};

export const getAllProducts = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
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
    include: {
      seo: true,
      category: true,
      inventory: true,
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

  // DO NOT throw 404 when products.length === 0

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

  await redis.set(cacheKey, JSON.stringify(result), "EX", 600);

  return result;
};

export const getSingleProduct = async (id: number) => {
  const cacheKey = `product:${id}`;

  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      seo: true,
      category: true,
      inventory: true,
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
    quantity?: number;
  },
  imageFiles: Express.Multer.File[] = [],
  mediaFiles: Express.Multer.File[] = [],
) => {
  // 1. Find product
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 2. Generate slug if name changed
  let slug: string | undefined;

  if (data.name && data.name !== product.name) {
    slug = generateSlug(data.name);

    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        id: {
          not: id,
        },
        deletedAt: null,
      },
    });

    if (existingProduct) {
      throw createError(400, "Another product with this name already exists");
    }
  }

  // 3. Check category
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
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      detailsJson: data.detailsJson,
      ...(slug && { slug }),
    },
  });

  // 5. Update inventory if quantity is provided
  if (data.quantity !== undefined) {
    await inventoryService.updateInventory(id, data.quantity);
  }

  // 6. Find gallery
  const gallery = await prisma.gallery.findFirst({
    where: {
      id: product.galleryId ?? undefined,
    },
  });

  if (!gallery) {
    throw createError(404, "Gallery not found");
  }

  // 7. Add new images
  if (imageFiles.length > 0) {
    await galleryImageService.createGalleryImages(gallery.id, imageFiles);
  }

  // 8. Add new media
  if (mediaFiles.length > 0) {
    await mediaService.createMedia(gallery.id, mediaFiles);
  }

  // 9. Clear product cache
  await redis.del(`product:${id}`);

  // 10. Clear product count cache
  await redis.del("products:count");

  // 11. Clear product list cache
  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  return updatedProduct;
};
export const countProducts = async () => {
  const cacheKey = "products:count";

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
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  const deletedProduct = await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  await redis.del(`product:${id}`);
  await redis.del("products:count");

  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  return deletedProduct;
};
