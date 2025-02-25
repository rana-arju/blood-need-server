"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const getAllReviews = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.default.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.review.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid review ID format");
    }
    const isExist = yield prisma_1.default.review.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Review not found");
    }
    const result = yield prisma_1.default.review.findUnique({
        where: { id },
    });
    return result;
});
const createReview = (reviewData, id) => __awaiter(void 0, void 0, void 0, function* () {
    const modified = Object.assign(Object.assign({}, reviewData), { userId: id });
    const result = yield prisma_1.default.review.create({
        data: modified,
    });
    return result;
});
const updateReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Validate if `id` is a valid MongoDB ObjectId
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid review ID format");
    }
    const isExist = yield prisma_1.default.review.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Review not found");
    }
    const result = yield prisma_1.default.review.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid review ID format");
    }
    const isExist = yield prisma_1.default.review.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Review not found");
    }
    const result = yield prisma_1.default.review.delete({
        where: { id },
    });
    return result;
});
exports.ReviewService = {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
};
