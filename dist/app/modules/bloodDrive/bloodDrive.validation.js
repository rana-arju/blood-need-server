"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloodDriveZodSchema = exports.createBloodDriveZodSchema = void 0;
const zod_1 = require("zod");
exports.createBloodDriveZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        organizer: zod_1.z.string({
            required_error: "Organizer is required",
        }),
        location: zod_1.z.string({
            required_error: "Location is required",
        }),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .transform((str) => new Date(str)),
        startTime: zod_1.z.string({
            required_error: "Start time is required",
        }),
        endTime: zod_1.z.string({
            required_error: "End time is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
    }),
});
exports.updateBloodDriveZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        organizer: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        date: zod_1.z
            .string()
            .transform((str) => new Date(str))
            .optional(),
        startTime: zod_1.z.string().optional(),
        endTime: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
