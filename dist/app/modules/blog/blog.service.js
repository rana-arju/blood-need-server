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
exports.BlogService = {
    getAllBlogs,
    getBlogById,
};
