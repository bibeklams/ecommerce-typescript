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

  // Get reviews
  useEffect(() => {
    dispatch(
      getProductReviewsThunk({
        productId,
        page: 1,
        limit: 5,
      }),
    );
  }, [dispatch, productId]);

  return (
    <section className="mt-12 border-t border-gray-100 pt-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>

      {/* Create Review */}
      <div className="mt-6">
        <ReviewForm productId={productId} />
      </div>

      {/* Reviews */}
      <div className="mt-8">
        {loading && <p className="text-sm text-gray-500">Loading reviews...</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && productReviews.length === 0 && (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}

        {!loading && productReviews.length > 0 && (
          <div className="divide-y divide-gray-200">
            {productReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {pagination.hasMore && !loading && (
        <button
          type="button"
          className="mt-6 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Load More
        </button>
      )}
    </section>
  );
};

export default ReviewSection;
