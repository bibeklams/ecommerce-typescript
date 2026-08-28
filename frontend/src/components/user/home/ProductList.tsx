import type { Product } from "../../../types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList = ({ products, loading }: ProductListProps) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-black">
        Products
      </h2>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-lg border border-black/10 bg-white"
            >
              <div className="aspect-square bg-black/[0.05]" />
              <div className="space-y-2 p-4">
                <div className="h-2.5 w-1/3 rounded bg-black/[0.08]" />
                <div className="h-3 w-3/4 rounded bg-black/[0.08]" />
                <div className="h-3 w-1/2 rounded bg-black/[0.08]" />
                <div className="mt-3 h-8 w-full rounded-md bg-black/[0.08]" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-black/50">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
