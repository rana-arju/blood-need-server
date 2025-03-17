"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloodDriveZodSchema = exports.createBloodDriveZodSchema = void 0;
const zod_1 = require("zod");
exports.createBloodDriveZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        organizer: zod_1.z.string({
            required_error: "Organizer is required",
        }),
        address: zod_1.z.string({
            required_error: "Address is required",
        }),
        division: zod_1.z.string({
            required_error: "Division is required",
        }),
        district: zod_1.z.string({
            required_error: "District is required",
        }),
        upazila: zod_1.z.string({
            required_error: "Upazila is required",
        }),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .transform((str) => new Date(str)),
        banner: zod_1.z.string({
            required_error: "banner is required",
        }),
    }),
});
exports.updateBloodDriveZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        organizer: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        division: zod_1.z.string({
            required_error: "Division is required",
        }),
        district: zod_1.z.string({
            required_error: "District is required",
        }),
        upazila: zod_1.z.string({
            required_error: "Upazila is required",
        }),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .transform((str) => new Date(str)),
        banner: zod_1.z.string({
            required_error: "banner is required",
        }),
    }),
});
