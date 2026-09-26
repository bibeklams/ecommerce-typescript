interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

const StarRating = ({ rating, size = "md" }: StarRatingProps) => {
  return (
    <div
      className={`flex items-center gap-0.5 leading-none ${sizeClass[size]}`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
