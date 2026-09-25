interface ReviewFormProps {
  productId: number;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  return (
    <form className="rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>

      <p className="mt-2 text-sm text-gray-500">Product ID: {productId}</p>

      {/* Rating */}
      <div className="mt-4">
        <label
          htmlFor="rating"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Rating
        </label>

        <select
          id="rating"
          name="rating"
          defaultValue=""
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="" disabled>
            Select rating
          </option>
          <option value="5">★★★★★ - 5</option>
          <option value="4">★★★★☆ - 4</option>
          <option value="3">★★★☆☆ - 3</option>
          <option value="2">★★☆☆☆ - 2</option>
          <option value="1">★☆☆☆☆ - 1</option>
        </select>
      </div>

      {/* Comment */}
      <div className="mt-4">
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Comment
        </label>

        <textarea
          id="comment"
          name="comment"
          rows={4}
          placeholder="Write your review..."
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
