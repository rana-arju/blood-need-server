import { z } from "zod";

export const createBloodRequestZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    bloodType: z.string({
      required_error: "Blood type is required",
    }),
    units: z
      .number({
        required_error: "Units are required",
      })
      .positive(),
    location: z.string({
      required_error: "Location is required",
    }),
    urgency: z.enum(["low", "medium", "high"], {
      required_error: "Urgency is required",
    }),
  }),
});

export const updateBloodRequestZodSchema = z.object({
  body: z.object({
    bloodType: z.string().optional(),
    units: z.number().positive().optional(),
    location: z.string().optional(),
    urgency: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["pending", "fulfilled", "cancelled"]).optional(),
  }),
});
