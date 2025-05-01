"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloodRequestZodSchema = exports.createBloodRequestZodSchema = void 0;
const zod_1 = require("zod");
exports.createBloodRequestZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        blood: zod_1.z.string({
            required_error: "Blood type is required",
        }),
        bloodAmount: zod_1.z
            .number({
            required_error: "Units are required",
        })
            .positive(),
        division: zod_1.z.string({
            required_error: "Division is required",
        }),
        district: zod_1.z.string({
            required_error: "District is required",
        }),
        upazila: zod_1.z.string({
            required_error: "Upzila is required",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is required",
        }),
        hospitalName: zod_1.z.string({
            required_error: "hospitalName/Donation center is required",
        }),
    }),
});
exports.updateBloodRequestZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        blood: zod_1.z.string().optional(),
        units: zod_1.z.number().positive().optional(),
        location: zod_1.z.string().optional(),
        urgency: zod_1.z.enum(["low", "medium", "high"]).optional(),
        status: zod_1.z.enum(["pending", "fulfilled", "cancelled"]).optional(),
    }),
});
