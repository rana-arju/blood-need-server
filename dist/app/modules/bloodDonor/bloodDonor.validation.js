"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloodDonorZodSchema = exports.createBloodDonorZodSchema = void 0;
const zod_1 = require("zod");
exports.createBloodDonorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        whatsappNumber: zod_1.z.string({
            required_error: "whatsappNumber is required",
        }),
        facebookId: zod_1.z.string({
            required_error: "facebookId is required",
        }),
        emergencyContact: zod_1.z.string({
            required_error: "Emergency Contact is required",
        }),
        lastDonationDate: zod_1.z
            .string()
            .transform((str) => new Date(str))
            .optional(),
        totalDonations: zod_1.z.number().int().nonnegative().default(0),
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
