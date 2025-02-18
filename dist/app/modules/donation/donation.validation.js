"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDonationZodSchema = exports.createDonationZodSchema = void 0;
const zod_1 = require("zod");
exports.createDonationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .transform((str) => new Date(str)),
        amount: zod_1.z
            .number({
            required_error: "Amount is required",
        })
            .positive(),
        location: zod_1.z.string({
            required_error: "Location is required",
        }),
    }),
});
exports.updateDonationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z
            .string()
            .transform((str) => new Date(str))
            .optional(),
        amount: zod_1.z.number().positive().optional(),
        location: zod_1.z.string().optional(),
    }),
});
