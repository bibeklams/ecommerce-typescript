import type { ProductReview } from "../../types/review";

import StarRating from "./StarRating";

interface ReviewCardProps {
  review: ProductReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <article className="border-b border-gray-200 py-5 last:border-b-0">
      {/* User */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{review.user.name}</h3>

          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Rating */}
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="mt-3 text-sm leading-6 text-gray-700">{review.comment}</p>
      )}
    </article>
  );
};

export default ReviewCard;
