import type { Product } from "../../../types/product";

import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList = ({ products, loading }: ProductListProps) => {
  return (
    <section>
      <h2>Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
