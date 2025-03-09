"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const blog_constant_1 = require("./blog.constant");
const pagination_1 = require("../../constants/pagination");
const blog_service_1 = require("./blog.service");
const getAllReviews = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, blog_constant_1.reviewFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await blog_service_1.BlogsService.getAllBlogs(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getReviewById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogsService.getReviewById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review retrieved successfully",
        data: result,
    });
});
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user?.id;
    if (!id) {
        (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    const result = await blog_service_1.BlogsService.createBlog(req.body, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});
const updateReview = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogsService.updateReview(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});
const deleteReview = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogsService.deleteReview(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
});
exports.BlogController = {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
};
