"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_service_1 = require("./blog.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const blog_constant_1 = require("./blog.constant");
const pagination_1 = require("../../constants/pagination");
const getAllBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, blog_constant_1.blogFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await blog_service_1.BlogService.getAllBlogs(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getBlogById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogService.getBlogById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: result,
    });
});
const createBlog = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await blog_service_1.BlogService.createBlog(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: result,
    });
});
const updateBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await blog_service_1.BlogService.updateBlog(id, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog updated successfully",
        data: result,
    });
});
const deleteBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await blog_service_1.BlogService.deleteBlog(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
});
exports.BlogController = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};
