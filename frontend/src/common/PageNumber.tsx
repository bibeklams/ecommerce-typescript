import React from "react";

interface PageNumberProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageNumber = ({
  currentPage,
  totalPages,
  onPageChange,
}: PageNumberProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div>
      {/* Previous */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          disabled={currentPage === page}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PageNumber;
