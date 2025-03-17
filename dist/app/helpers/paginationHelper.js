"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder === "asc" ? "asc" : "desc"; // Default to "desc"
    // Create projection object if fields are specified
    const select = options.fields?.reduce((acc, field) => {
        acc[field] = true;
        return acc;
    }, {});
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        ...(select && { select }),
    };
};
exports.paginationHelpers = {
    calculatePagination,
};
