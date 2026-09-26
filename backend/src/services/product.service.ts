import redis from "../config/redis.js";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import { generateSlug } from "../utils/generateSlug.js";
import * as galleryService from "./gallery.service.js";
import * as galleryImageService from "./galleryImage.service.js";
import * as mediaService from "./media.service.js";
import * as inventoryService from "./inventory.service.js";
import { Role, SellerStatus } from "../generated/prisma/client.js";

export const createProduct = async (
  sellerId: number,
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
  const seller = await prisma.user.findFirst({
    where: {
      id: sellerId,
      role: Role.SELLER,
      sellerStatus: SellerStatus.APPROVED,
      emailVerified: true,
      deletedAt: null,
    },
  });

  if (!seller) {
    throw createError(403, "Only approved sellers can create products");
  }
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
      sellerId,
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
  const sellerProductKeys = await redis.keys(
    `seller-products:seller:${sellerId}:*`,
  );

  if (sellerProductKeys.length > 0) {
    await redis.del(...sellerProductKeys);
  }
  // 11. Return created product
  return product;
};

export const getAllProducts = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
  categoryId?: number,
) => {
  const skip = (page - 1) * limit;

  const cacheKey = `products:search:${search}:category:${categoryId ?? "all"}:page:${page}:limit:${limit}`;

  // 1. Check Redis cache
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // 2. Build product filter
  const where = {
    deletedAt: null,
    name: {
      contains: search,
      mode: "insensitive" as const,
    },
    ...(categoryId !== undefined && {
      categoryId,
    }),
  };

  // 3. Get products
  const products = await prisma.product.findMany({
    where,

    include: {
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

      seo: true,
    },

    orderBy: {
      createdAt: "asc",
    },

    skip,
    take: limit,
  });

  // 4. Count total products
  const total = await prisma.product.count({
    where,
  });

  // 5. Create response
  const result = {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  // 6. Store in Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 600);

  return result;
};

export const getSellerAllProducts = async (
  sellerId: number,
  search: string = "",
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;

  const cacheKey = `seller-products:seller:${sellerId}:search:${search}:page:${page}:limit:${limit}`;

  // 1. Check Redis cache
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  // 2. Get seller's products
  const products = await prisma.product.findMany({
    where: {
      sellerId,
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    include: {
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
      seo: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    skip,
    take: limit,
  });

  // 3. Count this seller's products
  const total = await prisma.product.count({
    where: {
      sellerId,
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  // 4. Create response
  const result = {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  // 5. Store in Redis
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
  sellerId: number,
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
  // 1. Find product and verify ownership
  const product = await prisma.product.findFirst({
    where: {
      id,
      sellerId,
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

  // 4. Remove quantity because it belongs to Inventory
  const { quantity, ...productData } = data;

  // 5. Update product
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...productData,
      ...(slug && { slug }),
    },
  });

  // 6. Update inventory
  if (quantity !== undefined) {
    await inventoryService.updateInventory(id, quantity);
  }

  // 7. Find gallery
  const gallery = await prisma.gallery.findFirst({
    where: {
      id: product.galleryId ?? undefined,
    },
  });

  if (!gallery) {
    throw createError(404, "Gallery not found");
  }

  // 8. Add new images
  if (imageFiles.length > 0) {
    await galleryImageService.createGalleryImages(gallery.id, imageFiles);
  }

  // 9. Add new media
  if (mediaFiles.length > 0) {
    await mediaService.createMedia(gallery.id, mediaFiles);
  }

  // 10. Clear single product cache
  await redis.del(`product:${id}`);

  // 11. Clear all-product list caches
  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }

  // 12. Clear this seller's product list caches
  const sellerProductKeys = await redis.keys(
    `seller-products:seller:${sellerId}:*`,
  );

  if (sellerProductKeys.length > 0) {
    await redis.del(...sellerProductKeys);
  }

  // 13. Clear product count cache
  await redis.del("products:count");

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

  await redis.set(cacheKey, count.toString(), "EX", 600);

  return count;
};

export const deleteProduct = async (id: number, sellerId: number) => {
  const product = await prisma.product.findFirst({
    where: {
      sellerId,
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
  await redis.del(`productReview:${id}`);
  const productListKeys = await redis.keys("products:*");

  if (productListKeys.length > 0) {
    await redis.del(...productListKeys);
  }
  const sellerProductKeys = await redis.keys(
    `seller-products:seller:${sellerId}:*`,
  );

  if (sellerProductKeys.length > 0) {
    await redis.del(...sellerProductKeys);
  }
  return deletedProduct;
};
