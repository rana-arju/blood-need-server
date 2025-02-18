export type IReview = {
  id: string;
  userId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IReviewFilters = {
  searchTerm?: string;
  rating?: number;
};
