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
  const slug = generateSlug(data.name);

  const existingProduct = await prisma.product.findUnique({
    where: { slug },
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

  const gallery = await galleryService.createGallery(product.id);

  if (imageFiles.length > 0) {
    await galleryImageService.createGalleryImages(gallery.id, imageFiles);
  }

  if (mediaFiles.length > 0) {
    await mediaService.createMedia(gallery.id, mediaFiles);
  }

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
  },
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

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

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(slug && { slug }),
    },
  });

  await redis.del(`product:${id}`);
  await redis.del("products:count");

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
