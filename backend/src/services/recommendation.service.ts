import prisma from "../config/prisma.js";

export const getRecommendedProducts = async (
  productId: number,
  limit: number = 8,
) => {
  // 1. GET CURRENT PRODUCT
  const currentProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      publishedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      categoryId: true,
    },
  });

  if (!currentProduct) {
    throw new Error("Product not found");
  }

  //2. GET CANDIDATE PRODUCTS

  /* * Only recommend:
   *
   * - published products
   * - non-deleted products
   * - products other than current product
   */

  const products = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
      deletedAt: null,
      publishedAt: {
        not: null,
      },
    },
    include: {
      category: true,
      gallery: {
        include: {
          images: true,
        },
      },
    },
  });

  /*
   * =====================================================
   * 3. CALCULATE RECOMMENDATION SCORE
   * =====================================================
   */

  const recommendedProducts = products.map((product) => {
    let score = 0;

    //* CATEGORY MATCH

    if (product.categoryId === currentProduct.categoryId) {
      score += 50;
    }

    // PRODUCT NAME SIMILARITY

    const currentWords = currentProduct.name
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);

    const productWords = product.name
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);

    const commonWords = currentWords.filter((word) =>
      productWords.includes(word),
    );

    score += Math.min(commonWords.length * 10, 30);

    return {
      ...product,
      recommendationScore: score,
    };
  });

  recommendedProducts.sort(
    (a, b) => b.recommendationScore - a.recommendationScore,
  );

  return recommendedProducts.slice(0, limit);
};
