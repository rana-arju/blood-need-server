export type IBlog = {
  id: string;
  userId: string;
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IBlogFilters = {
  searchTerm?: string;
  rating?: number;
};
