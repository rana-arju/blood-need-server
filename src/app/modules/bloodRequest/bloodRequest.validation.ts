import { z } from "zod";

export const createBloodRequestZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    blood: z.string({
      required_error: "Blood type is required",
    }),
    bloodAmount: z
      .number({
        required_error: "Units are required",
      })
      .positive(),
    division: z.string({
      required_error: "Division is required",
    }),
    district: z.string({
      required_error: "District is required",
    }),
    upazila: z.string({
      required_error: "Upzila is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
    hospitalName: z.string({
      required_error: "hospitalName/Donation center is required",
    }),
  }),
});

export const updateBloodRequestZodSchema = z.object({
  body: z.object({
    blood: z.string().optional(),
    units: z.number().positive().optional(),
    location: z.string().optional(),
    urgency: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["pending", "fulfilled", "cancelled"]).optional(),
  }),
});
