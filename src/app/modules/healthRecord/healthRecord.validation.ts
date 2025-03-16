import { z } from "zod";

export const createHealthRecordZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    hemoglobin: z.number({
      required_error: "Hemoglobin is required",
    }),
    bloodPressure: z.string({
      required_error: "Blood pressure is required",
    }),
    weight: z.number({
      required_error: "Weight is required",
    }),
    height: z.number().optional(),
    pulse: z.number().optional(),
    notes: z.string().optional(),
  }),
});

export const updateHealthRecordZodSchema = z.object({
  body: z.object({
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val))
      .optional(),
    hemoglobin: z.number().optional(),
    bloodPressure: z.string().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
    pulse: z.number().optional(),
    notes: z.string().optional(),
    // User fields that might be updated
    blood: z.string().optional(),
    dateOfBirth: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val))
      .optional(),
    lastDonationDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val))
      .optional(),
  }),
});
