"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const getAllReviews = async (filters, paginationOptions) => {
    const { searchTerm, rating } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: ["comment"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (rating) {
        andConditions.push({
            rating: {
                equals: rating,
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.review.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getReviewById = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid review ID format");
    }
    const isExist = await prisma_1.default.review.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Review not found");
    }
    const result = await prisma_1.default.review.findUnique({
        where: { id },
    });
    return result;
};
const createReview = async (reviewData, id) => {
    const modified = {
        ...reviewData,
        userId: id,
    };
    const result = await prisma_1.default.review.create({
        data: modified,
    });
    return result;
};
const updateReview = async (id, payload) => {
    // ✅ Validate if `id` is a valid MongoDB ObjectId
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid review ID format");
    }
    const isExist = await prisma_1.default.review.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Review not found");
    }
    const result = await prisma_1.default.review.update({
        where: { id },
        data: payload,
    });
    return result;
};
const deleteReview = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid review ID format");
    }
    const isExist = await prisma_1.default.review.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Review not found");
    }
    const result = await prisma_1.default.review.delete({
        where: { id },
    });
    return result;
};
exports.ReviewService = {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
};
