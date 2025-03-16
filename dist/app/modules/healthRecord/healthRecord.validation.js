"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHealthRecordZodSchema = exports.createHealthRecordZodSchema = void 0;
const zod_1 = require("zod");
exports.createHealthRecordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        date: zod_1.z
            .string()
            .or(zod_1.z.date())
            .transform((val) => new Date(val)),
        hemoglobin: zod_1.z.number({
            required_error: "Hemoglobin is required",
        }),
        bloodPressure: zod_1.z.string({
            required_error: "Blood pressure is required",
        }),
        weight: zod_1.z.number({
            required_error: "Weight is required",
        }),
        height: zod_1.z.number().optional(),
        pulse: zod_1.z.number().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateHealthRecordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z
            .string()
            .or(zod_1.z.date())
            .transform((val) => new Date(val))
            .optional(),
        hemoglobin: zod_1.z.number().optional(),
        bloodPressure: zod_1.z.string().optional(),
        weight: zod_1.z.number().optional(),
        height: zod_1.z.number().optional(),
        pulse: zod_1.z.number().optional(),
        notes: zod_1.z.string().optional(),
        // User fields that might be updated
        blood: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z
            .string()
            .or(zod_1.z.date())
            .transform((val) => new Date(val))
            .optional(),
        lastDonationDate: zod_1.z
            .string()
            .or(zod_1.z.date())
            .transform((val) => new Date(val))
            .optional(),
    }),
});
