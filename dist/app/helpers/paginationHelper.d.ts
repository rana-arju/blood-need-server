type SortOrderType = "asc" | "desc";
type IOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrderType;
};
type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: SortOrderType;
};
export declare const paginationHelpers: {
    calculatePagination: (options: IOptions) => IOptionsResult;
};
export {};
