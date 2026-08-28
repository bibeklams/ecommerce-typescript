import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getSingleProductThunk } from "../redux/slices/productSlice";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();

  const { product, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (!id) return;

    dispatch(getSingleProductThunk(Number(id)));
  }, [id, dispatch]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <main>
      {/* Product name */}
      <h1>{product.name}</h1>

      {/* Category */}
      <p>Category: {product.category?.name ?? "Unknown"}</p>

      {/* Price */}
      <p>Price: Rs. {product.price}</p>

      {/* Description */}
      {product.description && (
        <section>
          <h2>Description</h2>
          <p>{product.description}</p>
        </section>
      )}

      {/* Images */}
      {product.gallery?.images && product.gallery.images.length > 0 && (
        <section>
          <h2>Images</h2>

          {product.gallery.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={product.name}
              width="200"
            />
          ))}
        </section>
      )}

      {/* Media */}
      {product.gallery?.media && product.gallery.media.length > 0 && (
        <section>
          <h2>Media</h2>

          {product.gallery.media.map((media) => (
            <div key={media.id}>
              <a href={media.url} target="_blank" rel="noreferrer">
                View Media
              </a>
            </div>
          ))}
        </section>
      )}

      {/* Product Details */}
      {product.detailsJson && (
        <section>
          <h2>Product Details</h2>

          <pre>{JSON.stringify(product.detailsJson, null, 2)}</pre>
        </section>
      )}
    </main>
  );
};

export default ProductDetailsPage;
