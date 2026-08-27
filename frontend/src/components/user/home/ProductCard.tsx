import type { Product } from "../../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article>
      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <p>Price: Rs. {product.price}</p>

      <button type="button">View Product</button>
    </article>
  );
};

export default ProductCard;
