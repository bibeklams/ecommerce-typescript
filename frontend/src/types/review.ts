export interface ProductReview {
  id: number;
  rating: number;
  comment: string | null;
  userId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  user: {
    id: number;
    name: string;
  };
}

export interface ProductReviewPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ProductReviewListResponse {
  productReviews: ProductReview[];
  pagination: ProductReviewPagination;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}
