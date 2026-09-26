import type { RecommendedProduct } from "../../services/recommendation.service";

import ProductCard from "../user/home/ProductCard";

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">Products you may also like</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;
