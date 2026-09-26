import prisma from "../config/prisma.js";

export const getRecommendedProducts = async (
  productId: number,
  limit: number = 8,
) => {
  // =====================================================
  // 1. GET CURRENT PRODUCT
  // =====================================================

  const currentProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      categoryId: true,
    },
  });

  console.log("Current product:", currentProduct);

  if (!currentProduct) {
    throw new Error("Product not found");
  }

  // =====================================================
  // 2. GET CANDIDATE PRODUCTS
  // =====================================================

  /*
   * Only recommend:
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

  console.log(
    "Candidate products:",
    products.map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      publishedAt: product.publishedAt,
    })),
  );

  // =====================================================
  // 3. CALCULATE RECOMMENDATION SCORE
  // =====================================================

  const recommendedProducts = products.map((product) => {
    let score = 0;

    // CATEGORY MATCH
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

  // =====================================================
  // 4. CHECK SCORES
  // =====================================================

  console.log(
    "Products with scores:",
    recommendedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      recommendationScore: product.recommendationScore,
    })),
  );

  // =====================================================
  // 5. REMOVE PRODUCTS WITH SCORE 0
  // =====================================================

  const filteredProducts = recommendedProducts.filter(
    (product) => product.recommendationScore > 0,
  );

  console.log(
    "Filtered recommendations:",
    filteredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      recommendationScore: product.recommendationScore,
    })),
  );

  // =====================================================
  // 6. SORT BY SCORE
  // =====================================================

  filteredProducts.sort(
    (a, b) => b.recommendationScore - a.recommendationScore,
  );

  // =====================================================
  // 7. RETURN TOP PRODUCTS
  // =====================================================

  return filteredProducts.slice(0, limit);
};
