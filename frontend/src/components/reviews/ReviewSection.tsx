import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getProductReviewsThunk } from "../../redux/slices/reviewSlice";

import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
interface ReviewSectionProps {
  productId: number;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const dispatch = useAppDispatch();

  const { productReviews, pagination, loading, error } = useAppSelector(
    (state) => state.review,
  );

  useEffect(() => {
    dispatch(
      getProductReviewsThunk({
        productId,
        page: 1,
        limit: 5,
      }),
    );
  }, [dispatch, productId]);

  const handleLoadMore = () => {
    dispatch(
      getProductReviewsThunk({
        productId,
        page: pagination.page + 1,
        limit: 5,
      }),
    );
  };

  return (
    <section className="mt-12 border-t border-gray-100 pt-8">
      <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>

      <div className="mt-6">
        <ReviewForm productId={productId} />
      </div>

      <div className="mt-8">
        {loading && productReviews.length === 0 && (
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse space-y-2 py-5">
                <div className="h-3 w-32 rounded bg-gray-100" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && productReviews.length === 0 && (
          <p className="text-sm text-gray-500">
            No reviews yet. Be the first to review this product.
          </p>
        )}

        {productReviews.length > 0 && (
          <div className="divide-y divide-gray-200">
            {productReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      {pagination.hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loading}
          className="mt-6 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && productReviews.length > 0 ? "Loading..." : "Load More"}
        </button>
      )}
    </section>
  );
};

export default ReviewSection;
