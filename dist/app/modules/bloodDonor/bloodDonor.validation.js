"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloodDonorZodSchema = exports.createBloodDonorZodSchema = void 0;
const zod_1 = require("zod");
exports.createBloodDonorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        lastDonationDate: zod_1.z
            .string({
            required_error: "Last donation date is required",
        })
            .transform((str) => new Date(str)),
        totalDonations: zod_1.z
            .number({
            required_error: "Total donations is required",
        })
            .int()
            .nonnegative(),
        eligibleToDonateSince: zod_1.z
            .string({
            required_error: "Eligible to donate since date is required",
        })
            .transform((str) => new Date(str)),
    }),
});
exports.updateBloodDonorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        lastDonationDate: zod_1.z
            .string()
            .transform((str) => new Date(str))
            .optional(),
        totalDonations: zod_1.z.number().int().nonnegative().optional(),
        eligibleToDonateSince: zod_1.z
            .string()
            .transform((str) => new Date(str))
            .optional(),
    }),
});
