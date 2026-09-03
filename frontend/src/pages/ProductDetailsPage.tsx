import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getSingleProductThunk } from "../redux/slices/productSlice";
import {
  addToWishlist,
  removeWishlistThunk,
  getWishlistThunk,
} from "../redux/slices/wishlistSlice";
import { addToCartThunk } from "../redux/slices/cartSlice";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.product);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const isWishlisted = product
    ? wishlistItems.some((item) => item.productId === product.id)
    : false;
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    dispatch(getSingleProductThunk(Number(id)));
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getWishlistThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Product not found.</p>
      </main>
    );
  }
  const stock = product.inventory?.quantity ?? 0;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(stock, current + 1));
  };
  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCartThunk({
          productId: product.id,
          quantity,
        }),
      ).unwrap();

      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await dispatch(removeWishlistThunk(product.id)).unwrap();

        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();

        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <main className="min-h-screen bg-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ================= PRODUCT ================= */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr]">
          {/* ================= LEFT ================= */}
          <section className="flex gap-5">
            {/* IMAGE */}
            <div className="w-[260px] shrink-0">
              <div className="flex h-[300px] items-center justify-center rounded-xl bg-gray-50 p-5">
                {product.gallery?.images &&
                product.gallery.images.length > 0 ? (
                  <img
                    src={product.gallery.images[0].url}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <p className="text-xs text-gray-400">No image available</p>
                )}
              </div>

              {/* THUMBNAILS */}
              {product.gallery?.images && product.gallery.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {product.gallery.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border bg-white p-1 ${
                        index === 0 ? "border-black" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT SUMMARY */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* CATEGORY */}
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {product.category?.name ?? "Unknown Category"}
              </p>

              {/* NAME */}
              <h1 className="mt-2 text-2xl font-semibold leading-tight text-gray-900">
                {product.name}
              </h1>

              {/* PRICE */}
              <p className="mt-3 text-xl font-semibold text-gray-900">
                Rs. {product.price}
              </p>

              {/* DESCRIPTION */}
              {product.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                  {product.description}
                </p>
              )}

              {/* STOCK */}
              <div className="mt-4">
                {stock > 0 ? (
                  <p className="flex items-center gap-2 text-xs font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {stock} items in stock
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-xs font-medium text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Out of stock
                  </p>
                )}
              </div>

              {/* QUANTITY */}
              {stock > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-gray-700">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center rounded-md border border-gray-300">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-base text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-2 text-sm font-medium">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="flex h-9 w-9 items-center justify-center text-base text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* ADD TO CART */}
              <button
                type="button"
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className="mt-5 w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition ${
                  isWishlisted
                    ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaHeart />

                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </section>

          {/* ================= RIGHT - DETAILS ================= */}
          <section className="border-l border-gray-100 pl-0 md:pl-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Details
            </h2>

            {product.detailsJson ? (
              <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
                {Object.entries(product.detailsJson).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-6 py-3"
                  >
                    <span className="text-sm capitalize text-gray-500">
                      {key}
                    </span>

                    <span className="text-right text-sm font-medium text-gray-900">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                No product details available.
              </p>
            )}
          </section>
        </div>

        {/* ================= MEDIA ================= */}
        {product.gallery?.media && product.gallery.media.length > 0 && (
          <section className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Media
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {product.gallery.media.map((media) => (
                <a
                  key={media.id}
                  href={media.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  View Media
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 
          RELATED PRODUCTS WILL GO HERE LATER

          <RelatedProducts />
        */}
      </div>
    </main>
  );
};

export default ProductDetailsPage;
