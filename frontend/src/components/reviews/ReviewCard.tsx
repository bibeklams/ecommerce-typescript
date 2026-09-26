import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import type { ProductReview } from "../../types/review";

import { useAppDispatch } from "../../redux/hooks";

import {
  deleteReviewThunk,
  updateReviewThunk,
} from "../../redux/slices/reviewSlice";

import StarRating from "./StarRating";

interface ReviewCardProps {
  review: ProductReview;
}

interface EditReviewValues {
  rating: number;
  comment: string;
}

const editReviewSchema = Yup.object({
  rating: Yup.number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5")
    .required("Rating is required"),

  comment: Yup.string().max(500, "Comment must be less than 500 characters"),
});

const ReviewCard = ({ review }: ReviewCardProps) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) return;

    await dispatch(deleteReviewThunk(review.productId));
  };

  return (
    <article className="border-b border-gray-200 py-5 last:border-b-0">
      <Formik<EditReviewValues>
        initialValues={{
          rating: review.rating,
          comment: review.comment ?? "",
        }}
        validationSchema={editReviewSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const result = await dispatch(
              updateReviewThunk({
                productId: review.productId,
                data: {
                  rating: values.rating,
                  comment: values.comment.trim() || undefined,
                },
              }),
            );

            if (!updateReviewThunk.fulfilled.match(result)) {
              setStatus(result.error.message ?? "Failed to update review");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, dirty, status }) => (
          <Form>
            {/* User */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {review.user.name}
                </h3>

                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {review.comment}
              </p>
            )}

            {/* Actions */}
            <div className="mt-3 flex gap-4">
              <button
                type="button"
                onClick={() => {
                  // You can replace this with your edit UI state.
                }}
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-medium text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>

            {/* Example edit fields */}
            <div className="mt-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setFieldValue("rating", value)}
                    className={`text-xl leading-none ${
                      value <= values.rating ? "text-gray-900" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}

                <span className="ml-1 text-xs text-gray-500">
                  {values.rating}/5
                </span>
              </div>

              <ErrorMessage
                name="rating"
                component="p"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            <Field
              as="textarea"
              name="comment"
              rows={3}
              disabled={isSubmitting}
              className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />

            <ErrorMessage
              name="comment"
              component="p"
              className="mt-1 text-xs text-red-500"
            />

            {status && <p className="mt-2 text-xs text-red-500">{status}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !dirty}
              className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </Form>
        )}
      </Formik>
    </article>
  );
};

export default ReviewCard;
