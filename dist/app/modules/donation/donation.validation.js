"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDonorStatusZodSchema = exports.updateDonationOfferZodSchema = exports.createDonationOfferZodSchema = void 0;
const zod_1 = require("zod");
const bson_1 = require("bson");
exports.createDonationOfferZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        bloodRequestId: zod_1.z.string().refine((val) => bson_1.ObjectId.isValid(val), {
            message: "Invalid bloodRequestId format",
        }),
    }),
});
exports.updateDonationOfferZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "accepted", "rejected", "completed"]).optional(),
        message: zod_1.z.string().optional(),
    }),
});
exports.updateDonorStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "selected", "confirmed", "cancelled"]),
    }),
});
