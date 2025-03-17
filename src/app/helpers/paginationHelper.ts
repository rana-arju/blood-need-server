type SortOrderType = "asc" | "desc"; // Prisma-compatible sort order

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrderType;
  fields?: string[]; // Added fields for projection
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrderType;
  select?: Record<string, boolean>; // Added select for projection
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder: SortOrderType = options.sortOrder === "asc" ? "asc" : "desc"; // Default to "desc"
  // Create projection object if fields are specified
  const select = options.fields?.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as Record<string, boolean>);

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    ...(select && { select }),
  };
};

export const paginationHelpers = {
  calculatePagination,
};
