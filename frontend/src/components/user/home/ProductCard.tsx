import { Link } from "react-router-dom";

import type { Product } from "../../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const image = product.gallery?.images?.[0];

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Product Image */}
      <div className="h-64 w-full overflow-hidden bg-gray-50">
        {image?.url ? (
          <img
            src={image.url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5">
        {/* Category */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.category?.name ?? "Unknown"}
        </p>

        {/* Name */}
        <h3 className="truncate text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        )}

        {/* Price */}
        <p className="mt-4 text-lg font-semibold text-gray-900">
          Rs. {product.price}
        </p>

        {/* Media */}
        {product.gallery?.media && product.gallery.media.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>
              {product.gallery.media.length} media file
              {product.gallery.media.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* View Product */}
        <Link
          to={`/products/${product.id}`}
          className="mt-5 block w-full rounded-full bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
        >
          View Product
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
