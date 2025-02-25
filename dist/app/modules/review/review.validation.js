"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewZodSchema = exports.createReviewZodSchema = void 0;
const zod_1 = require("zod");
exports.createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string({
            required_error: "Comment is required",
        }),
    }),
});
exports.updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string(),
    }),
});
