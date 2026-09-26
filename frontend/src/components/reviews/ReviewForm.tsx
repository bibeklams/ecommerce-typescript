import { useState } from "react";

import { useAppDispatch } from "../../redux/hooks";
import { createReviewThunk } from "../../redux/slices/reviewSlice";

interface ReviewFormProps {
  productId: number;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const dispatch = useAppDispatch();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      return;
    }

    try {
      setSubmitting(true);

      const result = await dispatch(
        createReviewThunk({
          productId,
          data: {
            rating,
            comment: comment.trim() || undefined,
          },
        }),
      );

      if (createReviewThunk.fulfilled.match(result)) {
        setRating(0);
        setComment("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 p-4"
    >
      <h3 className="text-sm font-semibold text-gray-900">Write a review</h3>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={submitting}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-xl leading-none text-gray-300 transition-colors disabled:cursor-not-allowed"
            style={{
              color: value <= (hoverRating || rating) ? "#111827" : undefined,
            }}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}

        {rating > 0 && (
          <span className="ml-1 text-xs text-gray-500">{rating}/5</span>
        )}
      </div>

      {/* Comment */}
      <textarea
        id="comment"
        name="comment"
        rows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share your thoughts about this product..."
        disabled={submitting}
        className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !rating}
        className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
