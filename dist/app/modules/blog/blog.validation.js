"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogZodSchema = exports.createBlogZodSchema = void 0;
const zod_1 = require("zod");
exports.createBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        content: zod_1.z.string({
            required_error: "Content is required",
        }),
        image: zod_1.z.string({
            required_error: "Content is required",
        }),
    }),
});
exports.updateBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        content: zod_1.z.string({
            required_error: "Content is required",
        }),
        image: zod_1.z.string({
            required_error: "Content is required",
        }),
    }),
});
