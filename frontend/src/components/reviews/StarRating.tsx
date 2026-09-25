interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ rating, size = "md" }: StarRatingProps) => {
  const sizeClass = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex ${sizeClass[size]}`}>
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
