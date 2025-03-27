"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const getAllBlogs = async (filters, paginationOptions) => {
    const { searchTerm, userId, tags } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search term condition
    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: client_1.Prisma.QueryMode.insensitive } },
                { content: { contains: searchTerm, mode: client_1.Prisma.QueryMode.insensitive } },
                { tags: { has: searchTerm } },
            ],
        });
    }
    // Filter by author
    if (userId) {
        andConditions.push({ userId });
    }
    // Filter by tags
    if (tags && tags.length > 0) {
        andConditions.push({ tags: { hasSome: tags } });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.blog.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    const total = await prisma_1.default.blog.count({ where: whereConditions });
    return {
        meta: { page, limit, total },
        data: result,
    };
};
const getBlogById = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blog ID format");
    }
    const blog = await prisma_1.default.blog.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    return blog;
};
const createBlog = async (userId, payload) => {
    // Check if user exists
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    // Set the author ID
    payload.userId = userId;
    const result = await prisma_1.default.blog.create({
        data: payload,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    return result;
};
const updateBlog = async (id, userId, payload) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blog ID format");
    }
    // Check if blog exists
    const blog = await prisma_1.default.blog.findUnique({
        where: { id },
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    // Check if user is the author or an admin
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (blog.userId !== userId && user.role !== "admin" && user.role !== "superadmin") {
        throw new AppError_1.default(403, "You are not authorized to update this blog");
    }
    const result = await prisma_1.default.blog.update({
        where: { id },
        data: payload,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    return result;
};
const deleteBlog = async (id, userId) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blog ID format");
    }
    // Check if blog exists
    const blog = await prisma_1.default.blog.findUnique({
        where: { id },
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    // Check if user is the author or an admin
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (blog.userId !== userId && user.role !== "admin" && user.role !== "superadmin") {
        throw new AppError_1.default(403, "You are not authorized to delete this blog");
    }
    const result = await prisma_1.default.blog.delete({
        where: { id },
    });
    return result;
};
exports.BlogService = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};
