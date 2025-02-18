"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVolunteerZodSchema = exports.createVolunteerZodSchema = void 0;
const zod_1 = require("zod");
exports.createVolunteerZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        skills: zod_1.z.array(zod_1.z.string()).nonempty({
            message: "At least one skill is required",
        }),
        availability: zod_1.z.string({
            required_error: "Availability is required",
        }),
        experience: zod_1.z.string({
            required_error: "Experience is required",
        }),
    }),
});
exports.updateVolunteerZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        availability: zod_1.z.string().optional(),
        experience: zod_1.z.string().optional(),
    }),
});
