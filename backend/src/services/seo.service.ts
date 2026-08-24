import createError from "http-errors";
import prisma from "../config/prisma.js";

export const createSeo = async (data: {
  productId: number;
  title?: string;
  description?: string;
  canonicalUrl?: string;
}) => {
  // 1. Check product exists and is active
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 2. Check SEO already exists
  const existingSeo = await prisma.seo.findUnique({
    where: {
      productId: data.productId,
    },
  });

  if (existingSeo) {
    throw createError(400, "SEO already exists for this product");
  }

  // 3. Create SEO
  const seo = await prisma.seo.create({
    data: {
      productId: data.productId,
      title: data.title,
      description: data.description,
      canonicalUrl: data.canonicalUrl,
    },
  });

  return seo;
};

export const getSeoByProductId = async (productId: number) => {
  const seo = await prisma.seo.findUnique({
    where: {
      productId,
    },
  });
  if (!seo) {
    throw createError(404, "No seo found");
  }
  return seo;
};

export const updateSeo = async (data: {
  productId: number;
  title?: string;
  description?: string;
  canonicalUrl?: string;
}) => {
  // 1. Check product exists and is active
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // 2. Check SEO exists
  const existingSeo = await prisma.seo.findUnique({
    where: {
      productId: data.productId,
    },
  });

  if (!existingSeo) {
    throw createError(404, "SEO not found");
  }

  // 3. Update SEO
  const updatedSeo = await prisma.seo.update({
    where: {
      productId: data.productId,
    },
    data: {
      title: data.title,
      description: data.description,
      canonicalUrl: data.canonicalUrl,
    },
  });

  return updatedSeo;
};
