"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdSchema = exports.updateBlogZodSchema = exports.createBlogZodSchema = void 0;
const zod_1 = require("zod");
const bson_1 = require("bson");
exports.createBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Title is required",
        })
            .min(3, "Title must be at least 3 characters"),
        content: zod_1.z
            .string({
            required_error: "Content is required",
        })
            .min(10, "Content must be at least 10 characters"),
        image: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters").optional(),
        content: zod_1.z.string().min(10, "Content must be at least 10 characters").optional(),
        image: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.blogIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine((val) => bson_1.ObjectId.isValid(val), {
            message: "Invalid blog ID format",
        }),
    }),
});
